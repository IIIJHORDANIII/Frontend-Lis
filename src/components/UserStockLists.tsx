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
import InventoryIcon from '@mui/icons-material/Inventory';
import { getCustomLists, closeUserStock } from '../services/api';
import { Product, CustomList } from '../types';

const UserStockLists: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [closingStock, setClosingStock] = useState<{ [listId: string]: boolean }>({});
  const [success, setSuccess] = useState<string | null>(null);

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



  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCloseStock = async (listId: string, listName: string) => {
    // Confirmação antes de fechar o estoque
    const confirmed = window.confirm(
      `Tem certeza que deseja fechar o estoque da lista "${listName}"? ` +
      'Todos os produtos não vendidos desta lista retornarão ao estoque do administrador. ' +
      'Esta ação não pode ser desfeita.'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      setClosingStock(prev => ({ ...prev, [listId]: true }));
      setError(null);
      setSuccess(null);
      
      const result = await closeUserStock();
      setSuccess(result.message);
      
      // Recarregar as listas para atualizar os dados
      const updatedLists = await getCustomLists();
      setLists(updatedLists);
    } catch (err: any) {
      setError(err.message || 'Erro ao fechar estoque. Tente novamente.');
    } finally {
      setClosingStock(prev => ({ ...prev, [listId]: false }));
    }
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
              borderRadius: 1,
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

  if (!lists.length) {
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
              borderRadius: 1,
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
              borderRadius: 1,
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
              borderRadius: 1,
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

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 4,
              borderRadius: 1,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              maxWidth: 900,
              mx: 'auto',
              boxShadow: theme.customColors.shadow.secondary,
              '& .MuiAlert-icon': {
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }
            }}
          >
            {success}
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
              borderRadius: 1,
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



        {/* Listas Separadas */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
          maxWidth: { xs: '100%', sm: 900, md: 1400, lg: 1600, xl: 1800 },
          mx: 'auto',
          width: '100%',
        }}>
          {lists.map((list) => {
            // Filtrar produtos da lista por categoria
            const listProducts = list.products?.filter(item => {
              if (selectedCategory === 'all') return true;
              return item.product?.category === selectedCategory;
            }) || [];

            if (listProducts.length === 0) return null;

            return (
              <Fade in key={list._id} timeout={400}>
                <Paper
                  elevation={0}
                  sx={{
                    background: theme.customColors.surface.card,
                    border: `1.5px solid ${theme.customColors.border.primary}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: theme.customColors.shadow.secondary,
                    '&:hover': {
                      boxShadow: theme.customColors.shadow.primary,
                      border: `2px solid ${theme.customColors.primary.main}`,
                    },
                  }}
                >
                  {/* Header da Lista */}
                  <Box sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    background: alpha(theme.customColors.primary.main, 0.05),
                    borderBottom: `1px solid ${theme.customColors.border.primary}`,
                  }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 2,
                    }}>
                      <Box>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            color: theme.customColors.text.primary,
                            mb: 0.5,
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                          }}
                        >
                          {list.name}
                        </Typography>
                        {list.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.customColors.text.secondary,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            }}
                          >
                            {list.description}
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Botão de Fechamento de Estoque da Lista */}
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleCloseStock(list._id, list.name)}
                        disabled={closingStock[list._id]}
                        startIcon={closingStock[list._id] ? <CircularProgress size={20} color="inherit" /> : <InventoryIcon />}
                        sx={{
                          borderRadius: 1,
                          px: 3,
                          py: 1,
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                          fontWeight: 600,
                          boxShadow: theme.customColors.shadow.secondary,
                          background: theme.customColors.status.warning,
                          '&:hover': {
                            background: theme.customColors.status.warning,
                            boxShadow: theme.customColors.shadow.primary,
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            background: theme.customColors.status.warning,
                            opacity: 0.7,
                          },
                        }}
                      >
                        {closingStock[list._id] ? 'Fechando...' : 'Fechar Estoque'}
                      </Button>
                    </Box>
                  </Box>

                  {/* Produtos da Lista */}
                  <Box sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                  }}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                        xl: 'repeat(5, 1fr)'
                      },
                      gap: { xs: 2, sm: 3, md: 4 },
                    }}>
                      {listProducts.map((item) => {
                        const product = item.product;
                        if (!product) return null;

                        return (
                          <Fade in key={product._id} timeout={400}>
                            <Card
                              sx={{
                                background: theme.customColors.surface.card,
                                border: `1.5px solid ${(item.availableQuantity || 0) === 0 ? theme.customColors.status.error : theme.customColors.border.primary}`,
                                borderRadius: 1,
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: theme.customColors.shadow.secondary,
                                opacity: (item.availableQuantity || 0) === 0 ? 0.6 : 1,
                                '&:hover': {
                                  boxShadow: theme.customColors.shadow.primary,
                                  border: `2px solid ${(item.availableQuantity || 0) === 0 ? theme.customColors.status.error : theme.customColors.primary.main}`,
                                  transform: (item.availableQuantity || 0) === 0 ? 'none' : 'translateY(-4px) scale(1.02)',
                                },
                                minHeight: { xs: '280px', sm: '320px', md: '360px' },
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
                                  transition: 'transform 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                  },
                                }}
                              />
                              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, pb: { xs: 1.5, sm: 2 } }}>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  sx={{
                                    fontWeight: 700,
                                    color: theme.customColors.text.primary,
                                    mb: 1,
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                    lineHeight: 1.3,
                                    minHeight: '2.4em',
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
                                    mb: 1.5,
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
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
                                
                                <Box sx={{ mb: 1.5 }}>
                                  <Typography variant="h6" sx={{ 
                                    fontWeight: 700, 
                                    color: theme.customColors.status.success,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                  }}>
                                    R$ {product.finalPrice?.toFixed(2) || '0.00'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    color: theme.customColors.status.warning,
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                  }}>
                                    Comissão: R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                  <Chip
                                    label={product.category}
                                    size="small"
                                    sx={{
                                      background: alpha(theme.customColors.primary.main, 0.1),
                                      color: theme.customColors.primary.main,
                                      fontWeight: 600,
                                      fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                    }}
                                  />
                                  {(item.availableQuantity || 0) === 0 && (
                                    <Chip
                                      label="ESGOTADO"
                                      size="small"
                                      sx={{
                                        background: alpha(theme.customColors.status.error, 0.1),
                                        color: theme.customColors.status.error,
                                        fontWeight: 'bold',
                                        fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                      }}
                                    />
                                  )}
                                  <Typography variant="body2" color="text.secondary" sx={{ 
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    fontWeight: 600,
                                  }}>
                                    Disponível: {item.availableQuantity || 0}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Fade>
                        );
                      })}
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default UserStockLists;