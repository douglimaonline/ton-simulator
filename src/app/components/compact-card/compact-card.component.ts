import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Plan } from '../../models/plan.model';
import { InterestCalculator } from '../../models/InterestCalculator.model';
import { InterestCalculatorService } from '../../InterestCalculatorService';

/** Parcelas exibidas no resumo (antes de "Ver todas as parcelas"). */
const SUMMARY_INSTALLMENTS = [2, 5, 8, 10, 12, 21];

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
  showAll = false;
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

  /** Débito e à vista (parte de cima do resumo). */
  get upfrontRows(): CompactRow[] {
    return this.rows.filter((r) => r.index === 0 || r.index === 1);
  }

  /** Crédito parcelado no resumo: apenas 2x, 5x, 8x, 10x, 12x e 21x. */
  get installmentRows(): CompactRow[] {
    return this.rows.filter((r) => SUMMARY_INSTALLMENTS.includes(r.index));
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
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
