import { Component, Input, OnChanges } from '@angular/core';
import { Plan } from '../../models/plan.model';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-fees-form',
  imports: [CommonModule, DropdownComponent],
  templateUrl: './fees-form.component.html',
  styleUrl: './fees-form.component.css',
})
export class FeesFormComponent implements OnChanges {
  @Input() planOptions: Plan[] = [];
  selectedPlan?: Plan;

  ngOnChanges(): void {
    if (this.planOptions.length > 0 && !this.selectedPlan) {
      this.selectedPlan = this.planOptions[0];
    }
  }

  planChanged(plan: Plan): void {
    this.selectedPlan = plan;
    console.log('plan', plan);
  }
}
