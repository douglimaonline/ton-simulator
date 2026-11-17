import { Plan } from './plan.model';

/**
 * Os planos no Firestore têm apenas `title` (ex.: "Ton Top 6k a 10k - 1 dia").
 * Aqui o título é decomposto em três facetas — plano, faixa de faturamento e
 * recebimento — para alimentar os três dropdowns.
 *
 * Variações de escrita já existentes no banco são normalizadas:
 * "3k-6k" / "3k a 6k", "Acima de 30k" / "+30k", "Mesmo dia" / "Mesmo Dia".
 */
export interface PlanFacets {
  family: string;
  range: string;
  /** `null` quando o título não informa (ex.: planos promocionais). */
  settlement: string | null;
}

/** Ordem de exibição das famílias de plano. */
const FAMILIES = ['Ton Mega+', 'Ton Top', 'Super Mega'];

export const PROMO_RANGE = 'Promocional';

export function parsePlanTitle(title: string): PlanFacets {
  const clean = title.trim().replace(/\s+/g, ' ');
  const family =
    FAMILIES.find((f) => clean.toLowerCase().startsWith(f.toLowerCase())) ??
    clean.split(' - ')[0];
  const rest = clean.slice(family.length).trim();
  const [rangePart = '', settlementPart = ''] = rest.split(/\s+-\s+/);

  return {
    family,
    range: normalizeRange(rangePart),
    settlement: normalizeSettlement(settlementPart),
  };
}

/**
 * Facetas do plano: usa os campos `family`/`range`/`settlement` do documento
 * quando existirem e completa o que faltar a partir do título.
 */
export function facetsOf(plan: Plan): PlanFacets {
  const parsed = parsePlanTitle(plan.title);
  return {
    family: plan.family || parsed.family,
    range: plan.range || parsed.range,
    settlement:
      plan.settlement !== undefined ? plan.settlement : parsed.settlement,
  };
}

function normalizeRange(raw: string): string {
  const value = raw.trim();
  if (!value) return PROMO_RANGE;
  if (/promo/i.test(value)) return PROMO_RANGE;

  let m = value.match(/^at[eé]\s*(\d+k)$/i);
  if (m) return `Até ${m[1].toLowerCase()}`;

  m = value.match(/^(?:\+|acima de\s*)(\d+k)$/i);
  if (m) return `Acima de ${m[1].toLowerCase()}`;

  m = value.match(/^(\d+k)\s*(?:-|a)\s*(\d+k)$/i);
  if (m) return `${m[1].toLowerCase()} a ${m[2].toLowerCase()}`;

  return value;
}

function normalizeSettlement(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/mesmo\s*dia/i.test(value)) return 'Mesmo dia';
  const m = value.match(/^(\d+)\s*dias?/i);
  if (m) return m[1] === '1' ? '1 dia útil' : `${m[1]} dias úteis`;
  return value;
}

function familyOrder(family: string): number {
  const i = FAMILIES.indexOf(family);
  return i === -1 ? FAMILIES.length : i;
}

/** Promocional primeiro, depois faixas em ordem crescente de faturamento. */
function rangeOrder(range: string): number {
  if (range === PROMO_RANGE) return -1;
  if (range.startsWith('Até')) return 0;
  const n = range.match(/(\d+)k/);
  return n ? Number(n[1]) : Number.MAX_SAFE_INTEGER;
}

/** "Mesmo dia" antes de "1 dia útil", "2 dias úteis"... */
function settlementOrder(settlement: string | null): number {
  if (settlement === null) return -1;
  if (settlement === 'Mesmo dia') return 0;
  const n = settlement.match(/^(\d+)/);
  return n ? Number(n[1]) : Number.MAX_SAFE_INTEGER;
}

export interface FacetedPlan {
  plan: Plan;
  facets: PlanFacets;
}

/** Índice dos planos por faceta, com listas de opções já ordenadas. */
export class PlanCatalog {
  readonly entries: FacetedPlan[];

  constructor(plans: Plan[]) {
    this.entries = plans.map((plan) => ({ plan, facets: facetsOf(plan) }));
  }

  facetsOf(plan: Plan): PlanFacets | undefined {
    return this.entries.find((e) => e.plan.id === plan.id)?.facets;
  }

  families(): string[] {
    return unique(this.entries.map((e) => e.facets.family)).sort(
      (a, b) => familyOrder(a) - familyOrder(b)
    );
  }

  ranges(family: string): string[] {
    return unique(
      this.entries
        .filter((e) => e.facets.family === family)
        .map((e) => e.facets.range)
    ).sort((a, b) => rangeOrder(a) - rangeOrder(b));
  }

  settlements(family: string, range: string): (string | null)[] {
    return unique(
      this.entries
        .filter((e) => e.facets.family === family && e.facets.range === range)
        .map((e) => e.facets.settlement)
    ).sort((a, b) => settlementOrder(a) - settlementOrder(b));
  }

  /**
   * Plano que melhor atende à combinação: exata se existir; senão mantém
   * plano + faixa (ou só o plano) e pega a primeira opção disponível.
   */
  find(
    family: string,
    range: string,
    settlement: string | null
  ): Plan | undefined {
    const ranges = this.ranges(family);
    const r = ranges.includes(range) ? range : ranges[0];
    const settlements = this.settlements(family, r);
    const s = settlements.includes(settlement) ? settlement : settlements[0];
    return this.entries.find(
      (e) =>
        e.facets.family === family &&
        e.facets.range === r &&
        e.facets.settlement === s
    )?.plan;
  }
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
