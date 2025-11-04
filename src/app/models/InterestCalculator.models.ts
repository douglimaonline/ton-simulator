export class InterestCalculator {
  baseValue: number;
  interests: Interest[];

  constructor(baseValue: number, interestRates: number[]) {
    if (interestRates.length !== 13) {
      throw new Error('interestRates array must have exactly 13 elements');
    }
    this.baseValue = baseValue;
    this.interests = interestRates.map((rate, i) => ({
      index: i,
      rate: rate,
      result: this.baseValue - this.baseValue * (rate / 100),
    }));
  }

  // updateInterest(rateIndex: number): number {
  //   if (rateIndex < 0 || rateIndex >= this.interests.length) {
  //     throw new Error('Invalid rate index');
  //   }
  //   const rate = this.interestRates[rateIndex];
  //   const result = this.baseValue - this.baseValue * rate;
  //   this.interestResults[rateIndex] = result;
  //   return result;
  // }
}

class Interest {
  index!: number;
  rate!: number;
  result!: number;
}
