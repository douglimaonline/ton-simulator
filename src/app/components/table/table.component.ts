import {
  Component,
  Input,
  LOCALE_ID,
  DEFAULT_CURRENCY_CODE,
} from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { InterestCalculator } from '../../models/InterestCalculator.model';
import { InstallmentsViewService } from '../../services/installments-view.service';

registerLocaleData(localePt, 'pt-BR');

/** Modalidades exibidas no resumo (antes de "Ver todas as parcelas"). */
const SUMMARY_UPFRONT = [0, 1];
const SUMMARY_INSTALLMENTS = [2, 12, 21];

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() feesToCostumer: boolean = false;
  @Input() interestValue!: InterestCalculator;

  constructor(private readonly installmentsView: InstallmentsViewService) {}

  /** Compartilhado entre os cards: expandir um expande todos. */
  get showAll(): boolean {
    return this.installmentsView.showAll();
  }

  get upfrontInterests() {
    return (this.interestValue?.interests ?? []).filter((i) =>
      SUMMARY_UPFRONT.includes(i.index)
    );
  }

  get summaryInstallments() {
    return (this.interestValue?.interests ?? []).filter((i) =>
      SUMMARY_INSTALLMENTS.includes(i.index)
    );
  }

  toggleShowAll(): void {
    this.installmentsView.toggle();
  }
}
