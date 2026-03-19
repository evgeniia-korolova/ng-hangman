import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  clickOutside = output<void>({ alias: 'appClickOutside' });

  onDocumentClick(event: Event) {
    const target = event.target as Node; 

    if (!this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
