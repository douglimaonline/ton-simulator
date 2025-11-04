import { Component, Output } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { TableComponent } from '../table/table.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    DropdownComponent,
    TableComponent,
    NgxCurrencyDirective,
    FormsModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  baseValue: number = 3000;

  onInputChange(input: Event): void {
    const inputElement = input.target as HTMLInputElement;
    this.baseValue = Number(inputElement.value);
  }
}
