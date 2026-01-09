import { inject, Injectable } from '@angular/core';
import { HangmanService,   } from './hangman-service';
import { QuizzItem } from '../models/quizz-item.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly hangmanService = inject(HangmanService);

  pickRandomQuizz(): QuizzItem | undefined {
    const items = this.hangmanService.currentQuizzItems();
    if (!items.length) return undefined;
    const i = Math.floor(Math.random() * items.length);
    return items[i];
  }


  // startNewGame(category?: string): QuizzItem | null {
  //   if (category) {
  //     this.hangmanService.setCategory(category);
  //   }

  //   const words = this.hangmanService.getWords();
  //   if (words.length === 0) return null;

  //   const randomIndex = Math.floor(Math.random() * words.length);
  //   return words[randomIndex];
  // }


}
