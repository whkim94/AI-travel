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
