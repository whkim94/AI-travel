import React from 'react';

import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedBackground: React.FC = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: `linear-gradient(
          -45deg, 
          #FFD700, 
          #98FB98, 
          #87CEFA, 
          #DDA0DD, 
          #FFA500, 
          #FF69B4, 
          #E6E6FA, 
          #B0C4DE, 
          #7CFC00, 
          #E0FFFF
        )`,
      backgroundSize: '400% 400%',
      animation: `${gradientAnimation} 15s ease infinite`,
    }}
  />
);

export default AnimatedBackground;
