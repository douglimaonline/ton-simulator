import { Component, Input, OnChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { InterestCalculator } from '../../models/InterestCalculator.models';
import { mockedInterestRates } from '../../mockeData';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgFor],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnChanges {
  @Input() baseValue!: number;
  interestRates = mockedInterestRates;
  feeTable!: InterestCalculator;

  ngOnChanges(): void {
    this.feeTable = new InterestCalculator(this.baseValue, mockedInterestRates);
  }
}
