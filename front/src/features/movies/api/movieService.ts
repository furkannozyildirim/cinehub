import axios from 'axios';
import type { Movie, MovieCategory, MovieDetails, MoviePage, MoviePageResponse, MovieRequest } from '../model/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

const toMoviePage = (response: MoviePageResponse): MoviePage => ({
  movies: response.content,
  page: response.page + 1,
  totalPages: response.totalPages,
  totalResults: response.totalElements,
});

export async function getGenres(): Promise<string[]> {
  const response = await api.get<string[]>('/genres');
  return response.data;
}

export async function getMoviesByCategory(category: MovieCategory, page = 1): Promise<MoviePage> {
  if (category === 'top10') {
    const response = await api.get<Movie[]>('/movies/top-rated');
    return { movies: response.data, page: 1, totalPages: 1, totalResults: response.data.length };
  }

  const genre = category.startsWith('genre:') ? category.slice('genre:'.length) : undefined;
  const response = await api.get<MoviePageResponse>('/movies', {
    params: { page: page - 1, size: 20, genre },
  });
  return toMoviePage(response.data);
}

export async function searchMovieResults(query: string, page = 1): Promise<MoviePage> {
  const response = await api.get<MoviePageResponse>('/movies', {
    params: { search: query, page: page - 1, size: 20 },
  });
  return toMoviePage(response.data);
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const response = await api.get<MovieDetails>(`/movies/${movieId}`);
  return response.data;
}

export async function createMovie(movie: MovieRequest): Promise<Movie> {
  const response = await api.post<Movie>('/movies', movie);
  return response.data;
}
