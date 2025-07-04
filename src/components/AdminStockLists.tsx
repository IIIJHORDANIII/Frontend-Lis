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
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { getCustomLists } from '../services/api';
import { Product, CustomList } from '../types';

const AdminStockLists: React.FC = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
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
      <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', justifyContent: 'center', mt: 4, background: 'transparent' }}>
        <CircularProgress sx={{ color: '#2d3748' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, background: 'transparent' }}>
        <Alert severity="error" sx={{ backgroundColor: '#ffebee', borderLeft: '4px solid #2d3748' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!lists.length) {
    return (
      <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, background: 'transparent' }}>
        <Alert severity="info" sx={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2d3748' }}>
          Nenhuma lista encontrada.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: { xs: 2, sm: 4 }, mb: 4, background: 'transparent' }}>
      <Box sx={{ 
        mb: { xs: 2, sm: 4 },
        p: { xs: 1, sm: 3 },
        backgroundColor: '#2d3748',
        borderRadius: { xs: 2, sm: 3 },
        color: 'white',
        width: { xs: '100%', sm: 'auto' },
        maxWidth: { xs: 360, sm: 600, md: '100%' },
        mx: { xs: 'auto', sm: 0 },
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', sm: '2rem' }, color: 'white' }}>
          Listas de Estoque
        </Typography>
      </Box>
      
      {lists.map((list) => (
        <Accordion
          key={list._id}
          expanded={expanded === list._id}
          onChange={() => handleAccordionChange(list._id)}
          sx={{
            boxShadow: 'none',
            border: '1.5px solid #2d3748',
            borderRadius: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 3 },
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: 360, sm: 600, md: '100%' },
            mx: { xs: 'auto', sm: 0 },
            background: '#fff',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#2d3748', fontSize: { xs: 20, sm: 28 } }} />}
            sx={{ backgroundColor: '#f7fafc', p: { xs: 1, sm: 2 }, borderRadius: { xs: 2, sm: 3 } }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', width: '100%' }}>
              <Tooltip title="Editar lista">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditList(list._id);
                  }}
                  sx={{
                    color: '#2d3748',
                    fontSize: { xs: 18, sm: 22 },
                    p: 0.5,
                    mr: 0.5,
                    background: '#f7fafc',
                    '&:hover': {
                      backgroundColor: 'rgba(45, 55, 72, 0.1)'
                    }
                  }}
                  size="small"
                >
                  <EditIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                </IconButton>
              </Tooltip>
              <Chip
                icon={<PersonIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                label={list.createdBy?.name || 'Usuário'}
                size="small"
                sx={{
                  backgroundColor: '#2d3748',
                  color: 'white',
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                  height: { xs: 22, sm: 28 },
                  mr: 0.5,
                  boxShadow: 'none',
                }}
              />
              <Chip
                icon={list.isPublic ? <PublicIcon sx={{ fontSize: { xs: 16, sm: 20 } }} /> : <LockIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                label={list.isPublic ? 'Pública' : 'Privada'}
                size="small"
                sx={{
                  backgroundColor: list.isPublic ? '#e3fcec' : '#f7fafc',
                  color: list.isPublic ? '#22543d' : '#2d3748',
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                  height: { xs: 22, sm: 28 },
                  mr: 0.5,
                  boxShadow: 'none',
                  border: list.isPublic ? '1px solid #38a169' : '1px solid #2d3748',
                }}
              />
              <Chip
                label={`${list.products?.length || 0} produtos`}
                size="small"
                sx={{
                  backgroundColor: '#edf2f7',
                  color: '#2d3748',
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                  height: { xs: 22, sm: 28 },
                  boxShadow: 'none',
                  border: '1px solid #cbd5e1',
                }}
              />
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: { xs: 1, sm: 3 }, background: '#fff', borderRadius: { xs: 2, sm: 3 } }}>
            {list.description && (
              <Typography variant="body1" sx={{ mb: 2, color: '#2d3748', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
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
                gap: { xs: 1, sm: 2 },
                width: '100%',
                maxWidth: { xs: 360, sm: 600, md: '100%' },
                mx: { xs: 'auto', sm: 0 },
                background: '#f7fafc',
                borderRadius: { xs: 2, sm: 3 },
                p: { xs: 1, sm: 2 },
              }}>
                {list.products.map((product: Product) => (
                  <Card key={product._id} sx={{
                    border: '1px solid #d9d9d9',
                    transition: 'all 0.3s ease',
                    borderRadius: { xs: 1, sm: 2 },
                    boxShadow: 'none',
                    '&:hover': {
                      border: '1px solid #2d3748',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(45, 55, 72, 0.15)'
                    },
                    maxWidth: { xs: 340, sm: 400, md: 500 },
                    mx: { xs: 'auto', sm: 0 },
                  }}>
                    {product.image && (
                      <CardMedia
                        component="img"
                        height={54}
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'cover', borderTopLeftRadius: { xs: 1, sm: 2 }, borderTopRightRadius: { xs: 1, sm: 2 } }}
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
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                          <Typography variant="body2" sx={{ color: '#2d3748', fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.9rem' } }}>
                            R$ {product.price.toFixed(2)}
                          </Typography>
                          {product.quantity !== undefined && (
                            <Chip
                              label={`Qtd: ${product.quantity}`}
                              size="small"
                              sx={{
                                backgroundColor: product.quantity > 0 ? '#2d3748' : '#d9d9d9',
                                color: product.quantity > 0 ? 'white' : '#2d3748',
                                fontSize: { xs: '0.65rem', sm: '0.8rem' },
                                height: { xs: 18, sm: 22 },
                                ml: 0.5
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Esta lista não possui produtos.
              </Typography>
            )}
            
            {list.sharedWith && list.sharedWith.length > 0 && (
              <>
                <Divider sx={{ my: 3, backgroundColor: '#d9d9d9' }} />
                <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 'bold', mb: 2 }}>
                  Compartilhada com:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {list.sharedWith.map((user, index) => (
                    <Chip
                      key={index}
                      avatar={<Avatar sx={{ backgroundColor: '#2d3748' }}><PersonIcon /></Avatar>}
                      label={typeof user === 'string' ? user : (user.name || user.email)}
                      sx={{
                        backgroundColor: '#d9d9d9',
                        color: '#2d3748'
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default AdminStockLists;