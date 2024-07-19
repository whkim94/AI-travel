'use client';

import { useState, ReactNode, useEffect } from 'react';

import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';

import { createDynamicTheme } from './createDynamicTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState(createDynamicTheme('#1976d2')); // Default color

  useEffect(() => {
    const handleColorChange = (event: CustomEvent) => {
      setTheme(createDynamicTheme(event.detail));
    };

    window.addEventListener('colorChange' as any, handleColorChange);

    return () => {
      window.removeEventListener('colorChange' as any, handleColorChange);
    };
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
