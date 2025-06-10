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
  CircularProgress
} from '@mui/material';
import { getCustomLists } from '../services/api';
import { Product, CustomList } from '../types';

const UserStockLists: React.FC = () => {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        {uniqueProducts.map((product: Product) => (
          <Card key={product._id} sx={{
            height: '400px',
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
                height="280"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover', flex: '0 0 280px' }}
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
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default UserStockLists;