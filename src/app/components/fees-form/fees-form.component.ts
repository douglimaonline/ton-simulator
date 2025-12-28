import { Component, Input, ViewChild } from '@angular/core';
import { Plan } from '../../models/plan.model';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { Modal } from '../../models/Modal.model';
import { LoadingComponent } from '../loading/loading.component';
import { ToastComponent } from '../toast/toast.component';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-fees-form',
  standalone: true,
  imports: [
    CommonModule,
    DropdownComponent,
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
  modelFees: number[] = Array(13);
  editMode: boolean = false;

  constructor(private planService: PlanService) {}

  async handleConfirm(): Promise<void> {
    await this.showLoading();

    try {
      const result = await this.planService.editPlan(this.editedPlan!);
      this.handleEditPlan(result);
    } catch (error) {
      console.error(error);
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
      this.selectedPlan!.fees.map((fee, i) => this.modelFees[i] ?? fee)
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
  }): void {
    if (result.success) {
      this.resetForm();
      this.toast.show('Taxas atualizadas.', result.success);
      this.navigateToCalculator();
    } else {
      this.toast.show('Erro ao atualizar taxas.', result.success);
      this.hideLoading();
    }
  }

  private navigateToCalculator(): void {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}
