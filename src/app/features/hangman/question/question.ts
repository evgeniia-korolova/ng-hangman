import { Component, computed, inject, input, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GameService } from '../../../core/services/game-service';
import { QuizzItem } from '../../../core/models/quizz-item.interface';
import { HangmanService } from '../../../core/services/hangman-service';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question {
  // private readonly gameService = inject(GameService);
  // protected readonly currentQuizz = this.gameService.initQuizz;
  readonly currentQuizz = input.required<QuizzItem | null>();
}
