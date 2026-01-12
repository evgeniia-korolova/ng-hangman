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
    const index = this.currentIndex();

    if (index === null && items.length > 0) {
      return Math.floor(Math.random() * items.length);
    }
    return index;
  });

  readonly initQuizz = computed<QuizzItem | null>(() => {
    const items = this.hangmanService.currentQuizzItems();
    const index = this.randomIndex();
    return index !== null && items.length > 0 ? (items[index] ?? null) : null;
  });
}
