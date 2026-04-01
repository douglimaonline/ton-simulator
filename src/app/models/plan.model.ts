export class Plan {
  id: number;
  title: string;
  fees: number[];

  constructor(id: number, title: string, fees: number[]) {
    this.id = id;
    this.title = title;
    this.fees = fees;
  }
}
