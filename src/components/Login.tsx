import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  Avatar,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';
import { login } from '../services/api';
import { AuthResponse } from '../types';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      
      if (response.token && response.user) {
        const userWithId = {
          ...response.user,
          id: response.user._id
        };
        
        authLogin(response.token, userWithId);
        if (userWithId.isAdmin) {
          navigate('/admin/products');
        } else {
          navigate('/user-lists');
        }
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Falha no login');
      } else {
        setError('Falha no login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3 },
        position: 'relative',
        fontFamily: 'Poppins, Inter, Montserrat, Arial',
      }}
    >
      {/* Subtle Gradient Background */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 12s ease-in-out infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: 750,
              margin: '0 auto',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)'
              }
            }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 } }}>
              <Avatar
                sx={{
                  width: { xs: 60, sm: 70, md: 80 },
                  height: { xs: 60, sm: 70, md: 80 },
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(45, 55, 72, 0.3)'
                }}
              >
                <LoginIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 } }} />
              </Avatar>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{
                  fontWeight: 800,
                  color: '#2d3748',
                  mb: 1,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Bem-vindo
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#718096',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Faça login para continuar
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ 
                          color: '#4a5568',
                          fontSize: { xs: 18, sm: 20 },
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    },
                  }}
                />

                <TextField
                  required
                  id="password"
                  label="Senha"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ 
                          color: '#4a5568',
                          fontSize: { xs: 18, sm: 20 },
                        }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: '#4a5568',
                            '&:hover': {
                              backgroundColor: 'rgba(45, 55, 72, 0.1)',
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 700,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(45, 55, 72, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(45, 55, 72, 0.3)',
                      background: 'linear-gradient(90deg, #4a5568 0%, #2d3748 100%)',
                    },
                    '&:disabled': {
                      background: '#cbd5e0',
                      transform: 'none',
                      boxShadow: 'none',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress 
                      size={24} 
                      sx={{ color: '#fff' }} 
                    />
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ 
              textAlign: 'center', 
              mt: { xs: 3, sm: 4 },
              pt: { xs: 2, sm: 3 },
              borderTop: '1px solid rgba(45, 55, 72, 0.1)'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#718096',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                © {new Date().getFullYear()} Lis System. Todos os direitos reservados.
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;