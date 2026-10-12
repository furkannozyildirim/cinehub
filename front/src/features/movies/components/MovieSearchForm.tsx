import type { FormEventHandler } from 'react';
import { Box, Button, TextField } from '@mui/material';

interface MovieSearchFormProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function MovieSearchForm({ searchTerm, onSearchTermChange, onSubmit }: MovieSearchFormProps) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        gap: 2,
        maxWidth: 700,
        mx: 'auto',
        mb: 5,
        p: 1,
        borderRadius: 3,
        backgroundColor: 'rgba(21,29,50,0.8)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <TextField
        fullWidth
        label="Film ara"
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
        placeholder="Örneğin: Inception"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 2,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.14)' },
            '&:hover fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <Button type="submit" variant="contained" color="secondary">
        Ara
      </Button>
    </Box>
  );
}