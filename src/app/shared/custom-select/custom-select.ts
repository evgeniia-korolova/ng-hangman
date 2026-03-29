import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ClickOutsideDirective } from '../../core/directives/click-outside';

@Component({
  selector: 'app-custom-select',
  imports: [ClickOutsideDirective],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss',
})
export class CustomSelect {
  readonly label = input.required<string | undefined>();
  readonly options = input.required<{ key: string; title: string }[]>();
  readonly selected = input.required<string>();

  readonly selectOption = output<string>();

  protected isOpen = signal(false);

  private triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private optionsRef = viewChildren<ElementRef<HTMLLIElement>>('optionEl');

  toggle() {
    if (this.isOpen()) {
      this.closeMenu(true);
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isOpen.set(true);

    const index = this.getSelectedIndex();
    this.focusOption(Math.max(index, 0));
  }

  closeMenu(restoreFocus = false) {
    if (restoreFocus) {
      this.triggerRef()?.nativeElement.focus();
    }

    this.isOpen.set(false);
  }

  onTriggerKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this.openMenu();
        break;
      }
    }
  }

  onListKeyDown(event: KeyboardEvent) {
    const optionsList = this.options();
    const index = this.getFocusedIndex();

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        this.focusOption(Math.min(index + 1, optionsList.length - 1));
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        this.focusOption(Math.max(index - 1, 0));
        break;
      }

      case 'Enter':
      case ' ': {
        event.preventDefault();
        const key = optionsList[index]?.key;
        if (key) this.onSelect(key);
        break;
      }

      case 'Escape': {
        event.preventDefault();
        this.closeMenu(true);
        break;
      }
    }
  }

  onSelect(value: string) {
    this.selectOption.emit(value);
    this.closeMenu(true);
  }

  onKeyDown(event: KeyboardEvent, key: string) {
    const optionsList = this.options();
    const index = optionsList.findIndex((option) => option.key === key);

    switch (event.key) {
      case 'Enter':
      case ' ': {
        this.onSelect(key);
        event.preventDefault();
        break;
      }

      case 'ArrowDown': {
        if (index < optionsList.length - 1) {
          this.optionsRef()[index + 1]?.nativeElement.focus();
        }
        event.preventDefault();
        break;
      }

      case 'ArrowUp': {
        if (index > 0) {
          this.optionsRef()[index - 1]?.nativeElement.focus();
        }
        event.preventDefault();
        break;
      }

      case 'Escape': {
        this.closeMenu();
        break;
      }
    }
  }

  private getSelectedIndex(): number {
    return this.options().findIndex((o) => o.key === this.selected());
  }

  private getFocusedIndex(): number {
    const els = this.optionsRef();
    return els.findIndex((element) => element.nativeElement === document.activeElement);
  }

  private focusOption(index: number) {
    this.optionsRef()[index]?.nativeElement.focus();
  }
}
