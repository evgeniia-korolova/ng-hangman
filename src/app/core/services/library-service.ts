import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { QuizzLibrary } from '../models/quizz-library.interface';
import { LanguageService } from './language-service';
import { FullLibrary } from '../models/full-library.interface';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private readonly languageService = inject(LanguageService);
  
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
      parse: (value: unknown): QuizzLibrary => {
        const json = value as FullLibrary;        
        const categoryEntries = json.categories ?? {};

        
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

  readonly categoryList = computed(() => {
    const library = this.quizzLibraryResource.value();
    if (!library) return [];
    return Object.entries(library.categoryEntries).map(([key, value]) => ({
      key,
      title: value.title,
    }));
  });
}
