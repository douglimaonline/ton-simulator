export class Plan {
  id: number;
  title: string;
  fees: number[];

  constructor(id: number, title: string, fees: number[]) {
    if (fees.length !== 13) {
      throw new Error('fees array must have exactly 13 elements');
    }
    this.id = id;
    this.title = title;
    this.fees = fees;
  }
}
