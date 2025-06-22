import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Container,
  Alert,
  CircularProgress,
  Button,
  ButtonGroup
} from '@mui/material';
import { getCustomLists } from '../services/api';
import { Product, CustomList } from '../types';

const UserStockLists: React.FC = () => {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Usuário não autenticado. Faça login novamente.');
          return;
        }
        
        const data = await getCustomLists();
        setLists(data);
      } catch (err: any) {
        console.error('Erro ao buscar listas:', err);
        if (err.response) {
          setError(err.response.data?.message || `Erro ${err.response.status}: ${err.response.statusText}`);
        } else if (err.request) {
          setError('Erro de conexão. Verifique se o backend está rodando na porta 3000.');
        } else {
          setError(err.message || 'Erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  // Extrair todos os produtos de todas as listas
  const allProducts = lists.reduce((products: Product[], list) => {
    if (list.products) {
      return [...products, ...list.products];
    }
    return products;
  }, []);

  // Remover produtos duplicados baseado no _id
  const uniqueProducts = allProducts.filter((product, index, self) => 
    index === self.findIndex(p => p._id === product._id)
  );

  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === 'all' 
    ? uniqueProducts 
    : uniqueProducts.filter(product => product.category === selectedCategory);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#383A29' }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ backgroundColor: '#ffebee', borderLeft: '4px solid #383A29' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!uniqueProducts.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #383A29' }}>
          Nenhum produto foi atribuído a você.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Botões de filtro por categoria */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 4,
        p: 3,
        backgroundColor: 'rgba(217, 217, 217, 0.8)',
        borderRadius: 3,
        border: '1px solid rgba(56, 58, 41, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          width: '100%',
          maxWidth: 600,
          justifyContent: 'center'
        }}>
          <Button
            onClick={() => handleCategoryFilter('all')}
            variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'all' ? '#383A29' : 'transparent',
              color: selectedCategory === 'all' ? 'white' : '#383A29',
              borderColor: '#383A29',
              borderWidth: 2,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: { xs: '100%', sm: 120 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'all' ? '#2d2f20' : 'rgba(56, 58, 41, 0.1)',
                borderColor: '#383A29',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(56, 58, 41, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(56, 58, 41, 0.15)'
              }
            }}
          >
            Todos
          </Button>
          <Button
            onClick={() => handleCategoryFilter('masculino')}
            variant={selectedCategory === 'masculino' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'masculino' ? '#383A29' : 'transparent',
              color: selectedCategory === 'masculino' ? 'white' : '#383A29',
              borderColor: '#383A29',
              borderWidth: 2,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: { xs: '100%', sm: 120 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'masculino' ? '#2d2f20' : 'rgba(56, 58, 41, 0.1)',
                borderColor: '#383A29',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(56, 58, 41, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(56, 58, 41, 0.15)'
              }
            }}
          >
            Masculino
          </Button>
          <Button
            onClick={() => handleCategoryFilter('feminino')}
            variant={selectedCategory === 'feminino' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'feminino' ? '#383A29' : 'transparent',
              color: selectedCategory === 'feminino' ? 'white' : '#383A29',
              borderColor: '#383A29',
              borderWidth: 2,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: { xs: '100%', sm: 120 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'feminino' ? '#2d2f20' : 'rgba(56, 58, 41, 0.1)',
                borderColor: '#383A29',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(56, 58, 41, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(56, 58, 41, 0.15)'
              }
            }}
          >
            Feminino
          </Button>
          <Button
            onClick={() => handleCategoryFilter('infantil')}
            variant={selectedCategory === 'infantil' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'infantil' ? '#383A29' : 'transparent',
              color: selectedCategory === 'infantil' ? 'white' : '#383A29',
              borderColor: '#383A29',
              borderWidth: 2,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: { xs: '100%', sm: 120 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'infantil' ? '#2d2f20' : 'rgba(56, 58, 41, 0.1)',
                borderColor: '#383A29',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(56, 58, 41, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(56, 58, 41, 0.15)'
              }
            }}
          >
            Infantil
          </Button>
        </Box>
      </Box>

      {/* Contador de produtos filtrados */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` na categoria ${selectedCategory}`}
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 2
      }}>
        {filteredProducts.map((product: Product) => (
          <Card key={product._id} sx={{
            height: '480px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #d9d9d9',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid #383A29',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(56, 58, 41, 0.15)'
            }
          }}>
            {product.image && (
              <CardMedia
                component="img"
                height="340"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover', flex: '0 0 340px' }}
              />
            )}
            <CardContent sx={{ 
              p: 2, 
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
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
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {product.description}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ color: '#383A29', fontWeight: 'bold' }}>
                  R$ {product.price.toFixed(2)}
                </Typography>
                {product.quantity !== undefined && (
                  <Chip
                    label={`Qtd: ${product.quantity}`}
                    size="small"
                    sx={{
                      backgroundColor: product.quantity > 0 ? '#383A29' : '#d9d9d9',
                      color: product.quantity > 0 ? 'white' : '#383A29'
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
                <Chip
                  label={`Comissão: R$ ${product.commission.toFixed(2)}`}
                  size="small"
                  sx={{
                    backgroundColor: '#e0e0e0',
                    color: '#383A29',
                    fontWeight: 'bold',
                    mr: 1
                  }}
                />
                {product.category && (
                  <Chip
                    label={product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    size="small"
                    sx={{
                      backgroundColor: '#383A29',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default UserStockLists;