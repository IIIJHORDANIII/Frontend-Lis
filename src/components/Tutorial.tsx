import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  alpha,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  SkipNext as SkipIcon,
  Check as CheckIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

interface TutorialStep {
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps: TutorialStep[];
  title?: string;
}

const Tutorial: React.FC<TutorialProps> = ({
  isOpen,
  onClose,
  onComplete,
  steps,
  title = 'Bem-vindo ao LIS MODAS!'
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setCompleted(new Set());
    }
  }, [isOpen]);

  const handleNext = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    if (activeStep === steps.length - 1) {
      onComplete();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.zIndex.modal + 1000,
        background: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 600,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'hidden',
          borderRadius: 1,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.divider}`,
          animation: 'dialogSlideIn 0.3s ease-out',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
              }}
            >
              <HelpIcon sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {activeStep + 1} de {steps.length} passos
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleSkip}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              <SkipIcon />
            </IconButton>
            <IconButton
              onClick={onClose}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.error.main,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: '60vh', overflow: 'auto' }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index} completed={completed.has(index)}>
                <StepLabel
                  onClick={() => handleStepClick(index)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {step.title}
                    </Typography>
                    {completed.has(index) && (
                      <CheckIcon 
                        sx={{ 
                          color: theme.palette.success.main,
                          fontSize: 16,
                        }} 
                      />
                    )}
                  </Box>
                </StepLabel>
                <StepContent>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
                  </Typography>
                  
                  {step.target && (
                    <Chip
                      label={`Destacar: ${step.target}`}
                      size="small"
                      sx={{
                        background: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            Anterior
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              borderRadius: 1,
              px: 4,
              py: 1,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
            }}
          >
            {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Tutorial; 