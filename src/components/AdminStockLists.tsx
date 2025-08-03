import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
  Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';
import { getCustomLists, initializeCustomListStock } from '../services/api';
import { Product, CustomList } from '../types';
import { useAuth } from '../contexts/AuthContext';

const AdminStockLists: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [lists, setLists] = useState<CustomList[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initializingStock, setInitializingStock] = useState<boolean>(false);
  const { isAdmin } = useAuth();

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

  const handleAccordionChange = (listId: string) => {
    setExpanded(expanded === listId ? null : listId);
  };

  const handleEditList = (listId: string) => {
    navigate(`/edit-list/${listId}`);
  };

  const handleInitializeStock = async () => {
    try {
      setInitializingStock(true);
      setError(null);
      
      const result = await initializeCustomListStock();
      setSuccess(result.message);
      
      // Recarregar listas após inicializar estoque
      const data = await getCustomLists();
      setLists(data);
    } catch (err) {
      setError('Erro ao inicializar estoque. Tente novamente.');
    } finally {
      setInitializingStock(false);
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
              maxWidth: { xs: 340, sm: 400, md: 700, xl: 800 },
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
                maxWidth: 1000,
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
                  color: theme.customColors.text.primary,
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
                Listas de Estoque
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.customColors.text.secondary,
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
                Gerencie todas as listas de produtos do sistema
              </Typography>
              
              {/* Botão para inicializar estoque */}
              <Button
                variant="contained"
                startIcon={<InventoryIcon />}
                onClick={handleInitializeStock}
                disabled={initializingStock}
                sx={{
                  mt: 2,
                  px: 3,
                  py: 1.5,
                  borderRadius: 1,
                  background: theme.customColors.primary.main,
                  color: theme.customColors.primary.contrastText,
                  '&:hover': {
                    background: theme.customColors.primary.dark,
                  },
                  '&:disabled': {
                    background: alpha(theme.customColors.text.primary, 0.1),
                    color: alpha(theme.customColors.text.primary, 0.5),
                  }
                }}
              >
                {initializingStock ? 'Inicializando...' : 'Inicializar Estoque'}
              </Button>
            </Box>
          </Paper>
        </Fade>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 1,
              background: alpha(theme.customColors.status.error, 0.1),
              border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
              color: theme.customColors.status.error,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {error}
          </Alert>
        )}
        {!lists.length && !loading && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4,
              borderRadius: 1,
              fontSize: '1.1rem',
              maxWidth: 900,
              mx: 'auto',
              boxShadow: theme.customColors.shadow.secondary,
              background: alpha(theme.customColors.status.info, 0.1),
              border: `1px solid ${alpha(theme.customColors.status.info, 0.3)}`,
              color: theme.customColors.status.info,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            Nenhuma lista encontrada.
          </Alert>
        )}
        
        <Box sx={{ width: '100%', maxWidth: 1200 }}>
          {lists.map((list) => (
            <Fade in key={list._id} timeout={400}>
              <Card
                sx={{
                  mb: 3,
                  background: theme.customColors.surface.card,
                  border: `1.5px solid ${theme.customColors.border.primary}`,
                  borderRadius: 1,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: theme.customColors.shadow.secondary,
                  '&:hover': {
                    boxShadow: theme.customColors.shadow.primary,
                    border: `2px solid ${theme.customColors.primary.main}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 700,
                          color: theme.customColors.text.primary,
                          mb: 1,
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
                            mb: 2,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                          }}
                        >
                          {list.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip
                          icon={<PersonIcon />}
                          label={list.createdBy?.name || 'Usuário'}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.customColors.text.primary, 0.1),
                            color: theme.customColors.text.primary,
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          }}
                        />
                        <Chip
                          icon={list.isPublic ? <PublicIcon /> : <LockIcon />}
                          label={list.isPublic ? 'Pública' : 'Privada'}
                          size="small"
                          sx={{
                            backgroundColor: list.isPublic ? theme.customColors.primary.main : alpha(theme.customColors.text.primary, 0.1),
                            color: list.isPublic ? theme.customColors.text.inverse : theme.customColors.text.primary,
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          }}
                        />
                        <Chip
                          label={`${list.products?.length || 0} produtos`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.customColors.status.info, 0.1),
                            color: theme.customColors.status.info,
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          }}
                        />

                      </Box>
                    </Box>
                    <Tooltip title="Editar Lista">
                      <IconButton
                        onClick={() => handleEditList(list._id)}
                        sx={{
                          color: theme.customColors.text.primary,
                          backgroundColor: alpha(theme.customColors.text.primary, 0.05),
                          '&:hover': {
                            backgroundColor: alpha(theme.customColors.text.primary, 0.1),
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Accordion
                    expanded={expanded === list._id}
                    onChange={() => handleAccordionChange(list._id)}
                    sx={{
                      boxShadow: 'none',
                      border: `1px solid ${theme.customColors.border.primary}`,
                      borderRadius: 1,
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: theme.customColors.text.primary }} />}
                      sx={{
                        backgroundColor: alpha(theme.customColors.text.primary, 0.05),
                        minHeight: { xs: '48px', sm: '56px', md: '64px' },
                      }}
                    >
                      <Typography sx={{
                        color: theme.customColors.text.primary,
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
                      }}>
                        Ver Produtos ({list.products?.length || 0})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                      {list.products && list.products.length > 0 ? (
                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)'
                          },
                          gap: 2,
                        }}>
                          {list.products.map((productItem) => (
                            <Card
                              key={productItem.productId}
                              sx={{
                                background: alpha(theme.customColors.text.primary, 0.02),
                                border: `1px solid ${theme.customColors.border.primary}`,
                                borderRadius: 1,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: theme.customColors.shadow.secondary,
                                },
                              }}
                            >
                              {productItem.product?.image && (
                                <CardMedia
                                  component="img"
                                  width="100%"
                                  image={productItem.product.image}
                                  alt={productItem.product.name}
                                  sx={{ 
                                    objectFit: 'cover',
                                    aspectRatio: '3/5'
                                  }}
                                />
                              )}
                              <CardContent sx={{ p: 2 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.customColors.text.primary,
                                    mb: 1,
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    lineHeight: 1.3,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {productItem.product?.name || 'Produto não encontrado'}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: theme.customColors.text.secondary,
                                    mb: 1,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {productItem.product?.description || ''}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      color: theme.customColors.status.success,
                                      fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                  >
                                    R$ {(productItem.product?.finalPrice || 0).toFixed(2)}
                                  </Typography>
                                  <Chip
                                    label={productItem.product?.category || 'N/A'}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                                      color: theme.customColors.primary.main,
                                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                    }}
                                  />
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.customColors.text.secondary,
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                    display: 'block',
                                    mt: 1,
                                  }}
                                >
                                  Quantidade na lista: {productItem.quantity}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.customColors.text.secondary,
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                    display: 'block',
                                    mt: 0.5,
                                  }}
                                >
                                  Estoque disponível: {productItem.displayAvailableQuantity !== undefined ? productItem.displayAvailableQuantity : (productItem.availableQuantity || productItem.quantity)}
                                </Typography>
                                {productItem.product?.quantity !== undefined && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.customColors.text.secondary,
                                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                      display: 'block',
                                      mt: 0.5,
                                    }}
                                  >
                                    Estoque geral: {productItem.product.quantity}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: 'center',
                            py: 4,
                            color: theme.customColors.text.secondary,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                          }}
                        >
                          Nenhum produto nesta lista
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      </Container>
      
      {/* Snackbar para mensagens de sucesso */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccess(null)}
          sx={{ 
            borderRadius: 1,
            background: alpha(theme.customColors.status.success, 0.1),
            border: `1px solid ${alpha(theme.customColors.status.success, 0.3)}`,
            color: theme.customColors.status.success,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminStockLists;