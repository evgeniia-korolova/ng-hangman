import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { HangmanDisplay } from './hangman-display/hangman-display';
import { Question } from './question/question';
import { Keyboard } from './keyboard/keyboard';
import { GameService } from '../../core/services/game-service';
import { Actions } from './actions/actions';
import { KEY_CHAR_EN, KEYBOARD_LAYOUTS } from './constants/constants';
import { LanguageService } from '../../core/services/language-service';
import { GameOverScreen } from './game-over-screen/game-over-screen';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-hangman',
  imports: [HangmanDisplay, Question, Keyboard, Actions, GameOverScreen],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Hangman {
  protected readonly gameService = inject(GameService);
  private languageService = inject(LanguageService);

  readonly authService = inject(AuthService);

  readonly currentQuizz = this.gameService.randomQuizz;

  readonly keyboardCharacters = linkedSignal(() => {
    this.gameService.currentCategory();
    this.gameService.gamesNumber();
    const lang = this.languageService.currentLanguage();
    const keyboardChar = KEYBOARD_LAYOUTS[lang] ?? KEY_CHAR_EN;
    return [...keyboardChar].map((char) => ({
      value: char,
      disabled: false,
    }));
  });

  readonly rows = computed(() => {
    const chars = this.keyboardCharacters();

    if (this.languageService.currentLanguage() === 'en') {
      return [chars.slice(0, 10), chars.slice(10, 19), chars.slice(19)];
    }

    return [chars.slice(0, 12), chars.slice(12, 23), chars.slice(23)];
  });

  readonly wordCharacters = linkedSignal(() => {
    this.gameService.gamesNumber();
    this.gameService.currentCategory();
    this.languageService.currentLanguage();
    const word = this.currentQuizz()?.word ?? '';
    return [...word].map((char) => ({
      value: char,
      guessed: false,
    }));
  });

  guessLetter(letter: string) {
    const normalizedLetter = letter.toLowerCase();
    const word = this.currentQuizz()?.word.toLowerCase() ?? '';
    const newGuesses = [...this.gameService.guesses()];

    if (!normalizedLetter || newGuesses.includes(normalizedLetter)) return;

    if (word.includes(normalizedLetter)) {
      newGuesses.push(normalizedLetter);
      this.gameService.guesses.set(newGuesses);

      this.wordCharacters.update((chars) =>
        chars.map((char) =>
          char.value.toLowerCase() === normalizedLetter ? { ...char, guessed: true } : char,
        ),
      );
    } else {
      this.gameService.wrongGuesses.update((char) => [...char, normalizedLetter]);
    }
  }

  onKeyPressed(letter: string) {
    this.keyboardCharacters.update((chars) =>
      chars.map((char) => (char.value === letter ? { ...char, disabled: true } : char)),
    );
    this.guessLetter(letter);
    this.gameService.attempts.update((n) => n + 1);
    this.gameService.checkWin();
  }
}
