import { Component, Input, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  /** Botão flutuante no canto inferior direito (uso no celular). */
  @Input() floating = false;

  readonly themeService = inject(ThemeService);
}
