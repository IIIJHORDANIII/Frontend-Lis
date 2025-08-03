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
  Fade,
  useTheme,
  alpha
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
import { Product, ProductWithQuantity } from '../types';
import { useAuth } from '../contexts/AuthContext';

type User = {
  _id: string;
  email: string;
};

type ProductWithQuantityState = {
  productId: string;
  quantity: number;
  product: Product;
};

const CustomListForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProductsWithQuantity, setSelectedProductsWithQuantity] = useState<ProductWithQuantityState[]>([]);
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

    if (selectedProductsWithQuantity.length === 0) {
      setError('Por favor, selecione pelo menos um produto');
      setLoading(false);
      return;
    }

    try {
      const response = await createCustomList(
        name.trim(),
        selectedProductsWithQuantity.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        selectedUsers.map(user => user._id),
        isPublic,
        description.trim()
      );

      setSuccess('Lista criada com sucesso!');
      setName('');
      setDescription('');
      setSelectedProductsWithQuantity([]);
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
          <CircularProgress size={60} sx={{ color: theme.customColors.text.primary }} />
        </Box>
      </Container>
    );
  }

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
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            background: theme.customColors.surface.card,
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${theme.customColors.border.primary}`,
            boxShadow: theme.customColors.shadow.primary,
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: { xs: 60, sm: 70, md: 80 },
                height: { xs: 60, sm: 70, md: 80 },
                margin: '0 auto 16px',
                background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
                color: theme.customColors.text.inverse,
                boxShadow: theme.customColors.shadow.secondary
              }}
            >
              <ListIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 } }} />
            </Avatar>
            <Typography
              variant="h3"
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
              Nova Lista
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.customColors.text.secondary,
                mb: 2,
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
              Crie uma lista personalizada com produtos selecionados
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

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 4,
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

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Nome da Lista */}
            <TextField
              fullWidth
              label="Nome da Lista"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ListIcon sx={{ color: theme.customColors.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
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
                '& .MuiInputBase-input': {
                  color: theme.customColors.text.primary,
                },
              }}
            />

            {/* Descrição */}
            <TextField
              fullWidth
              label="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon sx={{ color: theme.customColors.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
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
                '& .MuiInputBase-input': {
                  color: theme.customColors.text.primary,
                },
              }}
            />

            {/* Seleção de Produtos */}
            <Autocomplete
              multiple
              options={products}
              getOptionLabel={(option) => `${option.name} - ${formatPrice(option.finalPrice || 0)}`}
              value={products.filter(product => selectedProductsWithQuantity.some(item => item.productId === product._id))}
              onChange={(_, newValue) => {
                const newSelectedProducts = newValue.map(product => ({
                  productId: product._id,
                  quantity: 1,
                  product: product
                }));
                setSelectedProductsWithQuantity(newSelectedProducts);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecionar Produtos"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon sx={{ color: theme.customColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {option.image && (
                      <Avatar
                        src={option.image}
                        sx={{ width: 40, height: 40 }}
                      />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: theme.customColors.text.primary, fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.customColors.text.secondary }}>
                        {formatPrice(option.finalPrice || 0)} - {option.category}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option._id}
                    label={option.name}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                      color: theme.customColors.primary.main,
                      '& .MuiChip-deleteIcon': {
                        color: theme.customColors.primary.main,
                        '&:hover': {
                          color: theme.customColors.status.error,
                        },
                      },
                    }}
                  />
                ))
              }
            />

            {/* Produtos Selecionados com Quantidades */}
            {selectedProductsWithQuantity.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.customColors.text.primary,
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 20 }} />
                  Produtos Selecionados
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedProductsWithQuantity.map((item, index) => (
                    <Paper
                      key={item.productId}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.customColors.border.primary}`,
                        backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {item.product.image && (
                          <Avatar
                            src={item.product.image}
                            sx={{ width: 50, height: 50 }}
                          />
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: theme.customColors.text.primary,
                              fontWeight: 600,
                              mb: 0.5
                            }}
                          >
                            {item.product.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.customColors.text.secondary,
                              mb: 1
                            }}
                          >
                            {formatPrice(item.product.finalPrice || 0)} - Estoque: {item.product.quantity || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              if (item.quantity > 1) {
                                const updated = [...selectedProductsWithQuantity];
                                updated[index].quantity = item.quantity - 1;
                                setSelectedProductsWithQuantity(updated);
                              }
                            }}
                            sx={{
                              minWidth: 40,
                              height: 40,
                              borderRadius: 2,
                              borderColor: theme.customColors.primary.main,
                              color: theme.customColors.primary.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                              },
                            }}
                          >
                            -
                          </Button>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = Math.max(1, Math.min(parseInt(e.target.value) || 1, item.product.quantity || 1));
                              const updated = [...selectedProductsWithQuantity];
                              updated[index].quantity = newQuantity;
                              setSelectedProductsWithQuantity(updated);
                            }}
                            inputProps={{
                              min: 1,
                              max: item.product.quantity || 1,
                              style: { textAlign: 'center' }
                            }}
                            sx={{
                              width: 80,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& input': {
                                  textAlign: 'center',
                                  fontWeight: 600,
                                  color: theme.customColors.text.primary,
                                },
                              },
                            }}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              if (item.quantity < (item.product.quantity || 1)) {
                                const updated = [...selectedProductsWithQuantity];
                                updated[index].quantity = item.quantity + 1;
                                setSelectedProductsWithQuantity(updated);
                              }
                            }}
                            sx={{
                              minWidth: 40,
                              height: 40,
                              borderRadius: 2,
                              borderColor: theme.customColors.primary.main,
                              color: theme.customColors.primary.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                              },
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {/* Compartilhamento com Usuários */}
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.email}
              value={selectedUsers}
              onChange={(_, newValue) => setSelectedUsers(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Compartilhar com Usuários (opcional)"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon sx={{ color: theme.customColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option._id}
                    label={option.email}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                      color: theme.customColors.primary.main,
                      '& .MuiChip-deleteIcon': {
                        color: theme.customColors.primary.main,
                        '&:hover': {
                          color: theme.customColors.status.error,
                        },
                      },
                    }}
                  />
                ))
              }
            />

            {/* Visibilidade */}
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.customColors.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.customColors.primary.main, 0.08),
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.customColors.primary.main,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PublicIcon sx={{ fontSize: 20, color: theme.customColors.text.secondary }} />
                  <Typography sx={{ color: theme.customColors.text.primary }}>
                    Lista Pública
                  </Typography>
                </Box>
              }
            />

            {/* Botões */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/custom-lists')}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  borderColor: theme.customColors.text.primary,
                  color: theme.customColors.text.primary,
                  '&:hover': {
                    borderColor: theme.customColors.primary.main,
                    color: theme.customColors.primary.main,
                    backgroundColor: alpha(theme.customColors.primary.main, 0.05),
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
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
                    background: alpha(theme.customColors.text.primary, 0.12),
                    color: alpha(theme.customColors.text.primary, 0.38),
                    transform: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? 'Criando...' : 'Criar Lista'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomListForm;