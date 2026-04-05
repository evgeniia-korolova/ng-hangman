import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
  viewChildren,
} from '@angular/core';
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
  protected readonly signUpBtn = viewChild<ElementRef<HTMLButtonElement>>('signUpBtn');
  protected readonly signInBtn = viewChild<ElementRef<HTMLButtonElement>>('signInBtn');
  protected readonly avatarBtn = viewChild<ElementRef<HTMLDivElement>>('avatarBtn');

  readonly buttonsStyle = input.required<string>();

  constructor() {
    afterNextRender(() => {
      this.setInitialFocus();
    });

    effect(() => {
      const isOpen = this.authService.isOverlayOpen();

      if (!isOpen) {
        this.restoreFocus();
      }
    });
  }

  private setInitialFocus() {
    if (!this.authService.isRegistered()) {
      this.signUpBtn()?.nativeElement.focus();
      return;
    }

    if (this.authService.isRegistered() && !this.authService.isAuthenticated()) {
      this.signInBtn()?.nativeElement.focus();
      return;
    }

    if (this.authService.isAuthenticated()) {
      this.avatarBtn()?.nativeElement.focus();
    }
  }

  private restoreFocus() {
    const origin = this.authService.focusOrigin();

    if (origin === 'auth-signup') {
      const button = this.signUpBtn();
      if (button) {
        button.nativeElement.focus();
        return;
      }
    }

    if (origin === 'auth-signin') {
      const button = this.signInBtn();
      if (button) {
        button.nativeElement.focus();
        return;
      }
    }

    if (origin === 'avatar') {
      const avatar = this.avatarBtn();
      if (avatar) {
        avatar.nativeElement.focus();
        return;
      }
    }

    // 🔥 fallback — по текущему состоянию
    this.setInitialFocus();
  }
}
