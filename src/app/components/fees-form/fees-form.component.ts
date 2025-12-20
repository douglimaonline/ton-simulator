import { Component, Input } from '@angular/core';
import { Plan } from '../../models/plan.model';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fees-form',
  standalone: true,
  imports: [CommonModule, DropdownComponent, NgxCurrencyDirective, FormsModule],
  templateUrl: './fees-form.component.html',
  styleUrl: './fees-form.component.css',
})
export class FeesFormComponent {
  @Input() planOptions: Plan[] = [];
  selectedPlan?: Plan;
  modelFees: number[] = Array(13);
  editMode: boolean = false;

  planChanged(plan: Plan): void {
    this.selectedPlan = plan;
    this.resetForm();
  }

  selectAll(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  onInputChange(input: number, index: number): void {
    this.modelFees[index] = input / 100;
  }

  onClick(): void {
    if (!this.editMode) {
      this.editMode = !this.editMode;
      return;
    }

    const editedPlan = new Plan(
      this.selectedPlan!.id,
      this.selectedPlan!.title,
      this.selectedPlan!.fees.map((fee, i) => this.modelFees[i] ?? fee)
    );
    const isValid = this.validateChanges(editedPlan);
    console.log('Valid Change:', isValid);
  }

  resetForm(): void {
    this.editMode = false;
    this.modelFees = Array(13);
  }

  validateChanges(editedPlan: Plan): boolean {
    return !(JSON.stringify(this.selectedPlan) === JSON.stringify(editedPlan));
  }
}
