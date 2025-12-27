import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Plan } from '../../models/plan.model';
import { FeesFormComponent } from '../fees-form/fees-form.component';
import { of, Observable } from 'rxjs';
import { PlanService } from '../../services/plan.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, FeesFormComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  planOptions$: Observable<Plan[]>;
  collapsed: boolean = false;

  constructor(private planService: PlanService) {
    this.planOptions$ = this.planService.getPlans();
  }

  collapseToggle(): void {
    this.collapsed = !this.collapsed;
  }
}
