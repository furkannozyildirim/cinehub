import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Link, Rating, Typography } from '@mui/material';
import { getMovieDetails } from '../api/movieService';
import type { Movie, MovieDetails } from '../model/types';

interface MovieDetailsDialogProps {
  movie: Movie;
  onClose: () => void;
}

export function MovieDetailsDialog({ movie, onClose }: MovieDetailsDialogProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    getMovieDetails(movie.id)
      .then((movieDetails) => {
        if (isCurrent) setDetails(movieDetails);
      })
      .catch(() => {
        if (isCurrent) setError('Film detayları yüklenemedi.');
      });

    return () => {
      isCurrent = false;
    };
  }, [movie.id]);

  const loading = !details && !error;

  const backdropUrl = details?.backdropUrl || movie.backdropUrl || movie.posterUrl
    || 'https://placehold.co/1280x720?text=G%C3%B6rsel+Yok';
  const posterUrl = details?.posterUrl || movie.posterUrl
    || 'https://placehold.co/300x450?text=Afi%C5%9F+Yok';

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#11182b',
            color: 'text.primary',
            border: '1px solid rgba(124,140,255,0.25)',
            borderRadius: 3,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(100deg, #202b50, #151d32)',
          fontWeight: 'bold',
          fontSize: '1.4rem',
        }}
      >
        {details?.title ?? movie.title}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, borderColor: 'rgba(255,255,255,0.1)' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>}

        {details && !loading && (
          <Box>
            <Box
              role="img"
              aria-label={`${details.title} arka planı`}
              sx={{
                height: 210,
                backgroundImage: `linear-gradient(to bottom, rgba(17,24,43,0.05), #11182b), url(${backdropUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                px: { xs: 2, sm: 4 },
                mt: { xs: -2, sm: -8 },
                position: 'relative',
                zIndex: 1,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Box
                component="img"
                src={posterUrl}
                alt={`${details.title} afişi`}
                sx={{
                  width: { xs: 130, sm: 170 },
                  height: { xs: 195, sm: 255 },
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
                  alignSelf: { xs: 'center', sm: 'flex-start' },
                }}
              />

              <Box sx={{ flex: 1, minWidth: 0, pt: { xs: 1, sm: 7 } }}>
                {details.tagline && (
                  <Typography sx={{ color: '#d1c4e9', fontStyle: 'italic', mb: 2 }}>
                    “{details.tagline}”
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={details.rating / 2} precision={0.1} readOnly />
                  <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {details.rating.toFixed(1)} / 10
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {details.genres.map((genre) => (
                    <Chip key={genre} label={genre} size="small" />
                  ))}
                </Box>
              </Box>
            </Box>

            <Box sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, mb: 1 }}>
                Hikâye
              </Typography>
              <Typography sx={{ color: '#dfe5f5', lineHeight: 1.8, mb: 3 }}>
                {details.overview || 'Bu film için hikâye bilgisi bulunamadı.'}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 1.5 }}>
                <MovieDetail label="Oy sayısı" value={details.voteCount.toLocaleString('tr-TR')} />
                <MovieDetail label="Çıkış tarihi" value={details.releaseDate || 'Bilinmiyor'} />
                <MovieDetail label="Süre" value={`${details.runtimeMinutes} dakika`} />
              </Box>
              {details.imdbId && (
                <Link href={`https://www.imdb.com/title/${details.imdbId}/`} target="_blank" rel="noreferrer" sx={{ display: 'inline-block', mt: 3 }}>
                  IMDb sayfasını aç →
                </Link>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ backgroundColor: '#0d1324', px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ color: '#171a24' }}>
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface MovieDetailProps {
  label: string;
  value: string;
}

function MovieDetail({ label, value }: MovieDetailProps) {
  return (
    <Box sx={{ backgroundColor: 'rgba(245,185,66,0.08)', border: '1px solid rgba(245,185,66,0.25)', borderRadius: 2, p: 1.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>{value}</Typography>
    </Box>
  );
}