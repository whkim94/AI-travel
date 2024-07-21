import React from 'react';

import { keyframes } from '@mui/system';
import { Button, ButtonProps } from '@mui/material';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, ...props }) => (
  <Button
    {...props}
    sx={{
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
      color: 'white',
      fontWeight: 'bold',
      '&:hover': {
        opacity: 0.8,
      },
      ...props.sx,
    }}
  >
    {children}
  </Button>
);

export default AnimatedButton;
