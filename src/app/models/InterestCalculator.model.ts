export class InterestCalculator {
  baseValue?: number;
  interests?: Interest[];

  constructor(baseValue?: number, interestRates?: number[]) {
    this.baseValue = baseValue;
    this.interests = interestRates?.map((rate, i) => ({
      index: i,
      rate: rate,
      result: this.baseValue! - this.baseValue! * (rate / 100),
    }));
  }
}

class Interest {
  index!: number;
  rate!: number;
  result!: number;
}
