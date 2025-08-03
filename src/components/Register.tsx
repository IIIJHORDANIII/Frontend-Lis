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
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'Poppins, Inter, Montserrat, Arial',
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
              boxShadow: theme.customColors.shadow.primary,
              background: theme.customColors.surface.card,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.customColors.border.primary}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`
              }
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
                  color: theme.customColors.text.inverse,
                  boxShadow: theme.customColors.shadow.secondary
                }}
              >
                <PersonAdd sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  color: theme.customColors.text.primary,
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
              <Typography variant="body1" sx={{ 
                color: theme.customColors.text.secondary,
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
                  background: alpha(theme.customColors.status.error, 0.1),
                  border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
                  color: theme.customColors.status.error,
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
                          <Person sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
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
                          <Badge sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
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
                          <Email sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    required
                    id="password"
                    label="Senha*"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <TextField
                  required
                  id="confirmPassword"
                  label="Confirmar Senha*"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
                    color: theme.customColors.text.inverse,
                    boxShadow: theme.customColors.shadow.secondary,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: theme.customColors.shadow.primary,
                      background: `linear-gradient(135deg, ${theme.customColors.primary.light} 0%, ${theme.customColors.primary.main} 100%)`,
                    },
                    '&:disabled': {
                      background: alpha(theme.customColors.primary.main, 0.12),
                      color: alpha(theme.customColors.primary.main, 0.38),
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/login')}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    border: `2px solid ${alpha(theme.customColors.primary.main, 0.3)}`,
                    color: theme.customColors.primary.main,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: theme.customColors.primary.main,
                      backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Já tenho conta
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Register;