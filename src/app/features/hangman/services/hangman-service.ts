import { httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language-service';

export interface WordItem {
  word: string;
  hint: string;
}

export interface Category {
  items: WordItem[];
}

export interface WordsDictionary {
  // UI-строки остаются, но для игры важен блок ниже
  categories: Record<string, Category>;
}

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  private readonly langService = inject(LanguageService);

  readonly currentCategory = signal<string>('general');

  protected readonly wordsResource = httpResource<WordsDictionary>(
    () => `i18n/${this.langService.currentLanguage()}.json`,
  );

  setCategory(category: string): void {
    this.currentCategory.set(category);
  }


  getWords(): WordItem[] {
    const data = this.wordsResource.value();
    if (!data || !data.categories) return [];

    const category = data.categories[this.currentCategory()];
    if (!category || !Array.isArray(category.items)) return [];

    return category.items;
  }
}
