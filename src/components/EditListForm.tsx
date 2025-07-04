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
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#383A29' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      px: { xs: 1, sm: 2, md: 3 },
    }}>
      <Box sx={{ width: '100%', maxWidth: { xs: 360, sm: 600, md: 900 }, mx: 'auto' }}>
        <Box
          sx={{
            mb: { xs: 2, sm: 4 },
            p: { xs: 1, sm: 3 },
            backgroundColor: '#2d3748',
            borderRadius: { xs: 2, sm: 3 },
            color: 'white',
            '@media (min-width: 1920px)': {
              maxWidth: 1100,
              p: 6,
            },
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', sm: '2rem' }, color: 'white' }}>
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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, background: '#fff', borderRadius: { xs: 2, sm: 3 }, p: { xs: 1, sm: 3 }, boxShadow: '0 2px 8px rgba(45,55,72,0.06)' }}>
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
                <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Produtos na Lista ({getSelectedProductsData().length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddProductDialogOpen(true)}
                  disabled={availableProducts.length === 0}
                  sx={{
                    backgroundColor: '#2d3748',
                    color: 'white',
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    borderRadius: { xs: 2, sm: 3 },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    '&:hover': {
                      backgroundColor: '#1a202c'
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
                          {formatPrice(product.finalPrice)}
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
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/stock-lists')}
                  sx={{
                    borderColor: '#2d3748',
                    color: '#2d3748',
                    borderRadius: { xs: 2, sm: 3 },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    '&:hover': {
                      borderColor: '#1a202c',
                      backgroundColor: 'rgba(45, 55, 72, 0.04)'
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
                    backgroundColor: '#2d3748',
                    color: 'white',
                    borderRadius: { xs: 2, sm: 3 },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    '&:hover': {
                      backgroundColor: '#1a202c'
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
          PaperProps={{
            sx: {
              '@media (min-width: 1920px)': {
                maxWidth: 1100,
                minWidth: 900,
                p: 4,
              },
              background: '#fff',
              borderRadius: { xs: 2, sm: 3 },
            }
          }}
        >
          <DialogTitle sx={{ color: '#2d3748', fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Adicionar Produtos
          </DialogTitle>
          <DialogContent sx={{ background: '#f7fafc', p: { xs: 1, sm: 3 } }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {availableProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                  <Card sx={{
                    border: '1.5px solid #2d3748',
                    borderRadius: { xs: 2, sm: 3 },
                    background: '#fff',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1.5px solid #1a202c',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(45, 55, 72, 0.10)'
                    }
                  }}
                  onClick={() => handleAddProduct(product._id)}
                  >
                    {product.image && (
                      <CardMedia
                        component="img"
                        height={54}
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'cover', borderTopLeftRadius: { xs: 2, sm: 3 }, borderTopRightRadius: { xs: 2, sm: 3 } }}
                      />
                    )}
                    <CardContent sx={{ p: { xs: 0.5, sm: 1.5 }, display: 'block' }}>
                      <Typography variant="subtitle1" sx={{
                        color: '#2d3748',
                        fontWeight: 'bold',
                        mb: 0.25,
                        fontSize: { xs: '0.75rem', sm: '1rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                        {product.description}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                        {formatPrice(product.finalPrice)}
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
          <DialogActions sx={{ background: '#fff', borderRadius: { xs: 2, sm: 3 } }}>
            <Button
              onClick={() => setAddProductDialogOpen(false)}
              sx={{ color: '#2d3748', fontWeight: 600 }}
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default EditListForm;