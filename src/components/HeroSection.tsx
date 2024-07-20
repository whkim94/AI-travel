import React from 'react';

import { Box, useTheme, Container, Typography } from '@mui/material';

import { getContrastColor } from 'src/utils/colorUtils';

function HeroSection() {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;
  const textColor = getContrastColor(backgroundColor);

  return (
    <Box
      sx={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '25vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <Container>
        <Typography variant="h2" component="h1" color="textColor" gutterBottom>
          MoodTrek
        </Typography>
        <Typography variant="h5" color="textColor">
          Discover your perfect itinerary based on your mood
        </Typography>
      </Container>
    </Box>
  );
}

export default HeroSection;
