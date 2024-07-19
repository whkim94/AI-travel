'use client';

import { useState } from 'react';

import { Box, Button, TextField } from '@mui/material';

interface MoodFormProps {
  onSubmit: (mood: string) => void;
  loading: boolean;
}

export default function MoodForm({ onSubmit, loading }: MoodFormProps) {
  const [mood, setMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit(mood);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="mood"
        label="How are you feeling today?"
        name="mood"
        autoFocus
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        disabled={loading}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading || !mood.trim()}
      >
        {loading ? 'Loading...' : 'Get Suggestions'}
      </Button>
    </Box>
  );
}
