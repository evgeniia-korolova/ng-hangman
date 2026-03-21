import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LanguageService } from './language-service';
import { QuizzItem } from '../models/quizz-item.interface';
import { QuizzLibrary } from '../models/quizz-library.interface';
import { QuizzDataByCategory } from '../models/quizz-data-by-category.interface';
import { FullLibrary } from '../models/full-library.interface';

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  private readonly languageService = inject(LanguageService);

  readonly currentCategory = signal<string>('general');

  readonly quizzLibraryResource = httpResource<QuizzLibrary>(
    () => {
      const lang = this.languageService.currentLanguage();
      return {
        url: `i18n/${lang}.json`,
        method: 'GET',
      };
    },
    {
      defaultValue: { categoryEntries: {} },
      // parse: (value: unknown): QuizzLibrary => {
      //   const json = value as FullLibrary;
      //   return {
      //     categoryEntries: json.categories ?? {},
      //   };
      // },
      parse: (value: unknown): QuizzLibrary => {
        const json = value as FullLibrary;

        // категории
        const categoryEntries = json.categories ?? {};

        // языки: берём ключи en/ru и их значения
        const languages = Object.entries(json)
          .filter(([key]) => ['en', 'ru'].includes(key))
          .map(([key, value]) => ({ key, title: value as string }));

        return { categoryEntries, languages };
      },
    },
  );

  readonly languageList = computed(() => {
    const library = this.quizzLibraryResource.value();
    return library?.languages ?? [];
  });
  
  readonly categories = computed<string[]>(() => {
    const library = this.quizzLibraryResource.value();
    if (!library) return [];
    return Object.keys(library.categoryEntries);
  });

  // данные текущей категории
  readonly currentCategoryData = computed<QuizzDataByCategory | undefined>(() => {
    const library = this.quizzLibraryResource.value();
    if (!library) return;
    const key = this.currentCategory();
    return library.categoryEntries?.[key];
  });

  // массив пар слово–подсказка для текущей категории
  readonly currentQuizzItems = computed<QuizzItem[]>(() => {
    const data = this.currentCategoryData();
    return Array.isArray(data?.items) ? data!.items : [];
  });

  readonly currentQuizzItemsLength = computed<number>(() => this.currentQuizzItems().length);

  setCategory(category: string): void {
    this.currentCategory.set(category);
  }

  readonly categoryList = computed(() => {
    const library = this.quizzLibraryResource.value();
    if (!library) return [];
    return Object.entries(library.categoryEntries).map(([key, value]) => ({
      key,
      title: value.title,
    }));
  });
}
