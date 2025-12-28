import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
declare const bootstrap: any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements AfterViewInit {
  message?: string;
  success: boolean = false;

  @ViewChild('toast', { static: true })
  toastContainer!: ElementRef<HTMLDivElement>;

  private toast!: any;

  show(message: string, success: boolean = true): void {
    this.success = success;
    this.message = message;

    if (this.toast) {
      this.toast.show();
    }
  }

  ngAfterViewInit() {
    const toastEl = this.toastContainer.nativeElement;
    this.toast = new bootstrap.Toast(toastEl, {
      autohide: true,
      delay: 3000,
    });
  }
}
