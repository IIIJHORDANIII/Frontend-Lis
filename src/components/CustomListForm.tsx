import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Autocomplete,
  ListItemText,
  Alert,
  Paper,
  Avatar,
  InputAdornment,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  List as ListIcon,
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { getProducts, getAllUsers, createCustomList } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

type User = {
  _id: string;
  email: string;
};

const CustomListForm: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setDataLoading(true);
        const [productsData, usersData] = await Promise.all([
          getProducts(),
          getAllUsers()
        ]);
        setProducts(productsData);
        setUsers(usersData);
      } catch (err) {
        setError('Falha ao carregar dados. Por favor, tente novamente.');
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isAuthenticated) {
      setError('Você precisa estar logado para criar uma lista');
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError('Por favor, digite um nome para a lista');
      setLoading(false);
      return;
    }

    if (selectedProducts.length === 0) {
      setError('Por favor, selecione pelo menos um produto');
      setLoading(false);
      return;
    }

    try {
      const response = await createCustomList(
        name.trim(),
        selectedProducts,
        selectedUsers.map(user => user._id),
        isPublic,
        description.trim()
      );

      setSuccess('Lista criada com sucesso!');
      setName('');
      setDescription('');
      setSelectedProducts([]);
      setSelectedUsers([]);
      setIsPublic(false);
      
      // Redirecionar para a lista de listas após 2 segundos
      setTimeout(() => {
        navigate('/custom-lists');
      }, 2000);
    } catch (err) {
      setError('Falha ao criar lista. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (dataLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            background: '#2d3748',
            borderRadius: 4,
            p: 4,
            mb: 4,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(217,217,217,0.1)',
              backdropFilter: 'blur(10px)'
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(217,217,217,0.2)',
                width: 64,
                height: 64
              }}
            >
              <ListIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Criar Nova Lista
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Organize seus produtos em listas personalizadas
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 4,
            background: 'rgba(217,217,217,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(217,217,217,0.2)',
            boxShadow: '0 8px 32px rgba(56,58,41,0.1)'
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
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
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gap: 3
              }}
            >
              <TextField
                fullWidth
                label="Nome da Lista"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ListIcon sx={{ color: '#383A29' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(56,58,41,0.1)'
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(56,58,41,0.3)'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#383A29'
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#383A29'
                  }
                }}
              />

              <TextField
                fullWidth
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <DescriptionIcon sx={{ color: '#383A29' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(56,58,41,0.1)'
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(56,58,41,0.3)'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#383A29'
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#383A29'
                  }
                }}
              />

              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: '#383A29' } }}>Produtos</InputLabel>
                <Select
                  multiple
                  value={selectedProducts}
                  onChange={(e) => setSelectedProducts(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const product = products.find(p => p._id === value);
                        return (
                          <Chip
                            key={value}
                            label={product ? `${product.name} - ${formatPrice(product.price)}` : value}
                            size="small"
                            sx={{
                              background: 'linear-gradient(45deg, #383A29, #4a4d35)',
                              color: '#d9d9d9',
                              '& .MuiChip-deleteIcon': {
                                color: 'rgba(217,217,217,0.8)'
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: 2
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#383A29'
                    }
                  }}
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f5f5f5',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const icon = document.createElement('div');
                                  icon.innerHTML = '🖼️';
                                  icon.style.fontSize = '16px';
                                  parent.appendChild(icon);
                                }
                              }}
                            />
                          ) : (
                            <ImageIcon sx={{ fontSize: 16, color: '#999' }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatPrice(product.price)}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.email}
                value={selectedUsers}
                onChange={(_, newValue) => setSelectedUsers(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Compartilhar com usuários"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleIcon sx={{ color: '#383A29' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56,58,41,0.1)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56,58,41,0.3)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#383A29'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#383A29'
                      }
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.email}
                      {...getTagProps({ index })}
                      key={option._id}
                      sx={{
                        background: 'linear-gradient(45deg, #383A29, #4a4d35)',
                        color: '#d9d9d9',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(217,217,217,0.8)'
                        }
                      }}
                    />
                  ))
                }
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, rgba(56,58,41, 0.1), rgba(74,77,53, 0.1))',
                  border: '1px solid rgba(56,58,41, 0.2)'
                }}
              >
                <PublicIcon sx={{ color: '#383A29' }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#383A29'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#383A29'
                        }
                      }}
                    />
                  }
                  label="Tornar lista pública"
                  sx={{ 
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 500,
                      color: '#383A29'
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/custom-lists')}
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  borderColor: '#383A29',
                  color: '#383A29',
                  '&:hover': {
                    borderColor: '#4a4d35',
                    backgroundColor: 'rgba(56,58,41, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(56,58,41, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!name.trim() || selectedProducts.length === 0 || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #383A29, #4a4d35)',
                  color: '#d9d9d9',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4a4d35, #5a5f42)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(56,58,41, 0.4)'
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.12)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Criando...' : 'Criar Lista'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CustomListForm;