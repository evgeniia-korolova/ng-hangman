import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',    
    '(document:keydown.escape)': 'onDocumentKeyDown($event)',
  },
})
export class ClickOutsideDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  closeMenu = output<void>({ alias: 'appClickOutside' });

  onDocumentClick(event: Event) {
    const target = event.target as Node;

    if (!this.el.nativeElement.contains(target)) {
      this.closeMenu.emit();
    }
  }

  onDocumentKeyDown(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Escape') {
      this.closeMenu.emit();
      return;
    }

    const target = keyboardEvent.target as HTMLElement;
    if (
      this.el.nativeElement.contains(target) &&
      !target.classList.contains('trigger') &&
      (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ')
    ) {
      this.closeMenu.emit();
    }
  }
}
