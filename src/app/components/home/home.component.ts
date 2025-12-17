import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plan } from '../../models/plan.model';
import { FeesFormComponent } from '../fees-form/fees-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, FeesFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  planOptions: Plan[] = [];
  collapsed: boolean = false;

  ngOnInit(): void {
    this.fetchPlans();
  }

  collapseToggle(): void {
    this.collapsed = !this.collapsed;
  }

  async fetchPlans(): Promise<void> {
    try {
      const q = query(collection(db, 'Plans'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.planOptions.push(
          new Plan(data['id'], data['title'], data['fees'])
        );
      });
      this.planOptions.sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error('Error to get plans:', error);
    }
  }
}
