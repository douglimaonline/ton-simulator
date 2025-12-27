import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent implements AfterViewInit {
  @ViewChild('loading', { static: true })
  modalContainer!: ElementRef<HTMLDivElement>;

  private modal: any;

  show() {
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
}
