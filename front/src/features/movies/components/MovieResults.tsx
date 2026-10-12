import type { ChangeEvent } from 'react';
import { Alert, Box, CircularProgress, Pagination, Typography } from '@mui/material';
import { MovieCard } from './MovieCard';
import type { Movie } from '../model/types';

interface MovieResultsProps {
  title: string;
  movies: Movie[];
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  showFavorites: boolean;
  page: number;
  totalPages: number;
  onPageChange: (event: ChangeEvent<unknown>, page: number) => void;
  onToggleFavorite: (movie: Movie) => void;
}

export function MovieResults({
  title,
  movies,
  favorites,
  loading,
  error,
  showFavorites,
  page,
  totalPages,
  onPageChange,
  onToggleFavorite,
}: MovieResultsProps) {
  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 800, mb: 3, fontSize: { xs: '1.7rem', md: '2.1rem' } }}>
        {title}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: { xs: 2, md: 3 } }}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.some((favorite) => favorite.id === movie.id)}
            onToggleFavorite={() => onToggleFavorite(movie)}
          />
        ))}
      </Box>

      {!loading && !error && movies.length === 0 && (
        <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 6 }}>
          {showFavorites ? 'Henüz favori filminiz yok.' : 'Film bulunamadı.'}
        </Typography>
      )}

      {!showFavorites && totalPages > 1 && (
        <Pagination
          count={Math.min(totalPages, 500)}
          page={page}
          onChange={onPageChange}
          color="secondary"
          sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}
        />
      )}
    </>
  );
}