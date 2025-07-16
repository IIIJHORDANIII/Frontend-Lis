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
  Fade,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
  Stack,
  Grid
} from '@mui/material';
import {
  Person,
  Email,
  Badge,
  Lock,
  PersonAdd
} from '@mui/icons-material';
import { register } from '../services/api';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validate CPF format (basic validation)
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(formData.cpf.replace(/\D/g, ''))) {
      setError('CPF inválido. Digite apenas os números.');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.cpf, formData.password);
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Falha ao registrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        fontFamily: 'Poppins, Inter, Montserrat, Arial',
        background: 'transparent',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 15s ease-in-out infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Box sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 600, md: 700, lg: 800 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Fade in>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: { xs: 3, sm: 4, md: 5, lg: 6 },
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
              }
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: '0 8px 32px rgba(56, 58, 41, 0.3)'
                }}
              >
                <PersonAdd sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 1,
                  fontSize: { xs: '1.3rem', sm: '1.7rem', md: '2.5rem' },
                  '@media (min-width: 1600px)': {
                    fontSize: '2.75rem',
                  },
                  '@media (min-width: 1920px)': {
                    fontSize: '3rem',
                  },
                }}
              >
                Nova Vendedora
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary,
                mb: 2,
                fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                '@media (min-width: 1600px)': {
                  fontSize: '1.25rem',
                },
                '@media (min-width: 1920px)': {
                  fontSize: '1.35rem',
                },
              }}>
                Preencha os dados para criar uma nova conta
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  borderRadius: 2,
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
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    required
                    id="name"
                    label="Nome Completo*"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    required
                    id="cpf"
                    label="CPF*"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="00000000000"
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    required
                    id="email"
                    label="Email*"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    required
                    name="confirmPassword"
                    label="Confirmar Senha*"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    },
                    '&:disabled': {
                      background: theme.palette.grey[300],
                      color: theme.palette.grey[500]
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Register;