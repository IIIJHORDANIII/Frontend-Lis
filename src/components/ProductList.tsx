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
  Add as AddIcon
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
    price: '',
    commission: '',
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
      price: product.price.toString(),
      commission: product.commission.toString(),
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
        price: parseFloat(editFormData.price),
        commission: parseFloat(editFormData.commission),
        image: editFormData.image
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

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 0.75, sm: 1.5, md: 4 },
          mb: { xs: 1, sm: 2, md: 4 },
          color: 'white',
          borderRadius: { xs: 1, sm: 2, md: 3 },
          maxWidth: { xs: 320, sm: 480, md: '100%' },
          mx: { xs: 'auto', sm: 0 },
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)',
          boxShadow: '0 4px 16px 0 rgba(45,55,72,0.08)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 0.25,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.75rem', lg: '2rem' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Gerenciar Produtos
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9, 
              mb: 1,
              fontSize: { xs: '0.65rem', sm: '0.8rem', md: '1rem' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Visualize, edite e gerencie todos os produtos do sistema
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/products/new')}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
              px: { xs: 1, sm: 2, md: 3 },
              py: { xs: 0.25, sm: 0.75, md: 1.5 },
              minHeight: { xs: '28px', sm: '36px', md: '48px' },
              display: 'block',
              mx: { xs: 'auto', sm: 0 },
              borderRadius: { xs: 1, sm: 2, md: 3 },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {isSmallMobile ? 'Adicionar' : 'Adicionar Produto'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: { xs: 0.25, sm: 1, md: 3, lg: 4 },
        maxWidth: { xs: 340, sm: 480, md: '100%' },
        mx: { xs: 'auto', sm: 0 },
      }}>
        {products.map((product) => (
          <Fade in timeout={300} key={product._id}>
            <Card
              elevation={0}
              onMouseEnter={() => setHoveredCard(product._id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                alignSelf: 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: { xs: 1, sm: 2.5, md: 3 },
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCard === product._id ? 'translateY(-6px)' : 'translateY(0)',
                '&:hover': {
                  boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                },
                '@media (max-width: 600px)': {
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  }
                }
              }}
            >
              <CardMedia
                component="img"
                height={54}
                image={product.image}
                alt={product.name}
                sx={{
                  objectFit: 'cover',
                  borderTopLeftRadius: { xs: 3, sm: 12 },
                  borderTopRightRadius: { xs: 3, sm: 12 },
                }}
              />
              <CardContent sx={{ 
                p: { xs: 0.5, sm: 1.5, md: 3 }, 
                display: 'block',
              }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 0.25,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    fontSize: { xs: '0.75rem', sm: '1rem', md: '1.125rem' },
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 0.5,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: { xs: '0.65rem', sm: '0.8125rem', md: '0.875rem' },
                  }}
                >
                  {product.description}
                </Typography>

                <Box sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                    <MoneyIcon sx={{ 
                      fontSize: { xs: 13, sm: 16, md: 18 }, 
                      color: theme.palette.primary.main 
                    }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.8125rem', md: '0.875rem' },
                      }}
                    >
                      R$ {product.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                    <CommissionIcon sx={{ 
                      fontSize: { xs: 13, sm: 16, md: 18 }, 
                      color: theme.palette.secondary.main 
                    }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.8125rem', md: '0.875rem' },
                      }}
                    >
                      {product.commission}% comissão
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 0 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(product)}
                        sx={{
                          color: theme.palette.primary.main,
                          p: 0.5,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(product)}
                        sx={{
                          color: theme.palette.error.main,
                          p: 0.5,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 400 },
            width: { xs: 'calc(100vw - 32px)', sm: 'auto' },
            margin: { xs: '16px', sm: '24px' },
            '@media (min-width: 1920px)': {
              maxWidth: 700,
              minWidth: 500,
              margin: '32px auto',
            },
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            }}
          >
            Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '1rem' },
            }}
          >
            Tem certeza que deseja excluir o produto "{selectedProduct?.name}"?
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
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

      {/* Edit Product Dialog */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 600 },
            width: { xs: 'calc(100vw - 32px)', sm: 'auto' },
            margin: { xs: '16px', sm: '24px' },
            '@media (min-width: 1920px)': {
              maxWidth: 900,
              minWidth: 700,
              margin: '32px auto',
            },
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            }}
          >
            Editar Produto
          </Typography>
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
            name="price"
            label="Preço"
            type="number"
            value={editFormData.price}
            onChange={handleEditChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="commission"
            label="Comissão (%)"
            type="number"
            value={editFormData.commission}
            onChange={handleEditChange}
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