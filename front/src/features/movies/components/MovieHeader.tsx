import { Box, Typography } from '@mui/material';

export function MovieHeader() {
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
      <Typography
        variant="h2"
        component="h1"
        sx={{
          color: 'primary.main',
          fontWeight: 900,
          letterSpacing: { xs: 2, md: 6 },
          fontSize: { xs: '2.2rem', md: '3.5rem' },
        }}
      >
        CİNEHUB
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        İzlemek isteyeceğiniz filmleri keşfedin
      </Typography>
    </Box>
  );
}