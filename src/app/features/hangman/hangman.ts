import { Component, computed, inject, signal } from '@angular/core';
import { HangmanDisplay } from './hangman-display/hangman-display';
import { Question } from './question/question';
import { Keyboard } from './keyboard/keyboard';
import { HangmanService } from '../../core/services/hangman-service';
import { GameService } from '../../core/services/game-service';
import { Actions } from './actions/actions';
import { MAX_MISTAKES } from './constants/constants';

@Component({
  selector: 'app-hangman',
  imports: [HangmanDisplay, Question, Keyboard, Actions],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export default class Hangman {
  private readonly hangmanService = inject(HangmanService);
  private readonly gameService = inject(GameService);

  readonly currentQuizz = this.gameService.initQuizz;

  readonly guesses = signal<string[]>([]);
  readonly wrongGuesses = signal<string[]>([]);
  readonly attempts = signal(0);

  readonly maxMistakes = MAX_MISTAKES;

  readonly mistakesRemaining = computed(() => this.maxMistakes - this.wrongGuesses().length);
  readonly success = signal(false);

  guessLetter(letter: string) {
    const newGuesses = [...this.guesses()];
    if (!letter || newGuesses.includes(letter)) return;

    if (this.currentQuizz()?.word.includes(letter)) {
      newGuesses.push(letter);
      this.guesses.set(newGuesses);
    }

    if (!this.currentQuizz()?.word.includes(letter)) {
      this.wrongGuesses.update((g) => [...g, letter]);
    }
  }

  dummyClick() {
    const key: string = prompt('Enter a key') || '';
    this.guessLetter(key);
    this.attempts.update((n) => n + 1);
    this.checkWin();
  }

  checkWin() {
    const word = this.currentQuizz()?.word ?? '';
    const uniqueLetters = new Set(word);
    const guessedLetters = new Set(this.guesses());

    const isWin = guessedLetters.size === uniqueLetters.size;
    if (isWin) {
      this.success.set(true);
    }
    console.log('win', uniqueLetters.size, guessedLetters.size);
  }
}
