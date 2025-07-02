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
  Paper
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
    <Box sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
        mb: 4,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)',
          boxShadow: '0 8px 32px 0 rgba(45,55,72,0.10)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Gerenciar Produtos
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
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
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Adicionar Produto
          </Button>
        </Box>
      </Paper>

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

      {/* Products Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 4
      }}>
        {products.map((product) => (
          <Fade in timeout={300} key={product._id}>
            <Card
              elevation={0}
              onMouseEnter={() => setHoveredCard(product._id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCard === product._id ? 'translateY(-8px)' : 'translateY(0)',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{
                  objectFit: 'cover',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />
                              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h2" sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  color: theme.palette.text.primary,
                  lineHeight: 1.3
                }}>
                  {product.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 2,
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </Typography>

                                  <Stack spacing={2} sx={{ mb: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      R$ {product.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CommissionIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {product.commission}% comissão
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Editar">
                    <IconButton
                    size="small"
                    onClick={() => handleEditClick(product)}
                    sx={{
                        color: theme.palette.primary.main,
                      '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(product)}
                    sx={{
                        color: theme.palette.error.main,
                      '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                      }
                    }}
                  >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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
            maxWidth: 400,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tem certeza que deseja excluir o produto "{selectedProduct?.name}"?
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleDeleteCancel} sx={{ fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            color="error"
            sx={{ fontWeight: 600 }}
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
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Editar Produto
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Preço"
              name="price"
              type="number"
              value={editFormData.price}
              onChange={handleEditChange}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Comissão (%)"
              name="commission"
              type="number"
              value={editFormData.commission}
              onChange={handleEditChange}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="URL da Imagem"
              name="image"
              value={editFormData.image}
              onChange={handleEditChange}
            />
          {editError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {editError}
            </Alert>
          )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleEditCancel} sx={{ fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            sx={{ fontWeight: 600 }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;