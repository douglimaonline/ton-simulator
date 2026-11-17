import { Injectable, signal } from '@angular/core';

/**
 * Shared "Ver todas as parcelas" (show all installments) state across the
 * desktop cards: expanding one card expands all of them.
 */
@Injectable({ providedIn: 'root' })
export class InstallmentsViewService {
  readonly showAll = signal(false);

  toggle(): void {
    this.showAll.update((value) => !value);
  }
}
