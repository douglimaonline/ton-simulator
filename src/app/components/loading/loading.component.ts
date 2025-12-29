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
  loadingContainer!: ElementRef<HTMLDivElement>;

  private loading: any;

  show() {
    if (this.loading) {
      this.loading.show();
    }
  }

  hide() {
    this.loading.hide();
  }

  ngAfterViewInit() {
    const loadingEl = this.loadingContainer.nativeElement;
    this.loading = new bootstrap.Modal(loadingEl, {
      backdrop: 'static',
      keyboard: false,
    });
  }
}
