export interface Movie {
  id: number;
  title: string;
  overview: string;
  tagline: string | null;
  imdbId: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  runtimeMinutes: number;
  rating: number;
  voteCount: number;
  genres: string[];
}

export type MovieCategory = 'home' | 'top10' | `genre:${string}`;

export interface MoviePage {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface MoviePageResponse {
  content: Movie[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type MovieDetails = Movie;

export interface MovieRequest {
  title: string;
  overview: string;
  tagline?: string | null;
  imdbId?: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  runtimeMinutes: number;
  rating: number;
  voteCount: number;
  genres: string[];
}
