export class Plan {
  title: string;
  fees: number[];

  constructor(title: string, fees: number[]) {
    if (fees.length !== 13) {
      throw new Error('fees array must have exactly 13 elements');
    }
    this.title = title;
    this.fees = fees;
  }
}
