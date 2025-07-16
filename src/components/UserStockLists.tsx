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
  Paper,
  alpha
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
        background: theme.customColors.background.default,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <CircularProgress size={60} sx={{ color: theme.customColors.text.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: theme.customColors.background.default,
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
              boxShadow: theme.customColors.shadow.secondary,
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
        background: theme.customColors.background.default,
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
              boxShadow: theme.customColors.shadow.secondary,
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
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Container maxWidth="xl" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
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
              mt: 0, // No top margin since AppLayout already provides padding
              mb: { xs: 1, sm: 2, md: 4 },
              p: { xs: 1, sm: 2, md: 4 },
              borderRadius: 3,
              boxShadow: theme.customColors.shadow.secondary,
              background: theme.customColors.surface.card,
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${theme.customColors.border.primary}`,
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
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.customColors.text.primary,
                mb: 1.5,
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
              Minhas Listas
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.customColors.text.secondary,
                mb: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem' },
                lineHeight: 1.4,
                '@media (min-width: 1600px)': {
                  fontSize: '1.375rem',
                },
                '@media (min-width: 1920px)': {
                  fontSize: '1.5rem',
                },
              }}
            >
              Produtos atribuídos às suas listas personalizadas
            </Typography>
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
        
        {/* Category Filter */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 4,
          width: '100%',
          maxWidth: 900,
        }}>
          <ButtonGroup
            variant="outlined"
            sx={{
              borderRadius: 3,
              boxShadow: theme.customColors.shadow.secondary,
              background: theme.customColors.surface.card,
              border: `1px solid ${theme.customColors.border.primary}`,
              '& .MuiButton-root': {
                borderColor: theme.customColors.border.primary,
                color: theme.customColors.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                  borderColor: theme.customColors.primary.main,
                  color: theme.customColors.primary.main,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.customColors.primary.main,
                  color: theme.customColors.text.inverse,
                  '&:hover': {
                    backgroundColor: theme.customColors.primary.light,
                  },
                },
              },
            }}
          >
            <Button
              onClick={() => handleCategoryFilter('all')}
              sx={{
                backgroundColor: selectedCategory === 'all' ? theme.customColors.primary.main : 'transparent',
                color: selectedCategory === 'all' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
                '&:hover': {
                  backgroundColor: selectedCategory === 'all' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
                },
              }}
            >
              Todos
            </Button>
            <Button
              onClick={() => handleCategoryFilter('feminino')}
              sx={{
                backgroundColor: selectedCategory === 'feminino' ? theme.customColors.primary.main : 'transparent',
                color: selectedCategory === 'feminino' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
                '&:hover': {
                  backgroundColor: selectedCategory === 'feminino' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
                },
              }}
            >
              Feminino
            </Button>
            <Button
              onClick={() => handleCategoryFilter('masculino')}
              sx={{
                backgroundColor: selectedCategory === 'masculino' ? theme.customColors.primary.main : 'transparent',
                color: selectedCategory === 'masculino' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
                '&:hover': {
                  backgroundColor: selectedCategory === 'masculino' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
                },
              }}
            >
              Masculino
            </Button>
            <Button
              onClick={() => handleCategoryFilter('unissex')}
              sx={{
                backgroundColor: selectedCategory === 'unissex' ? theme.customColors.primary.main : 'transparent',
                color: selectedCategory === 'unissex' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
                '&:hover': {
                  backgroundColor: selectedCategory === 'unissex' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
                },
              }}
            >
              Unissex
            </Button>
          </ButtonGroup>
        </Box>

        {/* Products Grid */}
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
          maxWidth: { xs: '100%', sm: 900, md: 1400, lg: 1600, xl: 1800 },
          mx: 'auto',
          width: '100%',
        }}>
          {filteredProducts.map((product) => (
            <Fade in key={product._id} timeout={400}>
              <Card
                sx={{
                  background: theme.customColors.surface.card,
                  border: `1.5px solid ${theme.customColors.border.primary}`,
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: theme.customColors.shadow.secondary,
                  '&:hover': {
                    boxShadow: theme.customColors.shadow.primary,
                    border: `2px solid ${theme.customColors.primary.main}`,
                    transform: 'translateY(-8px) scale(1.03)',
                  },
                  p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                  minHeight: { xs: '320px', sm: '360px', md: '400px', lg: '440px', xl: '480px' },
                }}
              >
                <CardMedia
                  component="img"
                  width="100%"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    objectFit: 'cover',
                    aspectRatio: '3/5',
                    borderRadius: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
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
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      color: theme.customColors.status.success,
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                    }}>
                      R$ {product.finalPrice?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.customColors.status.warning,
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                    }}>
                      Comissão: R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' },
                      fontWeight: 600,
                    }}>
                      Estoque: {product.quantity || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default UserStockLists;