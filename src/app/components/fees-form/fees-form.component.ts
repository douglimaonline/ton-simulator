import { Component, Input, ViewChild } from '@angular/core';
import { Plan } from '../../models/plan.model';
import { CommonModule } from '@angular/common';
import { PlanSelectorComponent } from '../plan-selector/plan-selector.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { Modal } from '../../models/Modal.model';
import { LoadingComponent } from '../loading/loading.component';
import { ToastComponent } from '../toast/toast.component';
import { PlanService } from '../../services/plan.service';
import { AuthService, UnauthorizedAccountError } from '../../services/auth.service';

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
export class FeesFormComponent {
  @Input() planOptions: Plan[] | null = [];
  @ViewChild('modalRef') modal!: ModalComponent;
  @ViewChild('loadingRef') loading!: LoadingComponent;
  @ViewChild('toastRef') toast!: ToastComponent;
  selectedPlan?: Plan;
  editedPlan?: Plan;
  modelFees: number[] = Array(18);
  editMode: boolean = false;

  signingIn = false;

  constructor(
    private planService: PlanService,
    public authService: AuthService,
  ) {}

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

  async handleConfirm(): Promise<void> {
    await this.showLoading();

    try {
      const result = await this.planService.editPlan(this.editedPlan!);
      this.handleEditPlan(result);
    } catch (error) {
      console.error(error);
      this.hideLoading();
    }
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

  onClick(): void {
    if (!this.editMode) {
      this.editMode = !this.editMode;
      return;
    }

    this.editedPlan = new Plan(
      this.selectedPlan!.id,
      this.selectedPlan!.title,
      this.selectedPlan!.fees.map((fee, i) => this.modelFees[i] ?? fee),
      this.selectedPlan!,
    );
    this.showModal(this.validateChanges(this.editedPlan));
  }

  resetForm(): void {
    this.editMode = false;
    this.modelFees = Array(13);
  }

  validateChanges(editedPlan: Plan): boolean {
    return !(JSON.stringify(this.selectedPlan) === JSON.stringify(editedPlan));
  }

  showModal(validChanges: boolean): void {
    this.modal.show(Modal.data(validChanges));
  }

  showLoading(): void {
    this.loading.show();
  }

  private hideLoading(): void {
    this.loading.hide();
  }

  private handleEditPlan(result: {
    success: boolean;
    plan?: string | undefined;
    message: string;
    permissionDenied?: boolean;
  }): void {
    if (result.success) {
      this.resetForm();
      this.toast.show('Taxas atualizadas.', result.success);
      this.navigateToCalculator();
    } else {
      this.toast.show(
        result.permissionDenied
          ? 'Esta conta não tem permissão para editar as taxas.'
          : 'Erro ao atualizar taxas.',
        result.success,
      );
      this.hideLoading();
    }
  }

  private navigateToCalculator(): void {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}
