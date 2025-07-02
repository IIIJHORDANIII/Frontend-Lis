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
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#383A29' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{
        mb: 4,
        p: 3,
        backgroundColor: '#383A29',
        borderRadius: 2,
        color: 'white'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Editar Lista
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#ffebee', borderLeft: '4px solid #383A29' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, backgroundColor: '#e8f5e8', borderLeft: '4px solid #383A29' }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Nome da Lista"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#383A29'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#383A29'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
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
              label="Lista Pública"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#383A29'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#383A29'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#383A29', fontWeight: 'bold' }}>
                Produtos na Lista ({getSelectedProductsData().length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddProductDialogOpen(true)}
                disabled={availableProducts.length === 0}
                sx={{
                  backgroundColor: '#383A29',
                  '&:hover': {
                    backgroundColor: '#2d2f1f'
                  }
                }}
              >
                Adicionar Produto
              </Button>
            </Box>

            <Grid container spacing={2}>
              {getSelectedProductsData().map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                  <Card sx={{
                    border: '1px solid #d9d9d9',
                    position: 'relative'
                  }}>
                    <IconButton
                      onClick={() => handleRemoveProduct(product._id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: '#d32f2f',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {product.image && (
                      <CardMedia
                        component="img"
                        height="120"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{
                        color: '#383A29',
                        fontWeight: 'bold',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.description}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#383A29', fontWeight: 'bold' }}>
                        {formatPrice(product.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#383A29'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#383A29'
              }
            }}>
              <InputLabel>Compartilhar com Usuários</InputLabel>
              <Select
                multiple
                value={selectedUsers.map(user => user._id)}
                onChange={(e) => {
                  const selectedIds = e.target.value as string[];
                  const selected = users.filter(user => selectedIds.includes(user._id));
                  setSelectedUsers(selected);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((userId) => {
                      const user = users.find(u => u._id === userId);
                      return (
                        <Chip
                          key={userId}
                          label={user?.email || userId}
                          size="small"
                          sx={{
                            backgroundColor: '#383A29',
                            color: 'white'
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/stock-lists')}
                sx={{
                  borderColor: '#383A29',
                  color: '#383A29',
                  '&:hover': {
                    borderColor: '#2d2f1f',
                    backgroundColor: 'rgba(56, 58, 41, 0.04)'
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: '#383A29',
                  '&:hover': {
                    backgroundColor: '#2d2f1f'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Atualizar Lista'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog para adicionar produtos */}
      <Dialog
        open={addProductDialogOpen}
        onClose={() => setAddProductDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#383A29', fontWeight: 'bold' }}>
          Adicionar Produtos
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {availableProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                <Card sx={{
                  border: '1px solid #d9d9d9',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '1px solid #383A29',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(56, 58, 41, 0.15)'
                  }
                }}
                onClick={() => handleAddProduct(product._id)}
                >
                  {product.image && (
                    <CardMedia
                      component="img"
                      height="120"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{
                      color: '#383A29',
                      fontWeight: 'bold',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#383A29', fontWeight: 'bold' }}>
                      {formatPrice(product.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {availableProducts.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Todos os produtos já estão na lista.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddProductDialogOpen(false)}
            sx={{ color: '#383A29' }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditListForm;