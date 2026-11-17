import { Plan } from './plan.model';

/**
 * Index of plans by their `family`, `range` and `settlement` fields from the
 * database, used to populate the dropdowns.
 *
 * Options follow the order of the given plans (by `id`): each family, range
 * or settlement appears at the position of the first plan that has it.
 * To change the dropdown order, change the order of the ids in the database.
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
   * Plan that best matches the combination: the exact one if it exists;
   * otherwise keeps family + range (or just the family) and takes the first
   * available option.
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
