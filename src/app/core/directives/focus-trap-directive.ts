import { Directive, inject, ElementRef, DestroyRef, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[appFocusTrapDirective]',
})
export class FocusTrapDirective implements AfterViewInit {
  private el = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  ngAfterViewInit() {
    this.focusFirst();

    fromEvent<KeyboardEvent>(this.el.nativeElement, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.handleKeydown(event));
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const focusables = this.getFocusableElements();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables.at(-1);

    const active = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      if (active === first) {
        event.preventDefault();
        last?.focus();
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusFirst() {
    this.getFocusableElements()[0]?.focus();
  }

  private getFocusableElements(): HTMLElement[] {
    const nodes = this.el.nativeElement.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );

    return [...nodes] as HTMLElement[];
  }
}
