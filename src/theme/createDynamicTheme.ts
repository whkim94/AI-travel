import { createTheme, Theme } from '@mui/material/styles';

export function createDynamicTheme(colorCode: string): Theme {
  return createTheme({
    palette: {
      primary: {
        main: colorCode,
      },
      background: {
        default: `${colorCode}10`, // 10% opacity of the color code
        paper: '#ffffff',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: colorCode,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: `${colorCode}dd`, // Slightly darker on hover
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colorCode,
          },
        },
      },
    },
  });
}
