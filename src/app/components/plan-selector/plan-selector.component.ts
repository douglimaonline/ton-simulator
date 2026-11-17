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
import { PlanCatalog } from '../../models/plan-facets';

/**
 * Seleção de plano em dois dropdowns: plano (Ton Mega+, Ton Top, Super Mega)
 * e faixa de faturamento. As faixas dependem do plano escolhido, então só
 * combinações existentes no banco podem ser escolhidas. O recebimento não é
 * escolhido aqui: mantém o do plano atual quando a combinação existe.
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
    this.select(family, this.range!, this.settlement ?? null);
  }

  onRange(range: string): void {
    this.select(this.family!, range, this.settlement ?? null);
  }

  private select(family: string, range: string, settlement: string | null): void {
    const plan = this.catalog.find(family, range, settlement);
    if (!plan) return;
    this.selectedPlan = plan;
    this.syncFrom(plan);
    this.planChanged.emit(plan);
  }

  private syncFrom(plan: Plan): void {
    const facets = this.catalog.facetsOf(plan);
    if (!facets) return;
    this.family = facets.family;
    this.range = facets.range;
    this.settlement = facets.settlement;

    this.rangeOptions = this.catalog
      .ranges(facets.family)
      .map((r) => ({ value: r, label: r }));
  }
}
