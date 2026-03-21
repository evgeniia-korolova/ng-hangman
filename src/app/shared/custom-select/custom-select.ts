import { Component, input, output, signal } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';
import { ClickOutsideDirective } from '../../core/directives/click-outside';

@Component({
  selector: 'app-custom-select',
  imports: [TranslocoPipe, ClickOutsideDirective],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss',
})
export class CustomSelect {
  label = input.required<string | undefined>();

  options = input.required<{ key: string; title: string }[]>();
  selected = input.required<string>();
  readonly selectOption = output<string>();
  protected isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
    console.log('toggle w');
  }

  onSelect(value: string) {
    this.selectOption.emit(value);
    this.isOpen.set(false);
  }
}
