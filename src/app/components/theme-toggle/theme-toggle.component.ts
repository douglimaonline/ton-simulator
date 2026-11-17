import { Component, Input, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  /** Floating button in the bottom-right corner (used on mobile). */
  @Input() floating = false;

  readonly themeService = inject(ThemeService);
}
