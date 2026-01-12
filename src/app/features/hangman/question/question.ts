import { Component, input } from '@angular/core';
import { QuizzItem } from '../../../core/models/quizz-item.interface';

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
