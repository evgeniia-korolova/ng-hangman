import { QuizzDataByCategory } from './quizz-data-by-category.interface';

export interface QuizzLibrary {
  categoryEntries: Record<string, QuizzDataByCategory>;
  languages?: { key: string; title: string }[];
}
