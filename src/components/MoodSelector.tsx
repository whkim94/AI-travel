import React, { useState } from 'react';

import { Box, Grid, Button, Typography } from '@mui/material';

import MoodForm from './MoodForm';

const moods = [
  { emoji: '😊', name: 'Happy', color: '#FFD700' },
  { emoji: '😌', name: 'Relaxed', color: '#98FB98' },
  { emoji: '🤔', name: 'Curious', color: '#87CEFA' },
  { emoji: '😴', name: 'Tired', color: '#DDA0DD' },
  { emoji: '😎', name: 'Adventurous', color: '#FFA500' },
  { emoji: '🥳', name: 'Excited', color: '#FF69B4' },
  { emoji: '😌', name: 'Peaceful', color: '#E6E6FA' },
  { emoji: '🤓', name: 'Intellectual', color: '#B0C4DE' },
  { emoji: '🌟', name: 'Inspired', color: '#FFD700' },
  { emoji: '🏃‍♂️', name: 'Energetic', color: '#7CFC00' },
  { emoji: '🧘', name: 'Mindful', color: '#E0FFFF' },
  { emoji: '🎭', name: 'Creative', color: '#FF7F50' },
  { emoji: '🌿', name: 'Nature-loving', color: '#90EE90' },
  { emoji: '🍽️', name: 'Foodie', color: '#F08080' },
  { emoji: '📚', name: 'Studious', color: '#F4A460' },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  loading: boolean;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, loading }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleEmojiClick = (mood: string) => {
    onMoodSelect(mood);
  };

  const handleCustomMoodClick = () => {
    setShowCustomInput(true);
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        How are you feeling today?
      </Typography>
      {!showCustomInput ? (
        <>
          <Grid container spacing={2} justifyContent="center">
            {moods.map((mood) => (
              <Grid item key={mood.name}>
                <Button
                  onClick={() => handleEmojiClick(mood.name)}
                  sx={{
                    backgroundColor: mood.color,
                    color: 'black',
                    '&:hover': {
                      backgroundColor: mood.color,
                      opacity: 0.8,
                    },
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h4">{mood.emoji}</Typography>
                  <Typography variant="caption">{mood.name}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={handleCustomMoodClick} variant="outlined">
              Type Your Own Mood
            </Button>
          </Box>
        </>
      ) : (
        <MoodForm onSubmit={onMoodSelect} loading={loading} />
      )}
    </Box>
  );
};

export default MoodSelector;
