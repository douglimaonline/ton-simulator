import { Component, HostListener } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Plan } from '../../models/plan.model';
import { FeesFormComponent } from '../fees-form/fees-form.component';
import { Observable } from 'rxjs';
import { PlanService } from '../../services/plan.service';
import { AsyncPipe } from '@angular/common';
import { CompactCardComponent } from '../compact-card/compact-card.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CompactCardComponent, FeesFormComponent, AsyncPipe, ThemeToggleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  planOptions$: Observable<Plan[]>;
  activeTab: 'calculator' | 'fees' = 'calculator';

  constructor(private planService: PlanService) {
    this.planOptions$ = this.planService.getPlans();
  }

  /** Exibe o link "voltar ao topo" quando o usuário chega ao fim da página. */
  showBackToTop = false;

  selectTab(tab: 'calculator' | 'fees'): void {
    this.activeTab = tab;
    // A altura da página muda ao trocar de aba
    setTimeout(() => this.updateBackToTop());
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateBackToTop(): void {
    const doc = document.documentElement;
    const nearBottom =
      window.innerHeight + window.scrollY >= doc.scrollHeight - 48;
    this.showBackToTop = window.scrollY > 0 && nearBottom;
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}
