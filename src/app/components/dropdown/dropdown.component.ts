import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DropdownOption<T = unknown> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent<T = unknown> {
  @Input() options: DropdownOption<T>[] = [];
  @Input() selected?: T;
  @Input() disabled = false;
  @Input() ariaLabel?: string;
  @Output() selectedChange = new EventEmitter<T>();

  get selectedLabel(): string {
    return this.options.find((o) => o.value === this.selected)?.label ?? '—';
  }

  onSelect(option: DropdownOption<T>): void {
    this.selected = option.value;
    this.selectedChange.emit(option.value);
  }
}
