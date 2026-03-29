import { Component, ElementRef, input, output, signal, viewChild, viewChildren } from '@angular/core';
import { ClickOutsideDirective } from '../../core/directives/click-outside';

@Component({
  selector: 'app-custom-select',
  imports: [ClickOutsideDirective],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss',
})
export class CustomSelect {
  label = input.required<string | undefined>();

  options = input.required<{ key: string; title: string }[]>();
  selected = input.required<string>();
  readonly selectOption = output<string>();
  protected isOpen = signal(false);
  private triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private optionsRef = viewChildren<ElementRef<HTMLLIElement>>('optionEl');

  toggle() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      queueMicrotask(() => {
        const idx = this.options().findIndex(o => o.key === this.selected());
        const targetIndex = idx >= 0 ? idx : 0;
        this.optionsRef()[targetIndex]?.nativeElement.focus();
      });
    }
  }

  close() {
    this.isOpen.set(false);
    this.triggerRef()?.nativeElement.focus();
  }

  onSelect(value: string) {
    this.selectOption.emit(value);
    this.close();
  }

  onKeyDown(event: KeyboardEvent, key: string) {
    const opts = this.options();
    const idx = opts.findIndex(o => o.key === key);

    switch (event.key) {
      case 'Enter':
      case ' ':
        this.onSelect(key);
        event.preventDefault();
        break;

      case 'ArrowDown':
        if (idx < opts.length - 1) {          
          this.optionsRef()[idx + 1]?.nativeElement.focus();
        }
        event.preventDefault();
        break;

      case 'ArrowUp':
        if (idx > 0) {          
          this.optionsRef()[idx - 1]?.nativeElement.focus();
        }
        event.preventDefault();
        break;

      case 'Escape':
        this.close();
        break;
    }
  }
}

