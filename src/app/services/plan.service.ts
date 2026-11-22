import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Plan } from '../models/plan.model';
import { from, Observable } from 'rxjs';

/** 'Plans' for production, 'Plans test' for testing. */
const PLANS_COLLECTION = 'Plans';

export interface PlanWriteResult {
  success: boolean;
  message: string;
  /** Firestore rules reject writes from accounts that are not editors. */
  permissionDenied?: boolean;
}

/** Thrown inside the create transaction when the id is already taken. */
class PlanIdTakenError extends Error {}

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor() {}

  getPlans(): Observable<Plan[]> {
    return from(this.fetchPlans());
  }

  async editPlan(plan: Plan): Promise<PlanWriteResult> {
    const planRef = doc(db, PLANS_COLLECTION, plan.id.toString());

    try {
      // merge: keeps fields that are not edited here (family, range, settlement).
      await setDoc(planRef, { id: plan.id, fees: plan.fees }, { merge: true });
      return { success: true, message: 'Plan updated successfully' };
    } catch (error) {
      console.error('Erro ao editar plano:', error);
      return failure('Failed to update Plan', error);
    }
  }

  async createPlan(plan: Plan): Promise<PlanWriteResult> {
    const planRef = doc(db, PLANS_COLLECTION, plan.id.toString());

    try {
      await runTransaction(db, async (transaction) => {
        if ((await transaction.get(planRef)).exists()) throw new PlanIdTakenError();
        transaction.set(planRef, {
          id: plan.id,
          family: plan.family,
          range: plan.range,
          settlement: plan.settlement,
          fees: plan.fees,
        });
      });
      return { success: true, message: 'Plan created successfully' };
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      return failure(
        error instanceof PlanIdTakenError
          ? 'Plan id already exists'
          : 'Failed to create Plan',
        error
      );
    }
  }

  async deletePlan(plan: Plan): Promise<PlanWriteResult> {
    try {
      await deleteDoc(doc(db, PLANS_COLLECTION, plan.id.toString()));
      return { success: true, message: 'Plan deleted successfully' };
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      return failure('Failed to delete Plan', error);
    }
  }

  private async fetchPlans(): Promise<Plan[]> {
    const plans: Plan[] = [];
    const q = query(collection(db, PLANS_COLLECTION));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      plans.push(
        new Plan(data['id'], data['fees'], {
          family: data['family'],
          range: data['range'],
          settlement: data['settlement'] ?? null,
        })
      );
    });

    return plans.sort((a, b) => a.id - b.id);
  }
}

function failure(message: string, error: unknown): PlanWriteResult {
  return {
    success: false,
    message,
    permissionDenied: (error as { code?: string })?.code === 'permission-denied',
  };
}
