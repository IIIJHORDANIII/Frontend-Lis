import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Card,
  CardContent,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getProducts, getAllUsers, getCustomListById, updateCustomList } from '../services/api';
import { Product, CustomList } from '../types';
import { useAuth } from '../contexts/AuthContext';

type User = {
  _id: string;
  email: string;
};

const EditListForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
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
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setDataLoading(true);
        if (!id) {
          setError('ID da lista não fornecido');
          return;
        }

        const [listData, productsData, usersData] = await Promise.all([
          getCustomListById(id),
          getProducts(),
          getAllUsers()
        ]);

        // Carregar dados da lista
        setName(listData.name);
        setDescription(listData.description || '');
        setIsPublic(listData.isPublic);
        setSelectedProducts(listData.products.map((p: Product) => p._id));
        setSelectedUsers(listData.sharedWith || []);

        // Carregar todos os produtos disponíveis
        setProducts(productsData);
        setUsers(usersData);
        
        // Produtos disponíveis para adicionar (não estão na lista)
        const currentProductIds = listData.products.map((p: Product) => p._id);
        setAvailableProducts(productsData.filter(p => !currentProductIds.includes(p._id)));
      } catch (err) {
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, navigate, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isAuthenticated) {
      setError('Você precisa estar logado para editar uma lista');
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
      const listData = {
        name: name.trim(),
        description: description.trim(),
        products: selectedProducts,
        sharedWith: selectedUsers.map(user => user._id),
        isPublic
      };

      await updateCustomList(id!, listData);
      setSuccess('Lista atualizada com sucesso!');
      setTimeout(() => {
        navigate('/admin/stock-lists');
      }, 2000);
    } catch (err) {
      setError('Erro ao atualizar lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(id => id !== productId));
    // Adicionar produto de volta aos disponíveis
    const product = products.find(p => p._id === productId);
    if (product) {
      setAvailableProducts(prev => [...prev, product]);
    }
  };

  const handleAddProduct = (productId: string) => {
    setSelectedProducts(prev => [...prev, productId]);
    // Remover produto dos disponíveis
    setAvailableProducts(prev => prev.filter(p => p._id !== productId));
    setAddProductDialogOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getSelectedProductsData = () => {
    return products.filter(product => selectedProducts.includes(product._id));
  };

  if (dataLoading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.customColors.background.default,
      }}>
        <CircularProgress sx={{ color: theme.customColors.text.primary }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        width: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'Poppins, Inter, Montserrat, Arial',
        background: theme.customColors.background.gradient,
      }}
    >
      {/* Subtle Gradient Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.customColors.background.gradient,
          zIndex: -1,
        }}
      />

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
              Editar Lista
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
              Modifique os detalhes da sua lista personalizada
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
              multiline
              rows={3}
              variant="outlined"
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
                <Typography sx={{ color: theme.customColors.text.primary }}>
                  Lista Pública
                </Typography>
              }
            />

            {/* Produtos Selecionados */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.customColors.text.primary,
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Produtos na Lista ({selectedProducts.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setAddProductDialogOpen(true)}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    border: `2px dashed ${alpha(theme.customColors.primary.main, 0.3)}`,
                    color: theme.customColors.primary.main,
                    backgroundColor: alpha(theme.customColors.primary.main, 0.05),
                    '&:hover': {
                      borderColor: theme.customColors.primary.main,
                      backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                    },
                  }}
                >
                  Adicionar Produto
                </Button>
              </Box>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                },
                gap: 2,
              }}>
                {getSelectedProductsData().map((product) => (
                  <Card
                    key={product._id}
                    sx={{
                      background: alpha(theme.customColors.text.primary, 0.02),
                      border: `1px solid ${theme.customColors.border.primary}`,
                      borderRadius: 3,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customColors.shadow.secondary,
                      },
                    }}
                  >
                    {product.image && (
                      <CardMedia
                        component="img"
                        height={120}
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: theme.customColors.text.primary,
                          mb: 1,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.customColors.text.secondary,
                          mb: 1,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: theme.customColors.status.success,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        {formatPrice(product.finalPrice)}
                      </Typography>
                    </CardContent>
                    <IconButton
                      onClick={() => handleRemoveProduct(product._id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: alpha(theme.customColors.status.error, 0.1),
                        color: theme.customColors.status.error,
                        '&:hover': {
                          backgroundColor: alpha(theme.customColors.status.error, 0.2),
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Botões */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/admin/stock-lists')}
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Dialog para adicionar produtos */}
      <Dialog
        open={addProductDialogOpen}
        onClose={() => setAddProductDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: theme.customColors.surface.card,
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${theme.customColors.border.primary}`,
            boxShadow: theme.customColors.shadow.primary,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.customColors.text.primary, fontWeight: 600 }}>
          Adicionar Produtos
        </DialogTitle>
        <DialogContent>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 2,
          }}>
            {availableProducts.map((product) => (
              <Card
                key={product._id}
                sx={{
                  background: alpha(theme.customColors.text.primary, 0.02),
                  border: `1px solid ${theme.customColors.border.primary}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.customColors.shadow.secondary,
                    borderColor: theme.customColors.primary.main,
                  },
                }}
                onClick={() => handleAddProduct(product._id)}
              >
                {product.image && (
                  <CardMedia
                    component="img"
                    height={120}
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: theme.customColors.text.primary,
                      mb: 1,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.customColors.text.secondary,
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.customColors.status.success,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {formatPrice(product.finalPrice)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setAddProductDialogOpen(false)}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              color: theme.customColors.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.customColors.text.primary, 0.05),
              },
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditListForm;