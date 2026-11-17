import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';
import { Plan } from '../../models/plan.model';
import { PlanCatalog } from '../../models/plan-catalog';

/** Labels shown for the database `settlement` values. */
const SETTLEMENT_LABELS: Record<string, string> = {
  'Mesmo dia': 'Na hora',
};

/**
 * Plan selection with three dropdowns: plan (`family`), billing range
 * (`range`) and settlement (`settlement`). Each one only offers options that
 * exist in the database for the previous choices. Plans without a settlement
 * (promotional plans) leave the settlement dropdown disabled.
 */
@Component({
  selector: 'app-plan-selector',
  standalone: true,
  imports: [DropdownComponent],
  templateUrl: './plan-selector.component.html',
  styleUrl: './plan-selector.component.css',
})
export class PlanSelectorComponent implements OnChanges {
  @Input() planOptions?: Plan[] | null;
  @Input() selectedPlan?: Plan;
  @Output() planChanged = new EventEmitter<Plan>();

  family?: string;
  range?: string;
  settlement?: string | null;

  familyOptions: DropdownOption<string>[] = [];
  rangeOptions: DropdownOption<string>[] = [];
  settlementOptions: DropdownOption<string>[] = [];

  /**
   * Last chosen settlement. Kept while a plan without a settlement
   * (promotional) is selected, so it can be applied again on the next change.
   */
  private preferredSettlement: string | null = null;

  private catalog = new PlanCatalog([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['planOptions']) {
      this.catalog = new PlanCatalog(this.planOptions ?? []);
      this.familyOptions = this.catalog
        .families()
        .map((f) => ({ value: f, label: f }));
    }

    const plan = this.selectedPlan ?? this.planOptions?.[0];
    if (!plan) return;
    this.syncFrom(plan);
    if (!this.selectedPlan) this.planChanged.emit(plan);
  }

  onFamily(family: string): void {
    this.select(family, this.range!, this.preferredSettlement);
  }

  onRange(range: string): void {
    this.select(this.family!, range, this.preferredSettlement);
  }

  onSettlement(settlement: string): void {
    this.select(this.family!, this.range!, settlement);
  }

  private select(family: string, range: string, settlement: string | null): void {
    const plan = this.catalog.find(family, range, settlement);
    if (!plan) return;
    this.selectedPlan = plan;
    this.syncFrom(plan);
    this.planChanged.emit(plan);
  }

  private syncFrom(plan: Plan): void {
    this.family = plan.family;
    this.range = plan.range;
    this.settlement = plan.settlement;
    if (plan.settlement !== null) this.preferredSettlement = plan.settlement;

    this.rangeOptions = this.catalog
      .ranges(plan.family)
      .map((r) => ({ value: r, label: r }));

    this.settlementOptions = this.catalog
      .settlements(plan.family, plan.range)
      .filter((s): s is string => s !== null)
      .map((s) => ({ value: s, label: SETTLEMENT_LABELS[s] ?? s }));
  }
}
