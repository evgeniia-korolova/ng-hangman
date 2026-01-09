import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LanguageService } from './language-service';
import { QuizzItem } from '../models/quizz-item.interface';
import { QuizzLibrary } from '../models/quizz-library.interface';
import { QuizzDataByCategory } from '../models/quizz-data-by-category.interface';

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  private readonly languageService = inject(LanguageService);

  readonly currentCategory = signal<string>('general');

  // readonly quizzLibraryResource = httpResource<QuizzLibrary>(() => {
  //   const lang = this.languageService.currentLanguage();
  //   return `i18n/${lang}.json`;
  // }, {
  //   defaultValue: { categoryEntries: {} }
  // });
  readonly quizzLibraryResource = httpResource<QuizzLibrary>(
    () => {
      const lang = this.languageService.currentLanguage();
      return `i18n/${lang}.json`;
    },
    {
      defaultValue: { categoryEntries: {} },
      parse: (json: any): QuizzLibrary => {
        // json — это весь объект из i18n (title, en, ru, choose_language, mistakes_remaining, categories)
        // мы возвращаем только нужный кусок
        return {
          categoryEntries: json.categories ?? {},
        };
      },
    },
  );

  // список доступных категорий (реактивно, без effect)
  readonly categories = computed<string[]>(() => {
    const lib = this.quizzLibraryResource.value();
    if (!lib) return [];
    return Object.keys(lib.categoryEntries);
  });

  // данные текущей категории
  readonly currentCategoryData = computed<QuizzDataByCategory | undefined>(() => {
    const lib = this.quizzLibraryResource.value();
    if (!lib) return undefined;
    const key = this.currentCategory();
    return lib.categoryEntries?.[key];
  });

  // массив пар слово–подсказка для текущей категории
  readonly currentQuizzItems = computed<QuizzItem[]>(() => {
    const data = this.currentCategoryData();
    return Array.isArray(data?.items) ? data!.items : [];
  });

  setCategory(category: string): void {
    this.currentCategory.set(category);
  }

  readonly categoryList = computed(() => {
    const lib = this.quizzLibraryResource.value();
    if (!lib) return [];
    return Object.entries(lib.categoryEntries).map(([key, value]) => ({
      key,
      title: value.title
    }));
  });
  
  

  // protected readonly wordsResource = httpResource<QuizzLibrary>(
  //   () => `i18n/${this.langService.currentLanguage()}.json`,
  // );

  // setCategory(category: string): void {
  //   this.currentCategory.set(category);
  // }

  // getWords(): QuizzItem[] {
  //   const data = this.wordsResource.value();
  //   if (!data || !data.categoryEntries) return [];

  //   const category = data.categoryEntries[this.currentCategory()];
  //   if (!category || !Array.isArray(category.items)) return [];

  //   return category.items;
  // }
}
