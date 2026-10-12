import { useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Typography } from '@mui/material';
import { MovieDetailsDialog } from './MovieDetailsDialog';
import type { Movie } from '../model/types';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function MovieCard({ movie, isFavorite, onToggleFavorite }: MovieCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const posterUrl = movie.posterUrl || 'https://placehold.co/500x750?text=Afi%C5%9F+Yok';

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#151d32',
          color: 'text.primary',
          overflow: 'hidden',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 18px 38px rgba(0,0,0,0.35)',
          },
        }}
      >
        <CardMedia
          component="img"
          image={posterUrl}
          alt={`${movie.title} afişi`}
          sx={{ height: 320, objectFit: 'cover', backgroundColor: '#202b50' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                lineHeight: 1.2,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {movie.title}
            </Typography>
            <IconButton
              aria-label={isFavorite ? `${movie.title} favorilerden çıkar` : `${movie.title} favorilere ekle`}
              onClick={onToggleFavorite}
              color="primary"
              size="small"
              sx={{ flexShrink: 0, color: isFavorite ? 'primary.main' : 'text.secondary' }}
            >
              <span aria-hidden="true" style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                {isFavorite ? '♥' : '♡'}
              </span>
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={movie.rating / 2} precision={0.1} readOnly size="small" />
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {movie.rating.toFixed(1)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setDetailsOpen(true)}
            sx={{ mt: 2, color: '#171a24', '&:hover': { backgroundColor: '#ffd166' } }}
          >
            İncele
          </Button>
        </CardContent>
      </Card>
      {detailsOpen && (
        <MovieDetailsDialog movie={movie} onClose={() => setDetailsOpen(false)} />
      )}
    </>
  );
}