import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  InputAdornment,
  Avatar,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  AdminPanelSettings,
  Email,
  Lock
} from '@mui/icons-material';
import { createAdmin } from '../services/api';

const CreateAdmin: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    cpf: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await createAdmin(formData.email, formData.password);
      setSuccess('Usuário admin criado com sucesso!');
      setFormData({ email: '', password: '', fullName: '', cpf: '', confirmPassword: '' });
    } catch (err) {
      setError('Falha ao criar usuário admin');
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
        background: theme.customColors.background.gradient,
      }}
    >
      <Box sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 500, md: 600 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              width: '100%',
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: theme.customColors.surface.card,
              backdropFilter: 'blur(20px)',
              boxShadow: theme.customColors.shadow.primary,
              border: `1.5px solid ${theme.customColors.border.primary}`,
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 16px',
                  background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
                  color: theme.customColors.text.inverse,
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  color: theme.customColors.text.primary,
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem', xl: '2.5rem' },
                  lineHeight: 1.2,
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
              <Typography 
                variant="body1" 
                sx={{
                  color: theme.customColors.text.secondary,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.375rem' },
                  lineHeight: 1.4,
                  '@media (min-width: 1600px)': {
                    fontSize: '1.5rem',
                  },
                  '@media (min-width: 1920px)': {
                    fontSize: '1.625rem',
                  },
                }}
              >
                Preencha os dados para criar uma nova conta
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
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
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  background: alpha(theme.customColors.status.success, 0.1),
                  border: `1px solid ${alpha(theme.customColors.status.success, 0.3)}`,
                  color: theme.customColors.status.success,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="Nome Completo*"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettings sx={{ color: theme.customColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      transition: 'all 0.3s ease',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                        borderWidth: 2,
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.customColors.text.secondary,
                      '&.Mui-focused': {
                        color: theme.customColors.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="CPF*"
                  name="cpf"
                  value={formData.cpf || '00000000000'}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettings sx={{ color: theme.customColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      transition: 'all 0.3s ease',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                        borderWidth: 2,
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.customColors.text.secondary,
                      '&.Mui-focused': {
                        color: theme.customColors.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Email*"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: theme.customColors.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                    transition: 'all 0.3s ease',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.customColors.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.customColors.primary.main,
                      borderWidth: 2,
                    },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.customColors.shadow.secondary,
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.customColors.shadow.secondary,
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.customColors.text.secondary,
                    '&.Mui-focused': {
                      color: theme.customColors.primary.main,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme.customColors.text.primary,
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="Senha*"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.customColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      transition: 'all 0.3s ease',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                        borderWidth: 2,
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.customColors.text.secondary,
                      '&.Mui-focused': {
                        color: theme.customColors.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirmar Senha*"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.customColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      transition: 'all 0.3s ease',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                        borderWidth: 2,
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.customColors.text.secondary,
                      '&.Mui-focused': {
                        color: theme.customColors.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
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
                {loading ? 'Criando...' : 'Criar Vendedora'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default CreateAdmin;