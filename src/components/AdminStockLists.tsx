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
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { getCustomLists } from '../services/api';
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

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'white',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

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
              background: 'rgba(255,255,255,0.13)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.22)',
              '@media (min-width: 1600px)': {
                maxWidth: 1100,
                p: 6,
              },
              '@media (min-width: 1920px)': {
                maxWidth: 1300,
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
                Listas de Estoque
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
                Gerencie todas as listas de produtos do sistema
              </Typography>
            </Box>
          </Paper>
        </Fade>
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
        {!lists.length && !loading && (
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
            Nenhuma lista encontrada.
          </Alert>
        )}
        {/* Lists */}
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
          {lists.map((list, index) => (
            <Fade in timeout={400 + index * 100} key={list._id}>
              <Accordion
                expanded={expanded === list._id}
                onChange={() => handleAccordionChange(list._id)}
                sx={{
                  background: 'rgba(255,255,255,0.97)',
                  border: '1.5px solid rgba(102,126,234,0.10)',
                  borderRadius: 3,
                  mb: { xs: 3, sm: 4 },
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(102,126,234,0.18)',
                    border: '2px solid #764ba2',
                    transform: 'translateY(-8px) scale(1.04)',
                  },
                  p: 0,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-content-${list._id}`}
                  id={`panel-header-${list._id}`}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 2, sm: 3 },
                    background: 'rgba(255,255,255,0.13)',
                    borderBottom: '1px solid rgba(102,126,234,0.10)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        flex: 1
                      }}
                    >
                      {list.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${list.products?.length || 0} produtos`}
                        size="small"
                        sx={{
                          background: theme.palette.info.light,
                          color: theme.palette.info.dark,
                          fontSize: { xs: '0.7rem', sm: '0.9rem' },
                          height: { xs: 24, sm: 32 },
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
                  {list.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        color: theme.palette.text.secondary, 
                        fontStyle: 'italic',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      {list.description}
                    </Typography>
                  )}
                  {list.products && list.products.length > 0 ? (
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
                      {list.products.map((product) => (
                        <Card
                          key={product._id}
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
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                <strong>Custo:</strong> <span style={{ color: theme.palette.error.main }}>R$ {product.costPrice.toFixed(2)}</span>
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                <strong>Venda:</strong> <span style={{ color: theme.palette.success.main }}>R$ {product.finalPrice.toFixed(2)}</span>
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                <strong>Comissão:</strong> <span style={{ color: theme.palette.warning.main }}>R$ {product.commission.toFixed(2)}</span>
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                <strong>Lucro:</strong> <span style={{ color: theme.palette.info.main }}>R$ {product.profit.toFixed(2)}</span>
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
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
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: theme.palette.text.secondary 
                    }}>
                      <Typography variant="body1">
                        Esta lista não possui produtos.
                      </Typography>
                    </Box>
                  )}
                  {/* Botão editar lista para admin na parte de baixo */}
                  {isAdmin && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <IconButton
                        onClick={() => handleEditList(list._id)}
                        sx={{
                          background: 'rgba(102,126,234,0.10)',
                          color: theme.palette.primary.main,
                          '&:hover': {
                            background: theme.palette.primary.main,
                            color: 'white',
                            transform: 'scale(1.1)',
                          },
                          zIndex: 2
                        }}
                        size="small"
                      >
                        <EditIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default AdminStockLists;