import { computed, inject, Injectable, signal } from '@angular/core';
import { HangmanService } from './hangman-service';
import { QuizzItem } from '../models/quizz-item.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly hangmanService = inject(HangmanService);
  readonly currentIndex = signal<number | null>(null);

  private readonly quizItems = this.hangmanService.currentQuizzItems;

  readonly randomIndex = computed(() => {
    const items = this.quizItems();
    const i = this.currentIndex();

    if (i === null && items.length) {
      return Math.floor(Math.random() * items.length);
    }
    return i;
  });

  readonly initQuizz = computed<QuizzItem | null>(() => {
    const items = this.hangmanService.currentQuizzItems();
    const i = this.randomIndex();
    return i !== null && items.length ? (items[i] ?? null) : null;
  });
}
