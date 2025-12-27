import { Injectable } from '@angular/core';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Plan } from '../models/plan.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor() {}

  getPlans(): Observable<Plan[]> {
    return from(this.fetchPlans());
  }

  private async fetchPlans(): Promise<Plan[]> {
    const plans: Plan[] = [];
    const q = query(collection(db, 'Plans'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      plans.push(new Plan(data['id'], data['title'], data['fees']));
    });

    return plans.sort((a, b) => a.id - b.id);
  }
}
