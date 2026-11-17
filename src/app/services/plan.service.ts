import { Injectable } from '@angular/core';
import { collection, getDocs, query, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Plan } from '../models/plan.model';
import { from, Observable } from 'rxjs';

/** 'Plans' for production, 'Plans test' for testing. */
const PLANS_COLLECTION = 'Plans';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor() {}

  getPlans(): Observable<Plan[]> {
    return from(this.fetchPlans());
  }

  async editPlan(
    plan: Plan,
  ): Promise<{ success: boolean; plan?: string; message: string }> {
    const planRef = doc(db, PLANS_COLLECTION, plan.id.toString());

    try {
      // merge: keeps fields that are not edited here (family, range, settlement).
      await setDoc(
        planRef,
        { id: plan.id, title: plan.title, fees: plan.fees },
        { merge: true }
      );

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
    const q = query(collection(db, PLANS_COLLECTION));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      plans.push(
        new Plan(data['id'], data['title'], data['fees'], {
          family: data['family'],
          range: data['range'],
          settlement: data['settlement'] ?? null,
        })
      );
    });

    return plans.sort((a, b) => a.id - b.id);
  }
}
