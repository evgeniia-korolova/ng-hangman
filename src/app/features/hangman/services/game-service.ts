import { inject, Injectable } from '@angular/core';
import { HangmanService, WordItem } from './hangman-service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly hangmanService = inject(HangmanService);


  startNewGame(category?: string): WordItem | null {
    if (category) {
      this.hangmanService.setCategory(category);
    }

    const words = this.hangmanService.getWords();
    if (words.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }


}
