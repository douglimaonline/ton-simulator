import { Plan } from './plan.model';

export class InterestCalculator {
  baseValue?: number;
  interests?: Interest[];
  selectedPlan?: Plan;

  constructor(
    baseValue?: number,
    interestRates?: number[],
    selectedPlan?: Plan,
    interests?: Interest[]
  ) {
    this.baseValue = baseValue;
    this.selectedPlan = selectedPlan;
    this.interests =
      interests ??
      interestRates?.map((rate, i) => ({
        index: i,
        rate: rate,
        result: this.baseValue! - this.baseValue! * (rate / 100),
      }));
  }

  public feesToCostumer(): InterestCalculator {
    const interests = this.selectedPlan?.fees.map((rate, i) => ({
      index: i,
      rate: rate,
      result: this.baseValue! / (1 - rate / 100),
    }));
    return new InterestCalculator(
      this.baseValue,
      undefined,
      this.selectedPlan,
      interests
    );
  }
}

class Interest {
  index!: number;
  rate!: number;
  result!: number;
}
