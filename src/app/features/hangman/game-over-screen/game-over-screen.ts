import { Component, inject, input, output, signal } from '@angular/core';
import { QuizzItem } from '../../../core/models/quizz-item.interface';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthActions } from "../../../shared/auth-actions/auth-actions";
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

  restartGame():void {
    this.startNewGame.emit()
  }
}
