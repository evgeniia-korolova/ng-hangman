import { Component, computed, inject, linkedSignal, signal, OnInit } from '@angular/core';
import { HangmanDisplay } from './hangman-display/hangman-display';
import { Question } from './question/question';
import { Keyboard } from './keyboard/keyboard';
import { HangmanService } from '../../core/services/hangman-service';
import { GameService } from '../../core/services/game-service';
import { Actions } from './actions/actions';
import { KEY_CHAR_EN, KEYBOARD_LAYOUTS, MAX_MISTAKES } from './constants/constants';
import { LanguageService } from '../../core/services/language-service';
import { GameOverScreen } from './game-over-screen/game-over-screen';

@Component({
  selector: 'app-hangman',
  imports: [HangmanDisplay, Question, Keyboard, Actions, GameOverScreen],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export default class Hangman implements OnInit {
  private readonly hangmanService = inject(HangmanService);
  private readonly gameService = inject(GameService);
  private languageService = inject(LanguageService);

  //все работало пока не закомментировала

  // readonly currentQuizz = this.gameService.initQuizz;
  readonly currentQuizz = this.gameService.randomQuizz;
  // readonly currentQuizz = signal<QuizzItem | null>(null);

  ngOnInit() {     
    this.gameService.startGame();    
  }

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

  checkWin() {
    const word = this.currentQuizz()?.word ?? '';
    const uniqueLetters = new Set(word);
    const guessedLetters = new Set(this.guesses());

    const isWin = guessedLetters.size === uniqueLetters.size;
    if (isWin) {
      this.success.set(true);
      this.isGameOver.set(true);
    }
    if (this.mistakesRemaining() === 0) {
      this.isGameOver.set(true);
    }
  }

  restartGame(): void {
    this.gameService.startGame();

    this.guesses.set([]);
    this.wrongGuesses.set([]);
    this.attempts.set(0);
    this.success.set(false);
    this.isGameOver.set(false);
    this.keyboardCharacters.update((chars) =>
      chars.map((char) => ( { ...char, disabled: false })),
    );
  }
}
