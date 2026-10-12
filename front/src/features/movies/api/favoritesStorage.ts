import type { Movie } from '../model/types';

const STORAGE_KEY = 'cinehub-favorites';

export function loadFavorites(): Movie[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedFavorites: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(savedFavorites) ? (savedFavorites as Movie[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: Movie[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    return;
  }
}