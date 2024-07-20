import { Theme, createTheme } from '@mui/material/styles';

import { getContrastColor } from 'src/utils/colorUtils';

export function createDynamicTheme(colorCode: string): Theme {
  const contrastColor = getContrastColor(colorCode);
  const isLightColor = contrastColor === '#000000';

  return createTheme({
    palette: {
      primary: {
        main: colorCode,
        contrastText: contrastColor,
      },
      background: {
        default: isLightColor ? '#ffffff' : '#121212',
        paper: isLightColor ? '#f5f5f5' : '#1e1e1e',
      },
      text: {
        primary: isLightColor ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: isLightColor ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: colorCode,
            color: contrastColor,
            '&:hover': {
              backgroundColor: isLightColor
                ? `rgba(${parseInt(colorCode.slice(1, 3), 16)}, ${parseInt(colorCode.slice(3, 5), 16)}, ${parseInt(colorCode.slice(5, 7), 16)}, 0.8)`
                : `rgba(${parseInt(colorCode.slice(1, 3), 16)}, ${parseInt(colorCode.slice(3, 5), 16)}, ${parseInt(colorCode.slice(5, 7), 16)}, 1.2)`,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colorCode,
            color: contrastColor,
          },
        },
      },
    },
  });
}
