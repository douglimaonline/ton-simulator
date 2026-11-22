import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Plan } from '../../models/plan.model';
import { PlanCatalog } from '../../models/plan-catalog';
import { CommonModule } from '@angular/common';
import { PlanSelectorComponent } from '../plan-selector/plan-selector.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { Modal } from '../../models/Modal.model';
import { LoadingComponent } from '../loading/loading.component';
import { ToastComponent } from '../toast/toast.component';
import { PlanService, PlanWriteResult } from '../../services/plan.service';
import { AuthService, UnauthorizedAccountError } from '../../services/auth.service';

/** view: read only; edit: fees of the selected plan; create: new plan. */
type Mode = 'view' | 'edit' | 'create';

const SETTLEMENT_OPTIONS = ['Na hora', '1 dia útil'];

/** Write waiting for the confirmation modal. */
type PendingAction =
  | { type: 'edit'; plan: Plan }
  | { type: 'create'; plan: Plan }
  | { type: 'delete'; plan: Plan };

@Component({
  selector: 'app-fees-form',
  standalone: true,
  imports: [
    CommonModule,
    PlanSelectorComponent,
    NgxCurrencyDirective,
    FormsModule,
    ModalComponent,
    LoadingComponent,
    ToastComponent,
  ],
  templateUrl: './fees-form.component.html',
  styleUrl: './fees-form.component.css',
})
export class FeesFormComponent implements OnChanges {
  @Input() planOptions: Plan[] | null = [];
  @ViewChild('modalRef') modal!: ModalComponent;
  @ViewChild('loadingRef') loading!: LoadingComponent;
  @ViewChild('toastRef') toast!: ToastComponent;
  selectedPlan?: Plan;
  modelFees: number[] = [];
  mode: Mode = 'view';

  /** Facets typed for the new plan (create mode). */
  draft = { family: '', range: '', settlement: '' };

  /** Existing values suggested while typing the new plan's facets. */
  familySuggestions: string[] = [];
  readonly settlementOptions = SETTLEMENT_OPTIONS;

  signingIn = false;

  private catalog = new PlanCatalog([]);
  private pending?: PendingAction;
  private formVersion = 0;

  constructor(
    private planService: PlanService,
    public authService: AuthService,
  ) {}

  ngOnChanges(): void {
    this.catalog = new PlanCatalog(this.planOptions ?? []);
    this.familySuggestions = this.catalog.families();
  }

  get rangeSuggestions(): string[] {
    const family = this.canonical(this.draft.family.trim(), this.familySuggestions);
    return this.catalog.ranges(family);
  }

  get editing(): boolean {
    return this.mode !== 'view';
  }

