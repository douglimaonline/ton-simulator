import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Modal } from '../../models/Modal.model';

declare const bootstrap: any;

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit {
  title?: string;
  message?: string;
  showConfirmButton: boolean = true;
  @Output() onConfirm = new EventEmitter<void>();

  @ViewChild('modalContainer', { static: true })
  modalContainer!: ElementRef<HTMLDivElement>;

  private modal: any;

  show(modal: Modal) {
    this.title = modal.title;
    this.message = modal.message;
    this.showConfirmButton = modal.showConfirmButton;
    if (this.modal) {
      this.modal.show();
    }
  }

  ngAfterViewInit() {
    const modalEl = this.modalContainer.nativeElement;
    this.modal = new bootstrap.Modal(modalEl, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  confirm() {
    this.onConfirm.emit();
    this.modal.hide();
  }
}
