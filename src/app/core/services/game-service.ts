import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { HangmanService } from './hangman-service';
import { QuizzItem } from '../models/quizz-item.interface';
import { loadStats } from './storage.helper';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly hangmanService = inject(HangmanService);

  readonly gamesNumber = signal(loadStats().games);
  readonly wins = signal(loadStats().wins);
  readonly losses = signal(loadStats().losses);

  private readonly quizzItems = this.hangmanService.currentQuizzItems;

  readonly randomQuizz = computed<QuizzItem | null>(() => {
    const items = this.quizzItems();
    const index = this.randomIndex();
    return index !== null && items.length > 0 ? (items[index] ?? null) : null;
  });

  readonly randomIndex = linkedSignal<number | null>(() => {
    const items = this.quizzItems();
    this.gamesNumber();

    if (items.length === 0) return null;

    return Math.floor(Math.random() * items.length);
  });
}
