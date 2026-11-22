export class Plan {
  id: number;
  fees: number[];
  family: string;
  range: string;
  settlement: string | null;

  constructor(
    id: number,
    fees: number[],
    facets: Pick<Plan, 'family' | 'range' | 'settlement'>
  ) {
    this.id = id;
    this.fees = fees;
    this.family = facets.family;
    this.range = facets.range;
    this.settlement = facets.settlement;
  }

  /** Readable name built from the facets, e.g. "Ton Top · Até 6k · 1 dia útil". */
  get label(): string {
    return [this.family, this.range, this.settlement]
      .filter((part) => part)
      .join(' · ');
  }
}
