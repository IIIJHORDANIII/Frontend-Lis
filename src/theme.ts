import { createTheme, ThemeOptions } from '@mui/material/styles';

// Light theme colors
const lightColors = {
  primary: {
    main: '#2d3748',
    light: '#4a5568',
    dark: '#1a202c',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#667eea',
    light: '#764ba2',
    dark: '#553c9a',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f7fafc',
    paper: '#ffffff',
    gradient: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
  },
  surface: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.97)',
    card: 'rgba(255, 255, 255, 0.97)',
    header: 'rgba(255, 255, 255, 0.95)',
  },
  text: {
    primary: '#2d3748',
    secondary: '#718096',
    disabled: '#a0aec0',
    inverse: '#ffffff',
  },
  border: {
    primary: 'rgba(102, 126, 234, 0.10)',
    secondary: 'rgba(255, 255, 255, 0.22)',
    header: 'rgba(255, 255, 255, 0.08)',
  },
  shadow: {
    primary: '0 12px 40px rgba(102, 126, 234, 0.12)',
    secondary: '0 8px 32px rgba(102, 126, 234, 0.10)',
    header: '0 4px 20px rgba(45, 55, 72, 0.12)',
    hover: '0 20px 60px rgba(102, 126, 234, 0.15)',
  },
  status: {
    success: '#38a169',
    warning: '#d69e2e',
    error: '#e53e3e',
    info: '#3182ce',
  },
  animation: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
};

// Dark theme colors
const darkColors = {
  primary: {
    main: '#667eea',
    light: '#764ba2',
    dark: '#553c9a',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#a0aec0',
    light: '#cbd5e0',
    dark: '#718096',
    contrastText: '#1a202c',
  },
  background: {
    default: '#1a202c',
    paper: '#2d3748',
    gradient: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
  },
  surface: {
    primary: '#2d3748',
    secondary: 'rgba(45, 55, 72, 0.97)',
    card: 'rgba(45, 55, 72, 0.97)',
    header: 'rgba(26, 32, 44, 0.95)',
  },
  text: {
    primary: '#f7fafc',
    secondary: '#a0aec0',
    disabled: '#718096',
    inverse: '#1a202c',
  },
  border: {
    primary: 'rgba(102, 126, 234, 0.20)',
    secondary: 'rgba(255, 255, 255, 0.12)',
    header: 'rgba(255, 255, 255, 0.08)',
  },
  shadow: {
    primary: '0 12px 40px rgba(0, 0, 0, 0.3)',
    secondary: '0 8px 32px rgba(0, 0, 0, 0.25)',
    header: '0 4px 20px rgba(0, 0, 0, 0.3)',
    hover: '0 20px 60px rgba(0, 0, 0, 0.4)',
  },
  status: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  animation: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
};

// Common theme configuration
const commonTheme = {
  typography: {
    fontFamily: '"Poppins", "Inter", "Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    body1: {
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            transform: 'scaleX(0)',
            transition: 'transform 0.3s ease',
          },
          '&:hover::before': {
            transform: 'scaleX(1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'dialogSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        root: {
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 16,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
};

// Create light theme
export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: lightColors.primary,
    secondary: lightColors.secondary,
    background: {
      default: lightColors.background.default,
      paper: lightColors.background.paper,
    },
    text: {
      primary: lightColors.text.primary,
      secondary: lightColors.text.secondary,
    },
    success: {
      main: lightColors.status.success,
    },
    warning: {
      main: lightColors.status.warning,
    },
    error: {
      main: lightColors.status.error,
    },
    info: {
      main: lightColors.status.info,
    },
  },
  customColors: lightColors,
} as ThemeOptions & { customColors: typeof lightColors });

// Create dark theme
export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: darkColors.primary,
    secondary: darkColors.secondary,
    background: {
      default: darkColors.background.default,
      paper: darkColors.background.paper,
    },
    text: {
      primary: darkColors.text.primary,
      secondary: darkColors.text.secondary,
    },
    success: {
      main: darkColors.status.success,
    },
    warning: {
      main: darkColors.status.warning,
    },
    error: {
      main: darkColors.status.error,
    },
    info: {
      main: darkColors.status.info,
    },
  },
  customColors: darkColors,
} as ThemeOptions & { customColors: typeof darkColors });

// Default theme (light)
export default lightTheme;

// Type definitions for custom colors
declare module '@mui/material/styles' {
  interface Theme {
    customColors: typeof lightColors;
  }
  interface ThemeOptions {
    customColors?: typeof lightColors;
  }
} 