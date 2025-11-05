import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { InterestCalculator } from '../../models/InterestCalculator.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgFor],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() interestValue!: InterestCalculator;
}
