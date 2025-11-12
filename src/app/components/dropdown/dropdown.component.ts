import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Plan } from '../../models/plan.model';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent implements OnInit {
  @Input() planOptions?: Plan[];
  @Input() selectedPlan?: Plan;
  @Output() planChanged = new EventEmitter<Plan>();

  ngOnInit(): void {
    this.selectedPlan = this.planOptions?.[0];
    this.planChanged.emit(this.selectedPlan);
  }

  onSelect(option: Plan) {
    this.selectedPlan = option;
    this.planChanged.emit(this.selectedPlan);
  }
}
