import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { mockedPlans } from '../../mockedData';
import { Plan } from '../../models/plan.model';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent implements OnInit {
  mockedPlans = mockedPlans;
  selectedPlan = mockedPlans[0];
  @Output() planChanged = new EventEmitter<Plan>();

  ngOnInit(): void {
    this.planChanged.emit(this.selectedPlan);
  }

  onSelect(option: Plan) {
    this.selectedPlan = option;
    this.planChanged.emit(this.selectedPlan);
  }
}
