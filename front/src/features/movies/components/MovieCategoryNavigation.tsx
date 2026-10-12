import { Box, Button } from '@mui/material';
import type { MovieCategory } from '../model/types';

interface MovieCategoryNavigationProps {
  categories: { label: string; value: MovieCategory }[];
  activeCategory: MovieCategory;
  showFavorites: boolean;
  favoritesCount: number;
  onCategoryChange: (category: MovieCategory) => void;
  onShowFavorites: () => void;
}

export function MovieCategoryNavigation({
  categories,
  activeCategory,
  showFavorites,
  favoritesCount,
  onCategoryChange,
  onShowFavorites,
}: MovieCategoryNavigationProps) {
  return (
    <Box
      component="nav"
      aria-label="Film kategorileri"
      sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}
    >
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={!showFavorites && activeCategory === category.value ? 'contained' : 'outlined'}
          color="secondary"
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </Button>
      ))}
      <Button
        variant={showFavorites ? 'contained' : 'outlined'}
        color="warning"
        onClick={onShowFavorites}
        sx={{ color: showFavorites ? '#171a24' : 'primary.main' }}
      >
        Favoriler ({favoritesCount})
      </Button>
    </Box>
  );
}