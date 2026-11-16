import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Plan } from '../../models/plan.model';
import { FeesFormComponent } from '../fees-form/fees-form.component';
import { Observable } from 'rxjs';
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
  activeTab: 'calculator' | 'fees' = 'calculator';

  constructor(private planService: PlanService) {
    this.planOptions$ = this.planService.getPlans();
  }

  selectTab(tab: 'calculator' | 'fees'): void {
    this.activeTab = tab;
  }
}
