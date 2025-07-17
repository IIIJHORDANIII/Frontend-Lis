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
  alpha,
  Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getProducts, getAllUsers, getCustomListById, updateCustomList, addProductToList } from '../services/api';
import { Product, CustomList, ProductWithQuantity } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useModalOpacity } from '../hooks/useModalOpacity';

type User = {
  _id: string;
  email: string;
};

type ProductWithQuantityState = {
  productId: string;
  quantity: number;
  product: Product;
};

const DEFAULT_IMAGE = 'https://via.placeholder.com/150'; // Placeholder for default image

const EditListForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
        
        // Converter produtos da lista para o novo formato com quantidades
        // O backend agora retorna produtos no formato { productId, quantity, product }
        const productsWithQuantity = listData.products
          .filter((item: any) => {
            // Filtrar apenas itens que têm produto válido
            if (item.productId && item.quantity && item.product && item.product._id) {
              return true;
            }
            // Se o item é apenas um ID (formato antigo), verificar se o produto existe
            if (typeof item === 'string') {
              const product = productsData.find(prod => prod._id === item);
              return product !== undefined;
            }
            return false;
          })
          .map((item: any) => {
            // Se o item já tem a estrutura correta (novo formato)
            if (item.productId && item.quantity && item.product) {
              return {
                productId: item.productId,
                quantity: item.quantity,
                product: item.product
              };
            }
            // Se o item é apenas um ID (formato antigo)
            else if (typeof item === 'string') {
              const product = productsData.find(prod => prod._id === item);
              return {
                productId: item,
                quantity: 1, // Quantidade padrão para formato antigo
                product: product
              };
            }
            // Fallback para outros casos
            return {
              productId: item._id || item,
              quantity: item.quantity || 1,
              product: item.product || item
            };
          });
        setSelectedProductsWithQuantity(productsWithQuantity);
        setSelectedUsers(listData.sharedWith || []);

        // Carregar todos os produtos disponíveis
        setProducts(productsData);
        setUsers(usersData);
        
        // Produtos disponíveis para adicionar (não estão na lista)
        const currentProductIds = listData.products.map((item: any) => 
          typeof item === 'string' ? item : item.productId
        );
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

    if (selectedProductsWithQuantity.length === 0) {
      setError('Por favor, selecione pelo menos um produto');
      setLoading(false);
      return;
    }

    try {
      // TODO: O backend ainda não foi atualizado para suportar produtos com quantidades
      // Por enquanto, enviamos apenas os IDs dos produtos (estrutura antiga)
      const listData = {
        name: name.trim(),
        description: description.trim(),
        products: selectedProductsWithQuantity.map(item => item.productId), // Estrutura antiga
        sharedWith: selectedUsers.filter(user => user && user._id).map(user => user._id),
        isPublic
      };

      console.log('Dados sendo enviados para atualização:', listData);

      await updateCustomList(id!, listData);
      setSuccess('Lista atualizada com sucesso!');
      setTimeout(() => {
        navigate('/admin/stock-lists');
      }, 2000);
    } catch (err: any) {
      console.error('Erro detalhado:', err);
      const errorMessage = err.message || 'Erro ao atualizar lista. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProductsWithQuantity(prev => prev.filter(item => item.productId !== productId));
    // Adicionar produto de volta aos disponíveis
    const product = products.find(p => p._id === productId);
    if (product) {
      setAvailableProducts(prev => [...prev, product]);
    }
  };

  const [selectedProductForAdd, setSelectedProductForAdd] = useState<Product | null>(null);
  const [addQuantity, setAddQuantity] = useState(1);
  const [addQuantityDialogOpen, setAddQuantityDialogOpen] = useState(false);

  // Aplicar correção de opacidade dos modais
  useModalOpacity(addProductDialogOpen || addQuantityDialogOpen);

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setSelectedProductForAdd(product);
      setAddQuantity(1);
      setAddQuantityDialogOpen(true);
    }
  };

  const handleConfirmAddProduct = async () => {
    if (!selectedProductForAdd || !id) return;
    
    try {
      setLoading(true);
      const updatedList = await addProductToList(id, selectedProductForAdd._id, addQuantity);
      
      // Atualizar a lista local com os dados retornados do backend
      setSelectedProductsWithQuantity(updatedList.products.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        product: item.product
      })));
      
      // Remover produto dos disponíveis
      setAvailableProducts(prev => prev.filter(p => p._id !== selectedProductForAdd._id));
      
      setSuccess('Produto adicionado com sucesso!');
    } catch (error) {
      setError('Erro ao adicionar produto à lista');
    } finally {
      setLoading(false);
      setAddQuantityDialogOpen(false);
      setSelectedProductForAdd(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getSelectedProductsData = () => {
    return selectedProductsWithQuantity.map(item => item.product);
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
                  Produtos na Lista ({selectedProductsWithQuantity.length})
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
                {selectedProductsWithQuantity.map((item, index) => {
                  // Skip rendering if product is undefined
                  if (!item.product) {
                    return null;
                  }
                  
                  return (
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
                        <Avatar
                          src={item.product.image || DEFAULT_IMAGE}
                          sx={{ width: 50, height: 50 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: theme.customColors.text.primary,
                              fontWeight: 600,
                              mb: 0.5
                            }}
                          >
                            {item.product.name || 'Produto não encontrado'}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.customColors.text.secondary,
                              mb: 1
                            }}
                          >
                            {formatPrice(item.product.finalPrice || 0)} - Estoque: {item.product.quantity ?? 0}
                          </Typography>
                        </Box>
                      {/* Controles de Quantidade */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
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
                            minWidth: 32,
                            height: 32,
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
                            width: 60,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& input': {
                                textAlign: 'center',
                                fontWeight: 600,
                                color: theme.customColors.text.primary,
                                fontSize: '0.875rem',
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
                            minWidth: 32,
                            height: 32,
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
                    <IconButton
                      onClick={() => handleRemoveProduct(item.productId)}
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
                  </Paper>
                );
                })}
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
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            border: `1.5px solid ${theme.customColors.border.primary}`,
            boxShadow: theme.customColors.shadow.primary,
            opacity: 1,
            '& .MuiDialogContent-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialogTitle-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialogActions-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
          },
        }}
        sx={{
          '& .MuiDialog-paper': {
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            backdropFilter: 'none !important',
          },
          '& .MuiBackdrop-root': {
            backdropFilter: 'none !important',
          }
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
                    width="100%"
                    image={product.image}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'cover',
                      aspectRatio: '3/5'
                    }}
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

      {/* Modal para escolher quantidade */}
      <Dialog
        open={addQuantityDialogOpen}
        onClose={() => setAddQuantityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            border: `1.5px solid ${theme.customColors.border.primary}`,
            boxShadow: theme.customColors.shadow.primary,
            opacity: 1,
            '& .MuiDialogContent-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialogTitle-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialogActions-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
          },
        }}
        sx={{
          '& .MuiDialog-paper': {
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            backdropFilter: 'none !important',
          },
          '& .MuiBackdrop-root': {
            backdropFilter: 'none !important',
          }
        }}
      >
        <DialogTitle sx={{ color: theme.customColors.text.primary, fontWeight: 600 }}>
          Escolher Quantidade
        </DialogTitle>
        <DialogContent>
          {selectedProductForAdd && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: theme.customColors.text.primary, mb: 1 }}>
                {selectedProductForAdd.name}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.customColors.text.secondary, mb: 2 }}>
                Estoque disponível: {selectedProductForAdd.quantity || 0}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setAddQuantity(Math.max(1, addQuantity - 1))}
                  disabled={addQuantity <= 1}
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
                  value={addQuantity}
                  onChange={(e) => {
                    const newQuantity = Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedProductForAdd.quantity || 1));
                    setAddQuantity(newQuantity);
                  }}
                  inputProps={{
                    min: 1,
                    max: selectedProductForAdd.quantity || 1,
                    style: { textAlign: 'center' }
                  }}
                  sx={{
                    width: 100,
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
                  onClick={() => setAddQuantity(Math.min(addQuantity + 1, selectedProductForAdd.quantity || 1))}
                  disabled={addQuantity >= (selectedProductForAdd.quantity || 1)}
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
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setAddQuantityDialogOpen(false)}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              color: theme.customColors.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.customColors.text.primary, 0.05),
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAddProduct}
            variant="contained"
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              background: theme.customColors.primary.main,
              '&:hover': {
                background: theme.customColors.primary.dark,
              },
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditListForm;