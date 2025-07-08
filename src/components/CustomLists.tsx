import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Chip,
  CardMedia,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
// Remove this line:
// import Grid2 from '@mui/material/Unstable_Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import { api } from '../services/api';
import { CustomList } from '../types';
import ShareListDialog from './ShareListDialog';
import { formatPrice } from '../utils/format';

const DEFAULT_IMAGE = 'https://via.placeholder.com/150';

const CustomLists: React.FC = () => {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadLists = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      const userRole = localStorage.getItem('userRole');
      setIsAdmin(userRole === 'admin');

      const response = await api.get('/custom-lists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLists(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar listas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleDelete = async (listId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta lista?')) {
      return;
    }

    try {
      await api.delete(`/custom-lists/${listId}`);
      setLists(lists.filter(list => list._id !== listId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir lista');
    }
  };

  const handleShare = (listId: string) => {
    setSelectedListId(listId);
    setShareModalOpen(true);
  };

  const handleShareClose = () => {
    setShareModalOpen(false);
    setSelectedListId(null);
  };

  const handleShareSuccess = () => {
    loadLists();
    handleShareClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        mb: 4,
        p: 3,
        backgroundColor: '#383A29',
        borderRadius: 2,
        color: 'white'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Minhas Listas Personalizadas
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#383A29' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#ffebee', borderLeft: '4px solid #383A29' }}>
          {error}
        </Alert>
      )}

      {!loading && lists.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#d9d9d9' }}>
          <Typography variant="h6" color="#383A29">
            Você ainda não criou nenhuma lista personalizada.
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {lists.map((list) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={list._id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              border: '2px solid transparent',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(56, 58, 41, 0.15)',
                border: '2px solid #383A29'
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" sx={{
                  fontWeight: 'bold',
                  color: '#383A29',
                  mb: 2,
                  lineHeight: 1.3,
                  minHeight: '2.6em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {list.name}
                </Typography>
                
                {list.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {list.description}
                  </Typography>
                )}

                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<PersonIcon />}
                    label={list.createdBy?.name || 'Usuário'}
                    size="small"
                    sx={{
                      backgroundColor: '#d9d9d9',
                      color: '#383A29',
                      mr: 1
                    }}
                  />
                  <Chip
                    label={list.isPublic ? 'Pública' : 'Privada'}
                    size="small"
                    sx={{
                      backgroundColor: list.isPublic ? '#383A29' : '#d9d9d9',
                      color: list.isPublic ? 'white' : '#383A29'
                    }}
                  />
                </Box>

                <Accordion sx={{ boxShadow: 'none', border: '1px solid #d9d9d9' }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon sx={{ color: '#383A29' }} />}
                    sx={{ backgroundColor: '#f5f5f5' }}
                  >
                    <Typography sx={{ color: '#383A29', fontWeight: 'bold' }}>
                      Produtos ({list.products?.length || 0})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {list.products?.map((product, index) => (
                        <React.Fragment key={product._id || index}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                src={product.image || DEFAULT_IMAGE}
                                alt={product.name}
                                sx={{ 
                                  width: 40, 
                                  height: 40,
                                  border: '2px solid #d9d9d9'
                                }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography sx={{ color: '#383A29', fontWeight: 'bold' }}>
                                  {product.name}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatPrice(product.finalPrice)}
                                  </Typography>
                                  {product.quantity && (
                                    <Typography variant="body2" sx={{ color: '#383A29' }}>
                                      Qtd: {product.quantity}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < (list.products?.length || 0) - 1 && <Divider />}
                        </React.Fragment>
                      )) || (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          Nenhum produto nesta lista
                        </Typography>
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {list.sharedWith && list.sharedWith.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#383A29', fontWeight: 'bold', mb: 1 }}>
                      Compartilhada com:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {list.sharedWith.map((user, index) => (
                        <Chip
                          key={index}
                          label={typeof user === 'string' ? user : (user.name || user.email)}
                          size="small"
                          sx={{
                            backgroundColor: '#383A29',
                            color: 'white'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<ShareIcon />}
                  onClick={() => handleShare(list._id)}
                  sx={{
                    color: '#383A29',
                    '&:hover': {
                      backgroundColor: '#d9d9d9'
                    }
                  }}
                >
                  Compartilhar
                </Button>
                {(isAdmin || list.createdBy?._id === localStorage.getItem('userId')) && (
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(list._id)}
                    sx={{
                      color: '#d32f2f',
                      '&:hover': {
                        backgroundColor: '#ffebee'
                      }
                    }}
                  >
                    Excluir
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ShareListDialog
        open={shareModalOpen}
        onClose={handleShareClose}
        onSuccess={handleShareSuccess}
        listId={selectedListId}
      />
    </Box>
  );
};

export default CustomLists;