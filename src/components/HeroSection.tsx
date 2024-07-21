import React from 'react';

import { Box, Container, Typography } from '@mui/material';

const HeroSection: React.FC = () => (
  <Box
    sx={{
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '25vh',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Add text shadow for better readability
    }}
  >
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        MoodTrek
      </Typography>
      <Typography variant="h5">Discover your perfect itinerary based on your mood</Typography>
    </Container>
  </Box>
);

export default HeroSection;
