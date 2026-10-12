import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Container, Link, Typography } from '@mui/material';
import type { AppDispatch, RootState } from '../../../app/store';
import { loadMoviesByCategory, searchMovies, toggleFavorite } from '../model/movieSlice';
import { defaultMovieCategories, getMovieCategoryTitle } from '../model/movieCategories';
import type { MovieCategory } from '../model/types';
import { getGenres } from '../api/movieService';
import { MovieCategoryNavigation } from '../components/MovieCategoryNavigation';
import { MovieHeader } from '../components/MovieHeader';
import { MovieResults } from '../components/MovieResults';
import { MovieSearchForm } from '../components/MovieSearchForm';

export function MovieCatalogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<MovieCategory>('home');
  const [showFavorites, setShowFavorites] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [genreError, setGenreError] = useState('');
  const { movies, favorites, loading, error, page, totalPages } = useSelector(
    (state: RootState) => state.movies,
  );

  const categories = useMemo(
    () => [
      ...defaultMovieCategories,
      ...genres.map((genre) => ({ label: genre, value: `genre:${genre}` as const })),
    ],
    [genres],
  );

  const refreshGenres = useCallback(() => {
    getGenres()
      .then((result) => {
        setGenres(result);
        setGenreError('');
      })
      .catch(() => setGenreError('Türler API’den alınamadı. Backend ve PostgreSQL bağlantısını kontrol edin.'));
  }, []);

  useEffect(() => {
    refreshGenres();
  }, [refreshGenres]);

  useEffect(() => {
    if (!showFavorites) {
      dispatch(loadMoviesByCategory({ category: activeCategory, page: 1 }));
    }
  }, [activeCategory, dispatch, showFavorites]);

  useEffect(() => {
    const query = searchTerm.trim();
    if (!query) return;

    const timer = window.setTimeout(() => {
      if (!showFavorites) dispatch(searchMovies({ query, page: 1 }));
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchTerm, dispatch, showFavorites]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();

    if (query) {
      setShowFavorites(false);
      dispatch(searchMovies({ query, page: 1 }));
      return;
    }

    dispatch(loadMoviesByCategory({ category: activeCategory, page: 1 }));
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) dispatch(loadMoviesByCategory({ category: activeCategory, page: 1 }));
  };

  const handleCategoryChange = (category: MovieCategory) => {
    setActiveCategory(category);
    setSearchTerm('');
    setShowFavorites(false);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, nextPage: number) => {
    const query = searchTerm.trim();
    if (query) {
      dispatch(searchMovies({ query, page: nextPage }));
      return;
    }

    dispatch(loadMoviesByCategory({ category: activeCategory, page: nextPage }));
  };

  const title = showFavorites
    ? 'Favori Filmler'
    : searchTerm.trim()
      ? `“${searchTerm.trim()}” arama sonuçları`
      : getMovieCategoryTitle(activeCategory, genres);
  const displayedMovies = showFavorites ? favorites : movies;

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 }, background: 'radial-gradient(circle at top right, #202b50 0, #0b1020 42%, #080b14 100%)' }}>
      <Container maxWidth="xl">
        <MovieHeader />
        {genreError && <Alert severity="warning" sx={{ mb: 2 }}>{genreError}</Alert>}
        <MovieCategoryNavigation
          categories={categories}
          activeCategory={activeCategory}
          showFavorites={showFavorites}
          favoritesCount={favorites.length}
          onCategoryChange={handleCategoryChange}
          onShowFavorites={() => {
            setShowFavorites(true);
            setSearchTerm('');
          }}
        />
        <MovieSearchForm
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSubmit={handleSearch}
        />
        <MovieResults
          title={title}
          movies={displayedMovies}
          favorites={favorites}
          loading={loading}
          error={error}
          showFavorites={showFavorites}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onToggleFavorite={(movie) => dispatch(toggleFavorite(movie))}
        />
        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center' }}>
          <Link href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            <Box
              component="img"
              src="https://www.themoviedb.org/assets/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="The Movie Database (TMDB)"
              sx={{ width: 120, display: 'block', backgroundColor: '#fff', borderRadius: 1, p: 0.5 }}
            />
          </Link>
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 700 }}>
            This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}