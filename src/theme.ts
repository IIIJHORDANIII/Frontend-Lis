import { createTheme } from '@mui/material';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2d3748',
      light: '#4a5568',
      dark: '#1a202c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#718096',
      light: '#a0aec0',
      dark: '#4a5568',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7fafc',
      paper: 'rgba(255,255,255,0.9)',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
    grey: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      marginBottom: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontWeight: 800,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      marginBottom: '1rem',
      '@media (min-width:600px)': {
        fontSize: '2.25rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      marginBottom: '0.875rem',
      '@media (min-width:960px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      marginBottom: '0.75rem',
      '@media (min-width:960px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      marginBottom: '0.625rem',
      '@media (min-width:960px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      marginBottom: '0.5rem',
      '@media (min-width:960px)': {
        fontSize: '1.25rem',
      },
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      marginBottom: '0.5rem',
      fontWeight: 400,
      '@media (min-width:960px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      marginBottom: '0.375rem',
      fontWeight: 400,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.025em',
      fontSize: '0.875rem',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.875rem',
          minHeight: '48px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 16px rgba(45, 55, 72, 0.15)',
          '@media (max-width:600px)': {
            padding: '10px 20px',
            fontSize: '0.8125rem',
            minHeight: '44px',
          },
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 8px 25px rgba(45, 55, 72, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #4a5568 0%, #2d3748 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#2d3748',
          color: '#2d3748',
          '&:hover': {
            borderWidth: '2px',
            background: 'rgba(45, 55, 72, 0.04)',
          },
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
          minHeight: '56px',
          '@media (max-width:600px)': {
            padding: '14px 28px',
            fontSize: '0.9375rem',
            minHeight: '52px',
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.75rem',
          minHeight: '40px',
          '@media (max-width:600px)': {
            padding: '6px 12px',
            fontSize: '0.6875rem',
            minHeight: '36px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '24px',
          '@media (max-width:600px)': {
            marginBottom: '20px',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            minHeight: '56px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media (max-width:600px)': {
              minHeight: '52px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2d3748',
              boxShadow: '0 0 0 2px rgba(45,55,72,0.10)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2d3748',
              boxShadow: '0 0 0 2px rgba(45,55,72,0.15)',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              borderColor: '#2d3748',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            zIndex: 1,
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#4a5568',
            background: 'transparent',
            zIndex: 2,
            padding: '0 4px',
            position: 'relative',
            '@media (max-width:600px)': {
              fontSize: '0.8125rem',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            padding: '16px 14px',
            color: '#2d3748',
            '@media (max-width:600px)': {
              fontSize: '0.8125rem',
              padding: '14px 12px',
            },
          },
          '& .MuiInputAdornment-root': {
            marginRight: '8px',
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.3)',
          width: '280px',
          '@media (min-width:600px)': {
            width: '320px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 16,
          margin: '16px',
          maxWidth: 'calc(100vw - 32px)',
          width: 'calc(100vw - 32px)',
          '@media (min-width:600px)': {
            margin: '24px',
            maxWidth: '600px',
            width: 'auto',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 12,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.3)',
          overflowX: 'auto',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(45, 55, 72, 0.1)',
          padding: '16px',
          fontSize: '0.875rem',
          '@media (max-width:600px)': {
            padding: '12px 8px',
            fontSize: '0.8125rem',
          },
        },
        head: {
          fontWeight: 700,
          color: '#2d3748',
          background: 'rgba(45, 55, 72, 0.02)',
          fontSize: '0.875rem',
          '@media (max-width:600px)': {
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          background: 'rgba(45, 55, 72, 0.08)',
          color: '#2d3748',
          fontSize: '0.75rem',
          '@media (max-width:600px)': {
            fontSize: '0.6875rem',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width:600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '&.MuiGrid-container': {
            margin: '-8px',
            '@media (min-width:600px)': {
              margin: '-12px',
            },
          },
          '&.MuiGrid-item': {
            padding: '8px',
            '@media (min-width:600px)': {
              padding: '12px',
            },
          },
        },
      },
    },
  },
});

export default theme; 