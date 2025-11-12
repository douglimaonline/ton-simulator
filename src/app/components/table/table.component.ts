import {
  Component,
  Input,
  LOCALE_ID,
  DEFAULT_CURRENCY_CODE,
} from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { InterestCalculator } from '../../models/InterestCalculator.model';

registerLocaleData(localePt, 'pt-BR');

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
}
