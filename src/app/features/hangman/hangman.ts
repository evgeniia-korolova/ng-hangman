import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { HangmanDisplay } from './hangman-display/hangman-display';
import { Question } from './question/question';
import { Keyboard } from './keyboard/keyboard';
import { GameService } from '../../core/services/game-service';
import { Actions } from './actions/actions';
import { KEY_CHAR_EN, KEYBOARD_LAYOUTS, MAX_MISTAKES } from './constants/constants';
import { LanguageService } from '../../core/services/language-service';
import { GameOverScreen } from './game-over-screen/game-over-screen';
import { AuthService } from '../../core/services/auth-service';
import { updateUser } from '../../core/services/storage.helper';

@Component({
  selector: 'app-hangman',
  imports: [HangmanDisplay, Question, Keyboard, Actions, GameOverScreen],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export default class Hangman {
  private readonly gameService = inject(GameService);
  private languageService = inject(LanguageService);
  readonly authService = inject(AuthService);
  readonly currentQuizz = this.gameService.randomQuizz;

  readonly guesses = signal<string[]>([]);
  readonly wrongGuesses = signal<string[]>([]);
  readonly attempts = signal(0);

  readonly maxMistakes = MAX_MISTAKES;

  readonly success = signal(false);
  readonly isGameOver = signal(false);
  readonly mistakesRemaining = computed(() => this.maxMistakes - this.wrongGuesses().length);

  readonly characters = linkedSignal(() => {
    const word = this.currentQuizz()?.word ?? '';
    return [...word].map((char) => ({
      value: char,
      guessed: false,
    }));
  });

  readonly currentLanguage = this.languageService.currentLanguage;

  readonly keyboardCharacters = linkedSignal(() => {
    const lang = this.currentLanguage();
    const keyboardChar = KEYBOARD_LAYOUTS[lang] ?? KEY_CHAR_EN;
    return [...keyboardChar].map((char) => ({
      value: char,
      disabled: false,
    }));
  });

  readonly rows = computed(() => {
    const chars = this.keyboardCharacters();

    if (this.currentLanguage() === 'en') {
      return [chars.slice(0, 10), chars.slice(10, 19), chars.slice(19)];
    }

    return [chars.slice(0, 12), chars.slice(12, 23), chars.slice(23)];
  });

  guessLetter(letter: string) {
    const normalizedLetter = letter.toLowerCase();
    const word = this.currentQuizz()?.word.toLowerCase() ?? '';
    const newGuesses = [...this.guesses()];

    if (!normalizedLetter || newGuesses.includes(normalizedLetter)) return;

    if (word.includes(normalizedLetter)) {
      newGuesses.push(normalizedLetter);
      this.guesses.set(newGuesses);

      this.characters.update((chars) =>
        chars.map((char) =>
          char.value.toLowerCase() === normalizedLetter ? { ...char, guessed: true } : char,
        ),
      );
    } else {
      this.wrongGuesses.update((char) => [...char, normalizedLetter]);
    }
  }

  onKeyPressed(letter: string) {
    this.keyboardCharacters.update((chars) =>
      chars.map((char) => (char.value === letter ? { ...char, disabled: true } : char)),
    );
    this.guessLetter(letter);
    this.attempts.update((n) => n + 1);
    this.checkWin();
  }

  private syncStatsToUser(): void {
    const updatedUser = updateUser({
      stats: {
        games: this.gameService.gamesNumber(),
        wins: this.gameService.wins(),
        losses: this.gameService.losses(),
      },
    });
    if (updatedUser) this.authService.currentUser.set(updatedUser);
  }

  checkWin() {
    const word = this.currentQuizz()?.word ?? '';
    const uniqueLetters = new Set(word);
    const guessedLetters = new Set(this.guesses());

    const isWin = guessedLetters.size === uniqueLetters.size;
    if (isWin) {
      this.success.set(true);
      this.gameService.wins.update((v) => v + 1);
      this.gameService.gamesNumber.update((v) => v + 1);
      this.isGameOver.set(true);
      this.syncStatsToUser();
    }

    if (this.mistakesRemaining() === 0) {
      this.gameService.losses.update((v) => v + 1);
      this.gameService.gamesNumber.update((v) => v + 1);
      this.isGameOver.set(true);
      this.syncStatsToUser();
    }
  }

  restartGame(): void {
    this.guesses.set([]);
    this.wrongGuesses.set([]);
    this.attempts.set(0);
    this.success.set(false);
    this.isGameOver.set(false);
    this.keyboardCharacters.update((chars) => chars.map((char) => ({ ...char, disabled: false })));
  }
}
