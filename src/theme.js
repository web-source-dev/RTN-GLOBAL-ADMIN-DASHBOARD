import { createTheme } from '@mui/material/styles';

// Design tokens for light and dark mode
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: {
            main: '#0052CC',
            light: '#4C9AFF',
            dark: '#0747A6',
          },
          secondary: {
            main: '#6554C0',
            light: '#8777D9',
            dark: '#5243AA',
          },
          background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
            alternate: '#F4F5F7',
          },
          text: {
            primary: '#172B4D',
            secondary: '#505F79',
          },
        }
      : {
          // Dark mode
          primary: {
            main: '#4C9AFF',
            light: '#B3D4FF',
            dark: '#0052CC',
          },
          secondary: {
            main: '#8777D9',
            light: '#C0B6F2',
            dark: '#6554C0',
          },
          background: {
            default: '#0D1117',
            paper: '#161B22',
            alternate: '#21262D',
          },
          text: {
            primary: '#F0F6FC',
            secondary: '#C9D1D9',
          },
        }),
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: mode === 'light' 
            ? '0 2px 4px rgba(0, 0, 0, 0.1)'
            : '0 2px 4px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          color: mode === 'light' ? '#1a1a1a' : '#ffffff',
        },
      },
    },
  },
});

const theme = getDesignTokens('light');

export default theme;
