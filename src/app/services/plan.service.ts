import { Injectable } from '@angular/core';
import { collection, getDocs, query, doc, setDoc } from 'firebase/firestore';
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

  async editPlan(
    plan: Plan
  ): Promise<{ success: boolean; plan?: string; message: string }> {
    const planRef = doc(db, 'Plans', plan.id.toString()); // change for 'Plans' in production

    try {
      await setDoc(planRef, {
        id: plan.id,
        title: plan.title,
        fees: plan.fees,
      });

      return {
        success: true,
        plan: JSON.stringify(plan),
        message: 'Plan updated successfully',
      };
    } catch (error) {
      console.error('Erro ao editar plano:', error);
      return {
        success: false,
        message: 'Failed to update Plan',
      };
    }
  }

  private async fetchPlans(): Promise<Plan[]> {
    const plans: Plan[] = [];
    const q = query(collection(db, 'Plans')); // change for 'Plans' in production
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      plans.push(new Plan(data['id'], data['title'], data['fees']));
    });

    return plans.sort((a, b) => a.id - b.id);
  }
}