  async signIn(): Promise<void> {
    this.signingIn = true;
    try {
      await this.authService.signIn();
    } catch (error) {
      if (error instanceof UnauthorizedAccountError) {
        this.toast.show(`A conta ${error.email ?? ''} não tem acesso.`, false);
        return;
      }
      // Closing the popup is not an error worth showing
      const code = (error as { code?: string })?.code;
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        console.error(error);
        this.toast.show('Não foi possível entrar com o Google.', false);
      }
    } finally {
      this.signingIn = false;
    }
  }

  async signOut(): Promise<void> {
    this.resetForm();
    await this.authService.signOut();
  }

  planChanged(plan: Plan): void {
    this.selectedPlan = plan;
    this.resetForm();
  }

  selectAll(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  onInputChange(input: number, index: number): void {
    this.modelFees[index] = input / 100;
  }

  /** "Editar" enters edit mode; "Salvar" asks to confirm the new fees. */
  onEditClick(): void {
    if (this.mode !== 'edit') {
      this.mode = 'edit';
      return;
    }

    const plan = this.selectedPlan!;
    const edited = new Plan(plan.id, this.editedFees(), plan);
    const changed = JSON.stringify(plan) !== JSON.stringify(edited);
    if (changed) this.pending = { type: 'edit', plan: edited };
    this.modal.show(Modal.data(changed));
  }

  /** Starts a new plan with the selected plan's fees as a starting point. */
  startCreate(): void {
    this.resetForm();
    this.mode = 'create';
    const settlement = this.selectedPlan?.settlement;
    this.draft = {
      family: this.selectedPlan?.family ?? '',
      range: '',
      settlement:
        settlement && SETTLEMENT_OPTIONS.includes(settlement) ? settlement : SETTLEMENT_OPTIONS[0],
    };
  }

  onCreateClick(): void {
    const plans = this.planOptions ?? [];
    const family = this.canonical(this.draft.family.trim(), this.familySuggestions);
    const range = this.canonical(this.draft.range.trim(), this.catalog.ranges(family));
    const settlement = this.draft.settlement;

    const id = Math.max(0, ...plans.map((p) => p.id)) + 1;
    const plan = new Plan(id, this.editedFees(), { family, range, settlement });

    const problem = this.validateNewPlan(plan);
    if (problem) {
      this.modal.show(Modal.invalidPlan(problem));
      return;
    }
    this.pending = { type: 'create', plan };
    this.modal.show(Modal.confirmCreate(plan.label));
  }

  onDeleteClick(): void {
    const plan = this.selectedPlan!;
    this.pending = { type: 'delete', plan };
    this.modal.show(Modal.confirmDelete(plan.label));
  }

  cancel(): void {
    this.resetForm();
  }

  async handleConfirm(): Promise<void> {
    const action = this.pending;
    if (!action) return;
    this.pending = undefined;
    this.loading.show();

    try {
      switch (action.type) {
        case 'edit':
          return this.handleResult(await this.planService.editPlan(action.plan), {
            done: 'Taxas atualizadas.',
            denied: 'Esta conta não tem permissão para editar as taxas.',
            failed: 'Erro ao atualizar taxas.',
          });
        case 'create':
          return this.handleResult(await this.planService.createPlan(action.plan), {
            done: 'Plano criado.',
            denied: 'Esta conta não tem permissão para criar planos.',
            failed: 'Erro ao criar o plano. Recarregue a página e tente novamente.',
          });
        case 'delete':
          return this.handleResult(await this.planService.deletePlan(action.plan), {
            done: 'Plano excluído.',
            denied: 'Esta conta não tem permissão para excluir planos.',
            failed: 'Erro ao excluir o plano.',
          });
      }
    } catch (error) {
      console.error(error);
      this.loading.hide();
    }
  }

  resetForm(): void {
    this.mode = 'view';
    this.modelFees = [];
    // Recreates the fee inputs so values typed before cancelling disappear
    this.formVersion++;
  }

  trackFee = (index: number): string => `${this.formVersion}-${index}`;

  /** Fees of the selected plan with the values typed in the form. */
  private editedFees(): number[] {
    return this.selectedPlan!.fees.map((fee, i) => this.modelFees[i] ?? fee);
  }

  /** Message explaining why the new plan cannot be saved, or null if it can. */
  private validateNewPlan(plan: Plan): string | null {
    if (!plan.family || !plan.range) {
      return 'Informe o plano e a faixa de faturamento.';
    }
    if (!plan.settlement || !SETTLEMENT_OPTIONS.includes(plan.settlement)) {
      return `Escolha o recebimento: ${SETTLEMENT_OPTIONS.join(' ou ')}.`;
    }

    const existing = this.catalog.find(plan.family, plan.range, plan.settlement);
    if (existing && existing.settlement === plan.settlement && existing.range === plan.range) {
      return `Já existe o plano "${existing.label}".`;
    }

    // Promotional ranges have no settlement, so a plan with one would not
    // show up in the settlement dropdown.
    if (this.catalog.settlements(plan.family, plan.range).includes(null)) {
      return `A faixa "${plan.range}" deste plano é promocional (sem recebimento). Escolha outra faixa.`;
    }
    return null;
  }

  /**
   * Existing value that matches `value` ignoring case, so "ton top" reuses
   * "Ton Top" instead of creating a second option in the dropdown.
   */
  private canonical(value: string, existing: string[]): string {
    const lower = value.toLocaleLowerCase('pt-BR');
    return existing.find((e) => e.toLocaleLowerCase('pt-BR') === lower) ?? value;
  }

  private handleResult(
    result: PlanWriteResult,
    messages: { done: string; denied: string; failed: string },
  ): void {
    if (result.success) {
      this.resetForm();
      this.toast.show(messages.done, true);
      this.reloadPlans();
    } else {
      this.toast.show(result.permissionDenied ? messages.denied : messages.failed, false);
      this.loading.hide();
    }
  }

  /** The plans are read once on load, so reload to show the change. */
  private reloadPlans(): void {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}
