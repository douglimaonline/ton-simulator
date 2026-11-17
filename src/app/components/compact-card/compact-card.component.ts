import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Plan } from '../../models/plan.model';
import { InterestCalculator } from '../../models/InterestCalculator.model';
import { InterestCalculatorService } from '../../InterestCalculatorService';

interface CompactRow {
  index: number;
  rate: number;
  receive: number;
  charge: number;
}

/**
 * Versão mobile da calculadora: um único card com "a receber" e "a cobrar"
 * na mesma tabela, para caber inteira em um print de tela.
 */
@Component({
  selector: 'app-compact-card',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxCurrencyDirective, DropdownComponent],
  templateUrl: './compact-card.component.html',
  styleUrl: './compact-card.component.css',
})
export class CompactCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() planOptions: Plan[] | null = [];
  baseValue: number = 3000;
  selectedPlan?: Plan;
  rows: CompactRow[] = [];
  private readonly inputSubject = new Subject<number>();
  private subs = new Subscription();

  constructor(
    private readonly interestCalculatorService: InterestCalculatorService
  ) {}

  ngOnChanges(): void {
    if (this.planOptions && this.planOptions.length > 0 && !this.selectedPlan) {
      this.selectedPlan = this.planOptions[0];
      this.updateInterestValue();
    }
  }

  ngOnInit(): void {
    this.subs.add(
      this.inputSubject
        .pipe(debounceTime(400))
        .subscribe(() => this.updateInterestValue())
    );

    this.subs.add(
      this.interestCalculatorService.interestCalculator$.subscribe((value) => {
        this.selectedPlan = value.selectedPlan ?? this.selectedPlan;
        this.baseValue = value.baseValue ?? this.baseValue;
        this.rows = this.buildRows(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onInputChange(input: number): void {
    this.baseValue = input;
    this.inputSubject.next(input);
  }

  planChanged(plan: Plan): void {
    this.selectedPlan = plan;
    this.updateInterestValue();
  }

  selectAll(event: MouseEvent): void {
    (event.target as HTMLInputElement).select();
  }

  label(index: number): string {
    return index === 0 ? 'Débito' : index === 1 ? 'À vista' : `${index}x`;
  }

  private updateInterestValue(): void {
    this.interestCalculatorService.setInterestCalculator(
      new InterestCalculator(this.baseValue, this.selectedPlan)
    );
  }

  private buildRows(value: InterestCalculator): CompactRow[] {
    if (!value.interests || !value.selectedPlan) return [];
    const charged = value.feesToCostumer().interests ?? [];
    return value.interests.map((interest, i) => ({
      index: interest.index,
      rate: interest.rate,
      receive: interest.result,
      charge: charged[i]?.result ?? 0,
    }));
  }
}
