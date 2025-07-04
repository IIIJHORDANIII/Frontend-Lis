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
  useMediaQuery
} from '@mui/material';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as CommissionIcon,
  Inventory as StockIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  AccountBalance as ProfitIcon
} from '@mui/icons-material';
import { getProducts, deleteProduct, updateProduct } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

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

  const handleEditSubmit = async () => {
    if (!editingProductId) return;

    try {
      const updatedProduct = {
        name: editFormData.name,
        description: editFormData.description,
        costPrice: parseFloat(editFormData.costPrice),
        quantity: selectedProduct?.quantity ?? 0
      };

      await updateProduct(editingProductId, updatedProduct);
      await loadProducts();
      setEditModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setEditError(err.response?.data?.message || 'Failed to update product');
      } else {
        setEditError('Failed to update product');
      }
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    setEditError('');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'white',
      py: { xs: 2, sm: 3, md: 4 },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <Container maxWidth="xl" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        px: { xs: 1, sm: 2, md: 3 },
      }}>
        {/* Header */}
        <Fade in>
          <Paper
            elevation={0}
            sx={{
              maxWidth: { xs: 340, sm: 400, md: 700, xl: 900 },
              width: '100%',
              mx: 'auto',
              mt: { xs: 1, sm: 2, md: 4 },
              mb: { xs: 1, sm: 2, md: 4 },
              p: { xs: 1, sm: 2, md: 4 },
              borderRadius: 3,
              boxShadow: '0 8px 32px 0 rgba(45,55,72,0.10)',
              background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.22)',
              '@media (min-width: 1600px)': {
                maxWidth: 1100,
                p: 6,
              },
              '@media (min-width: 1920px)': {
                maxWidth: 1300,
                p: 8,
              },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: { xs: 2, md: 0 } }}>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 1,
                    fontSize: { xs: '1.7rem', sm: '2.2rem', md: '2.7rem' },
                    '@media (min-width: 1600px)': {
                      fontSize: '2.75rem',
                    },
                    '@media (min-width: 1920px)': {
                      fontSize: '3rem',
                    },
                  }}
                >
                  Produtos
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color:'white',
                    mb: 2,
                    fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                    '@media (min-width: 1600px)': {
                      fontSize: '1.25rem',
                    },
                    '@media (min-width: 1920px)': {
                      fontSize: '1.35rem',
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
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.05rem', sm: '1.15rem' },
                    px: { xs: 2.5, sm: 4 },
                    py: { xs: 1.2, sm: 1.7 },
                    borderRadius: 3,
                    boxShadow: '0 4px 16px 0 rgba(102,126,234,0.10)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    transition: 'background 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      boxShadow: '0 8px 32px 0 rgba(102,126,234,0.18)',
                    }
                  }}
                >
                  + Adicionar Produto
                </Button>
              )}
            </Box>
          </Paper>
        </Fade>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              fontSize: '1.1rem',
              maxWidth: 900,
              mx: 'auto',
              boxShadow: '0 2px 8px rgba(45,55,72,0.10)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
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
            minHeight: '400px' 
          }}>
            <CircularProgress size={60} sx={{ color: 'white' }} />
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
            gap: { xs: 3, sm: 4, md: 5 },
            mt: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1200,
            mx: 'auto'
          }}>
            {products.map((product) => (
              <Fade in key={product._id} timeout={400}>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.97)',
                    border: '1.5px solid rgba(102,126,234,0.10)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: hoveredCard === product._id 
                      ? '0 20px 40px rgba(102,126,234,0.18)' 
                      : '0 8px 32px rgba(102,126,234,0.10)',
                    transform: hoveredCard === product._id ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(102,126,234,0.18)',
                      border: '2px solid #764ba2',
                      transform: 'translateY(-8px) scale(1.04)',
                    },
                    p: { xs: 2, sm: 3 },
                  }}
                  onMouseEnter={() => setHoveredCard(product._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height={isExtraSmallMobile ? 120 : isSmallMobile ? 140 : 160}
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        transform: hoveredCard === product._id ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                    {isAdmin && (
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1
                      }}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(product)}
                            sx={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              color: theme.palette.primary.main,
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.1)',
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(product)}
                            sx={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              color: theme.palette.error.main,
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.1)',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
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
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        fontSize: { xs: '0.95rem', sm: '1rem' },
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
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                            Custo:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                            R$ {product.costPrice?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                            Venda:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                            R$ {product.finalPrice?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                            Comissão:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                            R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                            Lucro:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                            R$ {product.profit?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                      </Stack>
                    ) : (
                      // Usuário padrão vê apenas comissão e preço final
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                            Comissão (30%):
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                            R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                            Preço Final:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
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
                          background: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StockIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          {product.quantity || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            background: '#fff',
            '@media (min-width: 1920px)': {
              maxWidth: 500,
              minWidth: 400,
            }
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
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            background: '#fff',
            '@media (min-width: 1920px)': {
              maxWidth: 600,
              minWidth: 500,
            }
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
          <TextField
            name="image"
            label="URL da Imagem"
            value={editFormData.image}
            onChange={handleEditChange}
            sx={{ mb: 2 }}
          />
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
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;