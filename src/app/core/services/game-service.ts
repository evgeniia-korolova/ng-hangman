import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { QuizzItem } from '../models/quizz-item.interface';
import { loadStats } from './storage.helper';
import { LanguageService } from './language-service';
import { AuthService } from './auth-service';
import { updateUser } from '../../core/services/storage.helper';
import { LibraryService } from './library-service';
import { MAX_MISTAKES } from '../../features/hangman/constants/constants';
import { QuizzDataByCategory } from '../models/quizz-data-by-category.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly libraryService = inject(LibraryService);
  private languageService = inject(LanguageService);
  readonly authService = inject(AuthService);

  readonly gamesNumber = signal(loadStats().games);
  readonly wins = signal(loadStats().wins);
  readonly losses = signal(loadStats().losses);

  readonly currentCategory = signal<string>('general');

  readonly guesses = signal<string[]>([]);
  readonly wrongGuesses = signal<string[]>([]);
  readonly attempts = signal(0);

  readonly maxMistakes = MAX_MISTAKES;
  readonly success = signal(false);

  readonly isGameOver = signal(false);
  readonly correctWord = signal<string>('');

  readonly currentLanguage = this.languageService.currentLanguage;

  readonly mistakesRemaining = computed(() => this.maxMistakes - this.wrongGuesses().length);

  readonly currentCategoryData = computed<QuizzDataByCategory | undefined>(() => {
    const library = this.libraryService.quizzLibraryResource.value();
    if (!library) return;
    const key = this.currentCategory();
    return library.categoryEntries?.[key];
  });

  readonly currentQuizzItems = computed<QuizzItem[]>(() => {
    const library = this.libraryService.quizzLibraryResource.value();
    if (!library) return [];
    const key = this.currentCategory();
    const category = library.categoryEntries?.[key];
    return Array.isArray(category?.items) ? category.items : [];
  });

  readonly currentQuizzItemsLength = computed<number>(() => this.currentQuizzItems().length);

  readonly randomQuizz = computed<QuizzItem | null>(() => {
    const items = this.currentQuizzItems();
    const index = this.randomIndex();
    return index !== null && items.length > 0 ? (items[index] ?? null) : null;
  });

  readonly randomIndex = linkedSignal<number | null>(() => {
    const items = this.currentQuizzItems();
    this.gamesNumber();

    if (items.length === 0) return null;

    return Math.floor(Math.random() * items.length);
  });

  private syncStatsToUser(): void {
    const updatedUser = updateUser({
      stats: {
        games: this.gamesNumber(),
        wins: this.wins(),
        losses: this.losses(),
      },
    });
    if (updatedUser) this.authService.currentUser.set(updatedUser);
  }

  checkWin() {
    const word = this.randomQuizz()?.word ?? '';
    const uniqueLetters = new Set(word);
    const guessedLetters = new Set(this.guesses());

    const isWin = guessedLetters.size === uniqueLetters.size;
    if (isWin) {
      this.success.set(true);
      this.wins.update((v) => v + 1);
      this.gamesNumber.update((v) => v + 1);
      this.correctWord.set(word);
      this.isGameOver.set(true);
      this.syncStatsToUser();
    }

    if (this.mistakesRemaining() === 0) {
      this.losses.update((v) => v + 1);
      this.gamesNumber.update((v) => v + 1);
      this.isGameOver.set(true);
      this.correctWord.set(word);
      this.syncStatsToUser();
    }
  }

  setCategory(category: string): void {
    this.currentCategory.set(category);
  }

  restartGame(): void {
    this.guesses.set([]);
    this.wrongGuesses.set([]);
    this.attempts.set(0);
    this.success.set(false);
    this.isGameOver.set(false);
  }
}
