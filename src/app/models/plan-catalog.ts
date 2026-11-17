import { Plan } from './plan.model';

/**
 * Índice dos planos pelos campos `family`, `range` e `settlement` vindos do
 * banco, para alimentar os dropdowns.
 *
 * As opções seguem a ordem dos planos recebidos (por `id`): cada família,
 * faixa ou recebimento aparece na posição do primeiro plano em que ocorre.
 * Para mudar a ordem nos dropdowns, basta mudar a ordem dos ids no banco.
 */
export class PlanCatalog {
  constructor(private readonly plans: Plan[]) {}

  families(): string[] {
    return unique(this.plans.map((p) => p.family));
  }

  ranges(family: string): string[] {
    return unique(
      this.plans.filter((p) => p.family === family).map((p) => p.range)
    );
  }

  settlements(family: string, range: string): (string | null)[] {
    return unique(
      this.plans
        .filter((p) => p.family === family && p.range === range)
        .map((p) => p.settlement)
    );
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
    return this.plans.find(
      (p) => p.family === family && p.range === r && p.settlement === s
    );
  }
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
