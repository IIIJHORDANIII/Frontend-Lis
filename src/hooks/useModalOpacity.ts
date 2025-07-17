import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

export const useModalOpacity = (isOpen: boolean) => {
  const theme = useTheme();

  useEffect(() => {
    if (isOpen) {
      const style = document.createElement('style');
      style.id = 'modal-opacity-fix';
      style.textContent = `
        .MuiDialog-paper {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
          backdrop-filter: none !important;
          opacity: 1 !important;
        }
        .MuiDialog-root .MuiDialog-paper {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiDialogContent-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiDialogTitle-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiDialogActions-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiCard-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiBackdrop-root {
          backdrop-filter: none !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('modal-opacity-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isOpen, theme.palette.mode]);
}; 