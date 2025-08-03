import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Container,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props & { navigate: (path: string) => void }, State> {
  constructor(props: Props & { navigate: (path: string) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    this.props.navigate('/');
    this.handleRetry();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback 
        error={this.state.error} 
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
  onGoHome: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRetry, onGoHome }) => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          animation: 'fadeIn 0.6s ease-out',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 600,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'bounceIn 0.8s ease-out',
              }}
            >
              <ErrorIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  animation: 'slideInFromLeft 0.6s ease-out',
                }}
              >
                Ops! Algo deu errado
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  animation: 'slideInFromRight 0.6s ease-out 0.1s both',
                }}
              >
                Encontramos um problema inesperado. Não se preocupe, nossa equipe foi notificada.
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mb: 3,
                  animation: 'scaleIn 0.6s ease-out 0.2s both',
                }}
              >
                <AlertTitle>Detalhes do erro</AlertTitle>
                {error.message || 'Erro desconhecido'}
              </Alert>
            )}

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
                animation: 'fadeIn 0.6s ease-out 0.3s both',
              }}
            >
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={onRetry}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Tentar Novamente
              </Button>

              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={onGoHome}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Ir para o Início
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                mt: 2,
                animation: 'fadeIn 0.6s ease-out 0.4s both',
              }}
            >
              Se o problema persistir, entre em contato com o suporte
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

// Wrapper component to provide navigation
const ErrorBoundaryWrapper: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  return <ErrorBoundary {...props} navigate={navigate} />;
};

export default ErrorBoundaryWrapper; 