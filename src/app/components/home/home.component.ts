import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plan } from '../../models/plan.model';
import { mockedPlans } from '../../mockedData';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  planOptions: Plan[] = [];
  ngOnInit(): void {
    // this.fetchPlans(); // Uncomment this line when env variables are set
    this.planOptions = mockedPlans;
  }

  async fetchPlans(): Promise<void> {
    try {
      const q = query(collection(db, 'Plans'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.planOptions.push(new Plan(data['title'], data['fees']));
      });
    } catch (error) {
      console.error('Error to get plans:', error);
    }
  }
}
