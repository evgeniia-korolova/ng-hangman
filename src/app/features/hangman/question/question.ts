import { Component, input } from '@angular/core';
import { QuizzItem } from '../../../core/models/quizz-item.interface';
import { Character } from '../../../core/models/character.interface';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question {
  readonly currentQuizz = input.required<QuizzItem | null>();
  readonly characters = input.required<Character[]>();
}
