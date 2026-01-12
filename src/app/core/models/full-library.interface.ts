import { QuizzDataByCategory } from './quizz-data-by-category.interface';

export interface FullLibrary {
  title?: string;
  en?: string;
  ru?: string;
  choose_language?: string;
  mistakes_remaining?: string;
  choose_category?: string;
  categories?: Record<string, QuizzDataByCategory>;
}
