import React, { useState } from 'react';

import { keyframes } from '@mui/system';
import {
  Box,
  Button,
  Dialog,
  Tooltip,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import AnimatedButton from './AnimatedButton';

const moods = [
  { emoji: '😊', name: 'Happy', color: '#FFD700' },
  { emoji: '😌', name: 'Relaxed', color: '#98FB98' },
  { emoji: '🤔', name: 'Curious', color: '#87CEFA' },
  { emoji: '😴', name: 'Tired', color: '#DDA0DD' },
  { emoji: '😎', name: 'Adventurous', color: '#FFA500' },
  { emoji: '🥳', name: 'Excited', color: '#FF69B4' },
  { emoji: '😌', name: 'Peaceful', color: '#E6E6FA' },
  { emoji: '🤓', name: 'Intellectual', color: '#B0C4DE' },
  // { emoji: '🌟', name: 'Inspired', color: '#FFD700' },
  { emoji: '🏃‍♂️', name: 'Energetic', color: '#7CFC00' },
  { emoji: '🧘', name: 'Mindful', color: '#E0FFFF' },
  // { emoji: '🎭', name: 'Creative', color: '#FF7F50' },
  { emoji: '🌿', name: 'Nature-loving', color: '#90EE90' },
  { emoji: '🍽️', name: 'Foodie', color: '#F08080' },
  // { emoji: '📚', name: 'Studious', color: '#F4A460' },
];

const popAnimation = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
`;

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  loading: boolean;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customMood, setCustomMood] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMoodSelect = (mood: string) => {
    onMoodSelect(mood);
    setIsOpen(false);
  };

  const handleCustomMoodSubmit = () => {
    if (customMood.trim()) {
      onMoodSelect(customMood.trim());
      setDialogOpen(false);
      setCustomMood('');
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '400px', width: '400px', margin: 'auto' }}>
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{
          position: 'absolute',
          top: '0',
          left: '0',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        How are you feeling today?
      </Typography>

      <Box sx={{ position: 'relative', width: '1', height: '600px', margin: '20px 0' }}>
        <AnimatedButton
          onClick={toggleMenu}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            fontSize: '24px',
          }}
        >
          {isOpen ? '✖' : '🎭'}
        </AnimatedButton>

        {moods.map((mood, index) => {
          const angle = (index / moods.length) * 2 * Math.PI;
          const x = Math.cos(angle) * 150; // Adjust this value to change the circle size
          const y = Math.sin(angle) * 150; // Adjust this value to change the circle size
          return (
            <Tooltip key={mood.name} title={mood.name} placement="top" arrow>
              <Button
                key={mood.name}
                onClick={() => handleMoodSelect(mood.name)}
                disabled={loading || !isOpen}
                sx={{
                  position: 'absolute',
                  top: 'calc(50% - 25px)', // Half of the button height
                  left: 'calc(50% - 30px)', // Half of the button width
                  transform: `translate(${x}px, ${y}px)`,
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: mood.color,
                  color: 'black',
                  opacity: isOpen ? 1 : 0,
                  transition: 'all 0.3s ease-in-out',
                  animation: isOpen ? `${popAnimation} 0.5s ease-out` : 'none',
                  '&:hover': {
                    backgroundColor: mood.color,
                    opacity: 0.8,
                  },
                }}
              >
                <Typography variant="h6">{mood.emoji}</Typography>
              </Button>
            </Tooltip>
          );
        })}

        <AnimatedButton
          onClick={() => setDialogOpen(true)}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          Type Your Own Mood
        </AnimatedButton>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Enter Your Mood</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            autoComplete="off"
            margin="dense"
            id="mood"
            label="Your Mood"
            type="text"
            fullWidth
            variant="standard"
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomMoodSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MoodSelector;
