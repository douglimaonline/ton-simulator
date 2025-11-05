import { Component } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { TableComponent } from '../table/table.component';
import { FormsModule } from '@angular/forms';
import { Plan } from '../../models/plan.model';
import { InterestCalculator } from '../../models/InterestCalculator.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [DropdownComponent, TableComponent, FormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  baseValue: number = 3000;
  selectedPlan?: Plan;
  interestValue: InterestCalculator = new InterestCalculator();

  onInputChange(input: Event): void {
    const inputElement = input.target as HTMLInputElement;
    this.baseValue = Number(inputElement.value);
    this.updateInterestValue();
  }

  planChanged(plan: Plan): void {
    this.selectedPlan = plan;
    this.updateInterestValue();
  }

  updateInterestValue(): void {
    this.interestValue = new InterestCalculator(
      this.baseValue,
      this.selectedPlan?.fees
    );
  }
}
