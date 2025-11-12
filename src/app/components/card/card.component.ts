import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { TableComponent } from '../table/table.component';
import { FormsModule } from '@angular/forms';
import { Plan } from '../../models/plan.model';
import { mockedPlans } from '../../mockedData';
import { InterestCalculator } from '../../models/InterestCalculator.model';
import { NgxCurrencyDirective } from 'ngx-currency';
import { InterestCalculatorService } from '../../InterestCalculatorService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    DropdownComponent,
    TableComponent,
    FormsModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() feesToCostumer: boolean = false;
  baseValue: number = 3000;
  planOptions: Plan[] = mockedPlans;
  selectedPlan?: Plan;
  interestValue: InterestCalculator = new InterestCalculator();
  private sub!: Subscription;

  constructor(
    private readonly interestCalculatorService: InterestCalculatorService
  ) {}

  ngOnInit(): void {
    this.sub = this.interestCalculatorService.interestCalculator$.subscribe(
      (interestValue) => {
        this.interestValue = this.feesToCostumer
          ? interestValue.feesToCostumer()
          : interestValue;
        this.selectedPlan = interestValue.selectedPlan;
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onInputChange(input: number): void {
    this.baseValue = input;
    this.updateInterestValue();
  }

  planChanged(plan: Plan): void {
    this.selectedPlan = plan;
    this.updateInterestValue();
  }

  updateInterestValue(): void {
    const newInterestValue = new InterestCalculator(
      this.baseValue,
      this.selectedPlan?.fees,
      this.selectedPlan
    );
    this.interestCalculatorService.setInterestCalculator(newInterestValue);
  }

  selectAll(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    input.select();
  }
}
