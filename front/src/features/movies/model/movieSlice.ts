import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadFavorites } from '../api/favoritesStorage';
import { getMoviesByCategory, searchMovieResults } from '../api/movieService';
import type { Movie, MovieCategory, MoviePage } from './types';

interface MovieState {
  movies: Movie[];
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  currentRequestId?: string;
  page: number;
  totalPages: number;
  totalResults: number;
}

const initialState: MovieState = {
  movies: [],
  favorites: loadFavorites(),
  loading: false,
  error: null,
  currentRequestId: undefined,
  page: 1,
  totalPages: 1,
  totalResults: 0,
};

export const loadMoviesByCategory = createAsyncThunk(
  'movies/loadByCategory',
  async ({ category, page = 1 }: { category: MovieCategory; page?: number }): Promise<MoviePage> =>
    getMoviesByCategory(category, page),
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page = 1 }: { query: string; page?: number }): Promise<MoviePage> =>
    searchMovieResults(query, page),
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleFavorite: (state, action: { payload: Movie }) => {
      const movie = action.payload;
      const favoriteIndex = state.favorites.findIndex((item) => item.id === movie.id);

      if (favoriteIndex >= 0) {
        state.favorites.splice(favoriteIndex, 1);
      } else {
        state.favorites.push(movie);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoviesByCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(loadMoviesByCategory.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.movies = action.payload.movies;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalResults = action.payload.totalResults;
        state.currentRequestId = undefined;
      })
      .addCase(loadMoviesByCategory.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.error = action.error.message || 'Filmler yüklenemedi';
        state.currentRequestId = undefined;
      })
      .addCase(searchMovies.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.movies = action.payload.movies;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalResults = action.payload.totalResults;
        state.currentRequestId = undefined;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.error = action.error.message || 'Film araması başarısız oldu';
        state.currentRequestId = undefined;
      });
  },
});

export const { toggleFavorite } = movieSlice.actions;
export default movieSlice.reducer;