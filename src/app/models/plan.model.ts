export class Plan {
  id: number;
  title: string;
  fees: number[];
  family: string;
  range: string;
  settlement: string | null;

  constructor(
    id: number,
    title: string,
    fees: number[],
    facets: Pick<Plan, 'family' | 'range' | 'settlement'>
  ) {
    this.id = id;
    this.title = title;
    this.fees = fees;
    this.family = facets.family;
    this.range = facets.range;
    this.settlement = facets.settlement;
  }
}
