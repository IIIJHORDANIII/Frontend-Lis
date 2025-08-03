import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCustomLists, deleteCustomList } from '../services/api';
import { CustomList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ShareListDialog from './ShareListDialog';

const DEFAULT_IMAGE = 'https://via.placeholder.com/150x200/2d3748/ffffff?text=Produto';

const CustomLists: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, isAdmin } = useAuth();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadLists();
  }, [isAuthenticated, navigate]);

  const loadLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomLists();
      setLists(data);
    } catch (err) {
      setError('Erro ao carregar listas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta lista?')) {
      try {
        await deleteCustomList(listId);
        setLists(lists.filter(list => list._id !== listId));
      } catch (err) {
        setError('Erro ao excluir lista. Tente novamente.');
      }
    }
  };

  const handleShare = (listId: string) => {
    setSelectedListId(listId);
    setShareModalOpen(true);
  };

  const handleShareClose = () => {
    setShareModalOpen(false);
    setSelectedListId('');
  };

  const handleShareSuccess = () => {
    handleShareClose();
    loadLists();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
        minHeight: '50vh' 
      }}>
        <CircularProgress size={60} sx={{ color: theme.customColors.text.primary }} />
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
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            maxWidth: { xs: 340, sm: 400, md: 700, xl: 900 },
            width: '100%',
            mx: 'auto',
          }}>
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
              Listas Personalizadas
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
              Gerencie suas listas de produtos personalizadas
            </Typography>
          </Box>
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
              background: alpha(theme.customColors.status.error, 0.1),
              border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
              color: theme.customColors.status.error,
              '& .MuiAlert-icon': {
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/custom-lists/create')}
            sx={{
              py: { xs: 1.5, sm: 2 },
              px: { xs: 3, sm: 4 },
              borderRadius: 1,
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
              color: theme.customColors.text.inverse,
              boxShadow: theme.customColors.shadow.secondary,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: theme.customColors.shadow.primary,
                background: `linear-gradient(135deg, ${theme.customColors.primary.light} 0%, ${theme.customColors.primary.main} 100%)`,
              },
            }}
          >
            Nova Lista
          </Button>
        </Box>

        {lists.length === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4,
              borderRadius: 1,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              maxWidth: 900,
              mx: 'auto',
              boxShadow: theme.customColors.shadow.secondary,
              background: alpha(theme.customColors.status.info, 0.1),
              border: `1px solid ${alpha(theme.customColors.status.info, 0.3)}`,
              color: theme.customColors.status.info,
              '& .MuiAlert-icon': {
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }
            }}
          >
            Nenhuma lista encontrada. Crie sua primeira lista personalizada!
          </Alert>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            width: '100%',
            maxWidth: 1400,
            mx: 'auto'
          }}>
            {lists.map((list) => (
              <Fade in key={list._id} timeout={400}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: theme.customColors.surface.card,
                  border: `1.5px solid ${theme.customColors.border.primary}`,
                  borderRadius: 1,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: theme.customColors.shadow.secondary,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.customColors.shadow.primary,
                    border: `2px solid ${theme.customColors.primary.main}`
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 3 } }}>
                    <Typography variant="h6" component="h2" sx={{
                      fontWeight: 'bold',
                      color: theme.customColors.text.primary,
                      mb: 2,
                      lineHeight: 1.3,
                      minHeight: '2.6em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    }}>
                      {list.name}
                    </Typography>
                    
                    {list.description && (
                      <Typography variant="body2" sx={{ 
                        mb: 2,
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: theme.customColors.text.secondary,
                      }}>
                        {list.description}
                      </Typography>
                    )}

                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        icon={<PersonIcon />}
                        label={list.createdBy?.name || 'Usuário'}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.customColors.text.primary, 0.1),
                          color: theme.customColors.text.primary,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          height: { xs: 20, sm: 24, md: 28 },
                        }}
                      />
                      <Chip
                        label={list.isPublic ? 'Pública' : 'Privada'}
                        size="small"
                        sx={{
                          backgroundColor: list.isPublic ? theme.customColors.primary.main : alpha(theme.customColors.text.primary, 0.1),
                          color: list.isPublic ? theme.customColors.text.inverse : theme.customColors.text.primary,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          height: { xs: 20, sm: 24, md: 28 },
                        }}
                      />
                    </Box>

                    <Accordion sx={{ 
                      boxShadow: 'none', 
                      border: `1px solid ${theme.customColors.border.primary}`,
                      borderRadius: 1,
                      '&:before': {
                        display: 'none',
                      },
                    }}>
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon sx={{ color: theme.customColors.text.primary }} />}
                        sx={{ 
                          backgroundColor: alpha(theme.customColors.text.primary, 0.05),
                          minHeight: { xs: '40px', sm: '48px', md: '56px' },
                        }}
                      >
                        <Typography sx={{ 
                          color: theme.customColors.text.primary, 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        }}>
                          Produtos ({list.products?.length || 0})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
                        <List dense>
                          {list.products?.map((productItem, index) => (
                            <React.Fragment key={productItem.productId || index}>
                              <ListItem sx={{ px: 0, py: { xs: 0.5, sm: 1 } }}>
                                <ListItemAvatar>
                                  <Avatar
                                    src={productItem.product?.image || DEFAULT_IMAGE}
                                    alt={productItem.product?.name || 'Produto'}
                                    sx={{ 
                                      width: { xs: 32, sm: 36, md: 40 }, 
                                      height: { xs: 32, sm: 36, md: 40 },
                                      border: `2px solid ${theme.customColors.border.primary}`
                                    }}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography sx={{ 
                                      color: theme.customColors.text.primary, 
                                      fontWeight: 'bold',
                                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                    }}>
                                      {productItem.product?.name || 'Produto não encontrado'}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box>
                                      <Typography variant="body2" sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                                        color: theme.customColors.text.secondary,
                                      }}>
                                        {formatPrice(productItem.product?.finalPrice || 0)}
                                      </Typography>
                                        <Typography variant="body2" sx={{ 
                                          color: theme.customColors.text.primary,
                                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                                        }}>
                                        Qtd: {productItem.quantity}
                                        </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                              {index < (list.products?.length || 0) - 1 && <Divider />}
                            </React.Fragment>
                          )) || (
                            <Typography variant="body2" sx={{ 
                              textAlign: 'center', 
                              py: 2,
                              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                              color: theme.customColors.text.secondary,
                            }}>
                              Nenhum produto nesta lista
                            </Typography>
                          )}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                  <CardActions sx={{ 
                    p: { xs: 1, sm: 1.5, md: 2 }, 
                    pt: 0,
                    gap: { xs: 0.5, sm: 1 },
                  }}>
                    <Button
                      size="small"
                      startIcon={<ShareIcon />}
                      onClick={() => handleShare(list._id)}
                      sx={{
                        color: theme.customColors.text.primary,
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                        minHeight: { xs: '32px', sm: '36px', md: '40px' },
                        '&:hover': {
                          backgroundColor: alpha(theme.customColors.text.primary, 0.1),
                        }
                      }}
                    >
                      Compartilhar
                    </Button>
                    {isAdmin && (
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(list._id)}
                        sx={{
                          color: theme.customColors.status.error,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          minHeight: { xs: '32px', sm: '36px', md: '40px' },
                          '&:hover': {
                            backgroundColor: alpha(theme.customColors.status.error, 0.1),
                          }
                        }}
                      >
                        Excluir
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Fade>
            ))}
          </Box>
        )}

        <ShareListDialog
          open={shareModalOpen}
          onClose={handleShareClose}
          onSuccess={handleShareSuccess}
          listId={selectedListId}
        />
      </Container>
    </Box>
  );
};

export default CustomLists;