import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InterestCalculator } from './models/InterestCalculator.model';

@Injectable({
  providedIn: 'root',
})
export class InterestCalculatorService {
  public readonly interestCalculatorSubject =
    new BehaviorSubject<InterestCalculator>(new InterestCalculator());

  interestCalculator$: Observable<InterestCalculator> =
    this.interestCalculatorSubject.asObservable();

  setInterestCalculator(interestCalculator: InterestCalculator): void {
    this.interestCalculatorSubject.next(interestCalculator);
  }
}
