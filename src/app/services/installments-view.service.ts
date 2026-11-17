import { Injectable, signal } from '@angular/core';

/**
 * Estado compartilhado de "Ver todas as parcelas" entre os cards do desktop:
 * expandir em um card expande todos.
 */
@Injectable({ providedIn: 'root' })
export class InstallmentsViewService {
  readonly showAll = signal(false);

  toggle(): void {
    this.showAll.update((value) => !value);
  }
}
