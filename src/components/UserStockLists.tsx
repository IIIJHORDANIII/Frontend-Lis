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
  ButtonGroup,
  useTheme,
  useMediaQuery,
  Fade,
  Paper
} from '@mui/material';
import { getCustomLists } from '../services/api';
import { Product, CustomList } from '../types';

const UserStockLists: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      } catch (err) {
        setError('Erro ao carregar listas. Tente novamente.');
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
      <Box sx={{ 
        minHeight: '100vh',
        background: 'white',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
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
        </Container>
      </Box>
    );
  }

  if (!uniqueProducts.length) {
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
          <Alert 
            severity="info" 
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
            Nenhum produto foi atribuído a você.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'transparent',
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
              background: 'white',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.22)',
              '@media (min-width: 1600px)': {
                maxWidth: 1100,
                p: 6,
              },
              '@media (min-width: 1920px)': {
                maxWidth: 1200,
                p: 8,
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
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
                Meus Produtos
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
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
                Visualize todos os produtos disponíveis para venda
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Botões de filtro por categoria */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0.5,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
        }}>
          <Button
            onClick={() => handleCategoryFilter('all')}
            variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'all' ? theme.palette.primary.main : 'transparent',
              color: selectedCategory === 'all' ? 'white' : theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              borderRadius: 2,
              minWidth: '56px !important',
              height: 28,
              px: '0.8 !important',
              py: '0.8 !important',
              fontSize: '0.78rem !important',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'all' ? theme.palette.primary.dark : 'rgba(102,126,234,0.1)',
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102,126,234,0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(102,126,234,0.15)'
              }
            }}
          >
            Todos
          </Button>
          <Button
            onClick={() => handleCategoryFilter('masculino')}
            variant={selectedCategory === 'masculino' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'masculino' ? theme.palette.primary.main : 'transparent',
              color: selectedCategory === 'masculino' ? 'white' : theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              borderRadius: 2,
              minWidth: '56px !important',
              height: 28,
              px: '0.8 !important',
              py: '0.8 !important',
              fontSize: '0.78rem !important',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'masculino' ? theme.palette.primary.dark : 'rgba(102,126,234,0.1)',
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102,126,234,0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(102,126,234,0.15)'
              }
            }}
          >
            Masculino
          </Button>
          <Button
            onClick={() => handleCategoryFilter('feminino')}
            variant={selectedCategory === 'feminino' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'feminino' ? theme.palette.primary.main : 'transparent',
              color: selectedCategory === 'feminino' ? 'white' : theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              borderRadius: 2,
              minWidth: '56px !important',
              height: 28,
              px: '0.8 !important',
              py: '0.8 !important',
              fontSize: '0.78rem !important',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'feminino' ? theme.palette.primary.dark : 'rgba(102,126,234,0.1)',
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102,126,234,0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(102,126,234,0.15)'
              }
            }}
          >
            Feminino
          </Button>
          <Button
            onClick={() => handleCategoryFilter('infantil')}
            variant={selectedCategory === 'infantil' ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === 'infantil' ? theme.palette.primary.main : 'transparent',
              color: selectedCategory === 'infantil' ? 'white' : theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              borderRadius: 2,
              minWidth: '56px !important',
              height: 28,
              px: '0.8 !important',
              py: '0.8 !important',
              fontSize: '0.78rem !important',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: selectedCategory === 'infantil' ? theme.palette.primary.dark : 'rgba(102,126,234,0.1)',
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102,126,234,0.2)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 10px rgba(102,126,234,0.15)'
              }
            }}
          >
            Infantil
          </Button>
        </Box>

        {/* Contador de produtos filtrados */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 500
            }}
          >
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` na categoria ${selectedCategory}`}
          </Typography>
        </Box>

        {/* Lists */}
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: { xs: 3, sm: 4, md: 5 },
            maxWidth: 1200,
            mx: 'auto'
          }}>
            {filteredProducts.map((product: Product, index) => (
              <Fade in timeout={400 + index * 100} key={product._id}>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.97)',
                    border: '1.5px solid rgba(102,126,234,0.10)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(102,126,234,0.18)',
                      border: '2px solid #764ba2',
                      transform: 'translateY(-8px) scale(1.04)',
                    },
                    p: { xs: 2, sm: 3 },
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
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
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
                        mb: 2,
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: theme.palette.success.main, 
                          fontWeight: 700,
                          fontSize: { xs: '1.1rem', sm: '1.2rem' }
                        }}
                      >
                        R$ {product.finalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {product.quantity !== undefined && (
                        <Chip
                          label={`Estoque: ${product.quantity}`}
                          size="small"
                          sx={{
                            backgroundColor: product.quantity > 0 ? theme.palette.success.light : theme.palette.error.light,
                            color: product.quantity > 0 ? theme.palette.success.dark : theme.palette.error.dark,
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}
                        />
                      )}
                      {product.category && (
                        <Chip
                          label={product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UserStockLists;