import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { QuizzItem } from '../../../core/models/quizz-item.interface';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthActions } from '../../../shared/auth-actions/auth-actions';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-game-over-screen',
  imports: [TranslocoPipe, AuthActions],
  templateUrl: './game-over-screen.html',
  styleUrl: './game-over-screen.scss',
})
export class GameOverScreen {
  protected readonly authService = inject(AuthService);

  readonly success = input.required<boolean>();
  readonly correctWord = input.required<string>();
  readonly currentQuizz = input.required<QuizzItem | null>();
  startNewGame = output();
  readonly buttonStyle = signal<string>('button-accent');
  private restartBtn = viewChild<ElementRef<HTMLButtonElement>>('restartBtn');
  private authComponent = viewChild(AuthActions);

  constructor() {
    effect(() => {
      queueMicrotask(() => {
        this.restartBtn()?.nativeElement.focus();
      });
    });
  }

  private getFocusableElements(): HTMLElement[] {
    const elements: HTMLElement[] = [];
  
    const restart = this.restartBtn()?.nativeElement;
    if (restart) elements.push(restart);
  
    const authButtons = this.authComponent()?.buttons?.() ?? [];
    authButtons.forEach(btn => elements.push(btn.nativeElement));
  
    return elements;
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
  
    const focusableEls = this.getFocusableElements();
  
    if (!focusableEls.length) return;
  
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];
  
    const active = document.activeElement as HTMLElement;
  
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
  
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return;
    }
  }

  restartGame(): void {
    this.startNewGame.emit();
  }
}
