import { Component, ElementRef, inject, input, viewChildren, } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-auth-actions',
  imports: [TranslocoPipe],
  templateUrl: './auth-actions.html',
  styleUrl: './auth-actions.scss',
})
export class AuthActions {
  public buttons = viewChildren<ElementRef<HTMLButtonElement>>('authBtn');
  protected readonly authService = inject(AuthService);

  readonly buttonsStyle = input.required<string>();

  focusFirst(): void {
    queueMicrotask(() => {
      this.buttons()?.[0]?.nativeElement?.focus();
    });
  }
}
