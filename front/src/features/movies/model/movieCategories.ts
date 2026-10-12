import type { MovieCategory } from './types';

export const defaultMovieCategories: { label: string; value: MovieCategory }[] = [
  { label: 'Ana Sayfa', value: 'home' },
  { label: 'Top 10', value: 'top10' },
];

export const movieCategoryTitles: Record<'home' | 'top10', string> = {
  home: 'Filmler',
  top10: 'Top 10 Filmler',
};

export function getMovieCategoryTitle(category: MovieCategory, genreNames: string[]): string {
  if (category === 'home' || category === 'top10') {
    return movieCategoryTitles[category];
  }
  const genreName = category.slice('genre:'.length);
  return `${genreNames.find((name) => name === genreName) ?? genreName} Filmleri`;
}
