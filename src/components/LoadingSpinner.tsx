import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  size = 'medium',
  fullScreen = false,
  variant = 'spinner'
}) => {
  const theme = useTheme();

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60
  };



  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: theme.palette.text.primary,
                fontWeight: 600,
                animation: 'loadingDots 1.4s infinite',
                '&::after': {
                  content: '"..."',
                  animation: 'loadingDots 1.4s infinite',
                }
              }}
            >
              {message}
            </Typography>
          </Box>
        );

      case 'pulse':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: sizeMap[size],
                height: sizeMap[size],
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                animation: 'pulse 1.5s ease-in-out infinite',
                margin: '0 auto 16px',
              }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {message}
            </Typography>
          </Box>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress
              size={sizeMap[size]}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
                marginBottom: 2,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500,
                animation: 'fadeIn 0.6s ease-out',
              }}
            >
              {message}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out',
        ...(fullScreen ? {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.modal + 1,
          background: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(8px)',
        } : {
          minHeight: 200,
        }),
      }}
    >
      {renderSpinner()}
    </Box>
  );
};

export default LoadingSpinner; 