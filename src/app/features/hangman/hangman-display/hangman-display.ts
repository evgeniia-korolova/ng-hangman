import { Component, input, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MAX_MISTAKES } from '../constants/constants';
import { QuizzItem } from '../../../core/models/quizz-item.interface';

@Component({
  selector: 'app-hangman-display',
  imports: [TranslocoPipe],
  templateUrl: './hangman-display.html',
  styleUrl: './hangman-display.scss',
})
export class HangmanDisplay {

  readonly guesses = input.required<string[]>();
  readonly currentQuizz = input.required<QuizzItem | null>();
 


  readonly mistakesRemaining = input.required<number>();
  readonly success = input.required();
}
