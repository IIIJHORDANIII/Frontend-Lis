import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Chip,
  Badge,
  Tooltip,
  Fade,
  useTheme,
  alpha,
  Stack,
  Divider,
  Paper,
  useMediaQuery,
  Input,
  Snackbar
} from '@mui/material';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as CommissionIcon,
  Inventory as StockIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  AccountBalance as ProfitIcon,
  CloudUpload as UploadIcon,
  Delete as RemoveIcon
} from '@mui/icons-material';
import { getProducts, deleteProduct, updateProduct, updateProductWithImage } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useModalOpacity } from '../hooks/useModalOpacity';

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [editError, setEditError] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    costPrice: '',
    image: ''
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Aplicar correção de opacidade dos modais
  useModalOpacity(deleteModalOpen || editModalOpen);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      
      const processedProducts = data.map(product => {
        return {
          ...product,
          image: product.image || DEFAULT_IMAGE
        };
      });
      
      setProducts(processedProducts);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [isAuthenticated, navigate]);

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct._id);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
      await loadProducts();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setDeleteError(err.response?.data?.error || 'Failed to delete product. Please try again.');
      } else {
        setDeleteError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedProduct(null);
    setDeleteError('');
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      costPrice: product.costPrice?.toString() || '',
      image: product.image
    });
    setEditingProductId(product._id);
    setEditModalOpen(true);
    setEditError('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setEditError('A imagem deve ter no máximo 5MB');
        return;
      }
      
      // Validar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        setEditError('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      setSelectedImage(file);
      setEditError(''); // Limpar erro anterior
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setEditFormData({
      ...editFormData,
      image: ''
    });
  };

  const handleEditSubmit = async () => {
    if (!editingProductId) return;

    try {
      setUploading(true);
      setEditError('');

      if (selectedImage) {
        // Upload com imagem
        const formData = new FormData();
        formData.append('name', editFormData.name);
        formData.append('description', editFormData.description);
        formData.append('costPrice', editFormData.costPrice);
        formData.append('quantity', (selectedProduct?.quantity ?? 0).toString());
        formData.append('image', selectedImage);

        await updateProductWithImage(editingProductId, formData);
      } else {
        // Upload sem imagem (apenas dados)
        const updatedProduct = {
          name: editFormData.name,
          description: editFormData.description,
          costPrice: parseFloat(editFormData.costPrice),
          quantity: selectedProduct?.quantity ?? 0,
          image: editFormData.image // Manter URL da imagem se não foi selecionada nova
        };

        await updateProduct(editingProductId, updatedProduct);
      }

      await loadProducts();
      setEditModalOpen(false);
      setSelectedImage(null);
      setImagePreview('');
      setSuccessMessage('Produto atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setEditError(err.response?.data?.message || 'Failed to update product');
      } else {
        setEditError('Failed to update product');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    setEditError('');
    setSelectedImage(null);
    setImagePreview('');
  };

  // Cálculos dos totais
  const totalValorVenda = products.reduce((sum, p) => sum + (p.finalPrice || 0), 0);
  const totalVendasEstoque = products.reduce((sum, p) => sum + ((p.finalPrice || 0) * (p.quantity || 0)), 0);
  const totalLucroEstoque = products.reduce((sum, p) => sum + ((p.profit || 0) * (p.quantity || 0)), 0);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header */}
      <Fade in>
        <Paper
          elevation={0}
          sx={{
            maxWidth: { xs: '100%', sm: 500, md: 800, xl: 1000 },
            width: '100%',
            mx: 'auto',
            mt: 0, // No top margin since AppLayout already provides padding
            mb: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
            p: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }, // Increased padding
            borderRadius: 4,
            boxShadow: theme.customColors.shadow.primary,
            background: theme.customColors.surface.header,
            backdropFilter: 'blur(12px)',
            border: `1.5px solid ${theme.customColors.border.secondary}`,
            '@media (min-width: 1600px)': {
              maxWidth: 1200,
              p: 8,
            },
            '@media (min-width: 1920px)': {
              maxWidth: 1400,
              p: 9,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a202c',
                  mb: 1.5,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem', xl: '2.75rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  '@media (min-width: 1600px)': {
                    fontSize: '3rem',
                  },
                  '@media (min-width: 1920px)': {
                    fontSize: '3.25rem',
                  },
                }}
              >
                Produtos
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#2d3748',
                  mb: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.375rem' },
                  lineHeight: 1.3,
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  '@media (min-width: 1600px)': {
                    fontSize: '1.5rem',
                  },
                  '@media (min-width: 1920px)': {
                    fontSize: '1.625rem',
                  },
                }}
              >
                Gerencie todos os produtos do sistema
              </Typography>
            </Box>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/products/new')}
                sx={{
                  background: 'linear-gradient(135deg,rgb(24, 30, 56) 0%,rgb(31, 41, 55) 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.375rem' },
                  px: { xs: 2.5, sm: 3, md: 3.5, lg: 4, xl: 4.5 },
                  py: { xs: 1.25, sm: 1.5, md: 1.75, lg: 2, xl: 2.25 },
                  borderRadius: 3,
                  boxShadow: '0 6px 20px 0 rgba(102,126,234,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  transition: 'all 0.3s ease',
                  minHeight: { xs: '44px', sm: '48px', md: '52px', lg: '56px', xl: '60px' },
                  letterSpacing: '0.02em',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    boxShadow: '0 10px 40px 0 rgba(102,126,234,0.25)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                + Adicionar Produto
              </Button>
            )}
          </Box>
          {/* Card de totais - horizontal e centralizado */}
          {isAdmin && (
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 4,
              background: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.light, 0.12),
              border: `1.5px solid ${theme.palette.primary.main}`,
              borderRadius: 3,
              boxShadow: theme.customColors.shadow.secondary,
              p: 3,
              mt: 2,
              alignSelf: 'center',
              width: 'fit-content',
              mx: 'auto',
              justifyContent: 'center',
            }}>
              <Box sx={{ textAlign: 'center', minWidth: { xs: 'auto', sm: 200 } }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 700, fontSize: '0.875rem', mb: 0.5 }}>
                  Valor total de venda
                </Typography>
                <Typography variant="h6" sx={{ color: theme.customColors.status.success, fontWeight: 800 }}>
                  R$ {totalValorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />
              <Box sx={{ textAlign: 'center', minWidth: { xs: 'auto', sm: 200 } }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 700, fontSize: '0.875rem', mb: 0.5 }}>
                  Valor total se vender todo o estoque
                </Typography>
                <Typography variant="h6" sx={{ color: theme.customColors.status.info, fontWeight: 800 }}>
                  R$ {totalVendasEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />
              <Box sx={{ textAlign: 'center', minWidth: { xs: 'auto', sm: 200 } }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 700, fontSize: '0.875rem', mb: 0.5 }}>
                  Lucro total se vender todo o estoque
                </Typography>
                <Typography variant="h6" sx={{ color: theme.customColors.status.warning, fontWeight: 800 }}>
                  R$ {totalLucroEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Fade>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            maxWidth: 900,
            mx: 'auto',
            boxShadow: theme.customColors.shadow.secondary,
            '& .MuiAlert-icon': {
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Products Grid */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '500px' 
        }}>
          <CircularProgress size={80} sx={{ color: theme.customColors.text.primary }} />
        </Box>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)'
          },
          gap: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
          mt: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          maxWidth: { xs: '100%', sm: 900, md: 1400, lg: 1600, xl: 1800 },
          mx: 'auto',
          width: '100%',
        }}>
          {products.map((product) => (
            <Fade in key={product._id} timeout={400}>
              <Card
                sx={{
                  background: theme.customColors.surface.card,
                  border: `1.5px solid ${theme.customColors.border.primary}`,
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: hoveredCard === product._id 
                    ? theme.customColors.shadow.primary
                    : theme.customColors.shadow.secondary,
                  transform: hoveredCard === product._id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  '&:hover': {
                    boxShadow: theme.customColors.shadow.primary,
                    border: `2px solid ${theme.customColors.primary.main}`,
                    transform: 'translateY(-8px) scale(1.03)',
                  },
                  p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                  minHeight: { xs: '320px', sm: '360px', md: '400px', lg: '440px', xl: '480px' },
                }}
                onMouseEnter={() => setHoveredCard(product._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    width="100%"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      aspectRatio: '3/5',
                      transition: 'transform 0.3s ease',
                      transform: hoveredCard === product._id ? 'scale(1.05)' : 'scale(1)',
                      borderRadius: 3,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 }, pb: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: theme.customColors.text.primary,
                      mb: 1.5,
                      fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem', lg: '1.5rem' },
                      lineHeight: 1.3,
                      minHeight: '2.6em',
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
                    color="text.secondary"
                    sx={{
                      mb: 2.5,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem', lg: '1.0625rem' },
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.description}
                  </Typography>
                  {/* Informações de preço baseadas no tipo de usuário */}
                  {isAdmin ? (
                    // Admin vê todos os detalhes
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Custo:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.error, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {product.costPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Venda:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.success, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {product.finalPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Comissão:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.warning, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Lucro:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.info, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {product.profit?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    // Usuário padrão vê apenas comissão e preço final
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Comissão (30%):
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.warning, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Preço Final:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.customColors.status.success, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}>
                          R$ {product.finalPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        background: alpha(theme.customColors.primary.main, 0.1),
                        color: theme.customColors.primary.main,
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem' }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StockIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: theme.customColors.text.secondary }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' } }}>
                        {product.quantity || 0}
                      </Typography>
                    </Box>
                  </Box>
                  {isAdmin && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      gap: 1, 
                      mt: 2,
                      pt: 2,
                      borderTop: `1px solid ${alpha(theme.customColors.text.primary, 0.1)}`
                    }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(product)}
                          sx={{
                            background: alpha(theme.customColors.primary.main, 0.1),
                            color: theme.customColors.primary.main,
                            '&:hover': {
                              background: theme.customColors.primary.main,
                              color: theme.customColors.text.inverse,
                            },
                            width: { xs: 32, sm: 36, md: 40 },
                            height: { xs: 32, sm: 36, md: 40 },
                          }}
                        >
                          <EditIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(product)}
                          sx={{
                            background: alpha(theme.customColors.status.error, 0.1),
                            color: theme.customColors.status.error,
                            '&:hover': {
                              background: theme.customColors.status.error,
                              color: theme.customColors.text.inverse,
                            },
                            width: { xs: 32, sm: 36, md: 40 },
                            height: { xs: 32, sm: 36, md: 40 },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
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
            '@media (min-width: 1920px)': {
              maxWidth: 500,
              minWidth: 400,
            }
          }
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
        <DialogTitle sx={{ color: '#2d3748', fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography>
            Tem certeza que deseja excluir o produto "{selectedProduct?.name}"? Esta ação não pode ser desfeita.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            color="error"
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditCancel}
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
            borderRadius: { xs: 2, sm: 3 },
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
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
            '@media (min-width: 1920px)': {
              maxWidth: 600,
              minWidth: 500,
            }
          }
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
        <DialogTitle sx={{ color: '#2d3748', fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Editar Produto
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <TextField
            name="name"
            label="Nome do Produto"
            value={editFormData.name}
            onChange={handleEditChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="description"
            label="Descrição"
            value={editFormData.description}
            onChange={handleEditChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            name="costPrice"
            label="Preço de Custo (R$)"
            type="number"
            value={editFormData.costPrice}
            onChange={handleEditChange}
            inputProps={{ step: "0.01" }}
            sx={{ mb: 2 }}
          />
          
          {/* Upload de Imagem */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.customColors.text.primary }}>
              Imagem do Produto
            </Typography>
            
            {/* Preview da imagem atual ou selecionada */}
            {(imagePreview || editFormData.image) && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img
                  src={imagePreview || editFormData.image}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: `2px solid ${theme.customColors.border.primary}`
                  }}
                />
              </Box>
            )}
            
            {/* Botão de upload */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{
                mb: 1,
                borderRadius: 2,
                borderColor: theme.customColors.border.primary,
                color: theme.customColors.text.primary,
                '&:hover': {
                  borderColor: theme.customColors.primary.main,
                  color: theme.customColors.primary.main,
                }
              }}
            >
              {selectedImage ? `${selectedImage.name}` : 'Selecionar Nova Imagem'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            
            {/* Botão para remover imagem */}
            {(selectedImage || editFormData.image) && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveImage}
                fullWidth
                startIcon={<RemoveIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: theme.customColors.status.error,
                  color: theme.customColors.status.error,
                  '&:hover': {
                    backgroundColor: alpha(theme.customColors.status.error, 0.1),
                  }
                }}
              >
                Remover Imagem
              </Button>
            )}
            
            {/* Campo para URL da imagem (fallback) */}
            <TextField
              name="image"
              label="URL da Imagem (opcional)"
              value={editFormData.image}
              onChange={handleEditChange}
              placeholder="Ou cole uma URL de imagem aqui"
              sx={{ mt: 1 }}
              helperText="Use o botão acima para fazer upload ou cole uma URL"
            />
          </Box>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
          <Button 
            onClick={handleEditCancel} 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            disabled={uploading}
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            }}
          >
            {uploading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens de sucesso */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList;