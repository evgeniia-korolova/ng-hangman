import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { HangmanService } from './hangman-service';
import { QuizzItem } from '../models/quizz-item.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly hangmanService = inject(HangmanService);
  readonly gamesNumber = signal(0);

  private readonly quizzItems = this.hangmanService.currentQuizzItems;

  readonly randomQuizz = computed<QuizzItem | null>(() => {
    const items = this.quizzItems();
    const index = this.randomIndex();
    return index !== null && items.length > 0 ? (items[index] ?? null) : null;
  });

  startGame(): void {    
    this.gamesNumber.update((value) => value + 1);
  }

  readonly randomIndex = linkedSignal<number | null>(() => {
    const items = this.quizzItems();
    this.gamesNumber();
  
    if (items.length === 0) return null;
  
    return Math.floor(Math.random() * items.length);
  });  
}
