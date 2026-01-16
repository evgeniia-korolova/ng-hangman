import { Component, input, output } from '@angular/core';
import { QuizzItem } from '../../../core/models/quizz-item.interface';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-game-over-screen',
  imports: [TranslocoPipe],
  templateUrl: './game-over-screen.html',
  styleUrl: './game-over-screen.scss',
})
export class GameOverScreen {
  readonly success = input.required<boolean>();
  readonly currentQuizz = input.required<QuizzItem | null>();
  startNewGame = output();

  restartGame():void {
    this.startNewGame.emit()
  }
}
