export class Plan {
  id: number;
  title: string;
  fees: number[];
  /** Família do plano, ex.: "Ton Mega+", "Ton Top", "Super Mega". */
  family?: string;
  /** Faixa de faturamento, ex.: "Até 3k", "3k a 6k", "Acima de 30k", "Promocional". */
  range?: string;
  /** Prazo de recebimento, ex.: "Mesmo dia", "1 dia útil"; `null` se não se aplica. */
  settlement?: string | null;

  constructor(
    id: number,
    title: string,
    fees: number[],
    facets: Pick<Plan, 'family' | 'range' | 'settlement'> = {}
  ) {
    this.id = id;
    this.title = title;
    this.fees = fees;
    this.family = facets.family;
    this.range = facets.range;
    this.settlement = facets.settlement;
  }
}
