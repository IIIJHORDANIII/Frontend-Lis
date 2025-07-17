import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Container,
  Fade,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as apiLogin } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Redirecionamento automático para usuários já logados
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/products');
      } else {
        navigate('/sales');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiLogin(email, password);
      console.log('Login response:', response);
      if (response.token && response.user) {
        const userWithId = {
          ...response.user,
          id: response.user._id
        };
        console.log('User with ID:', userWithId);
        login(response.token, userWithId);
        if (userWithId.isAdmin) {
          navigate('/admin/products');
        } else {
          navigate('/sales');
        }
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (err) {
      setError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  // Não renderizar se estiver carregando ou se o usuário estiver logado
  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.customColors.background.gradient,
        backgroundSize: '200% 200%',
        animation: 'gradientMove 15s ease-in-out infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="sm" sx={{ p: 0 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5, lg: 6 },
              borderRadius: 4,
              boxShadow: theme.customColors.shadow.primary,
              background: theme.customColors.surface.card,
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${theme.customColors.border.primary}`,
              maxWidth: 500,
              mx: 'auto',
              width: '100%',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                component="img"
                src="/Logo Vector.png"
                alt="Lis System Logo"
                sx={{
                  height: { xs: 60, sm: 70, md: 80, lg: 90 },
                  width: 'auto',
                  maxWidth: { xs: 150, sm: 170, md: 190, lg: 210 },
                  objectFit: 'contain',
                  mb: 3,
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.customColors.text.primary,
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Bem-vindo de volta
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.customColors.text.secondary,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  lineHeight: 1.5,
                }}
              >
                Faça login para acessar sua conta
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  boxShadow: theme.customColors.shadow.secondary,
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.customColors.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.customColors.primary.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.customColors.text.secondary,
                    '&.Mui-focused': {
                      color: theme.customColors.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: theme.customColors.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.customColors.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.customColors.primary.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.customColors.text.secondary,
                    '&.Mui-focused': {
                      color: theme.customColors.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.customColors.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: theme.customColors.text.secondary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: { xs: 1.5, sm: 2, md: 2.5 },
                  px: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
                  color: theme.customColors.text.inverse,
                  boxShadow: theme.customColors.shadow.secondary,
                  border: `1px solid ${alpha(theme.customColors.text.inverse, 0.2)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: { xs: '48px', sm: '52px', md: '56px' },
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: theme.customColors.shadow.primary,
                    background: `linear-gradient(135deg, ${theme.customColors.primary.light} 0%, ${theme.customColors.primary.main} 100%)`,
                  },
                  '&:disabled': {
                    background: alpha(theme.customColors.text.primary, 0.12),
                    color: alpha(theme.customColors.text.primary, 0.38),
                    transform: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: theme.customColors.text.inverse }}
                  />
                ) : (
                  'Entrar'
                )}
              </Button>


            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;