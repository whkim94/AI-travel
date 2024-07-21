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
          #D4AF37, 
          #66C266, 
          #5CACEE, 
          #C084C0, 
          #E69500, 
          #E6558D, 
          #C1C1E1, 
          #8BA9CC, 
          #66B266, 
          #B0E0E6
        )`,
      backgroundSize: '400% 400%',
      animation: `${gradientAnimation} 15s ease infinite`,
    }}
  />
);

export default AnimatedBackground;
