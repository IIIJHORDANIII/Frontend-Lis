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
  Container,
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

  const handleAccordionChange = (listId: string) => {
    setExpanded(expanded === listId ? null : listId);
  };

  const handleEditList = (listId: string) => {
    navigate(`/edit-list/${listId}`);
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

  if (!lists.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #383A29' }}>
          Nenhuma lista encontrada.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        mb: 4,
        p: 3,
        backgroundColor: '#383A29',
        borderRadius: 2,
        color: 'white'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Listas de Estoque
        </Typography>
      </Box>
      
      {lists.map((list) => (
        <Accordion
          key={list._id}
          expanded={expanded === list._id}
          onChange={() => handleAccordionChange(list._id)}
          sx={{
            mb: 2,
            border: '2px solid #d9d9d9',
            borderRadius: 2,
            '&:before': {
              display: 'none'
            },
            '&.Mui-expanded': {
              border: '2px solid #383A29'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#383A29' }} />}
            sx={{
              backgroundColor: '#f5f5f5',
              '&.Mui-expanded': {
                backgroundColor: '#d9d9d9'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#383A29', fontWeight: 'bold', flexGrow: 1 }}>
                {list.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Tooltip title="Editar lista">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditList(list._id);
                    }}
                    sx={{
                      color: '#383A29',
                      '&:hover': {
                        backgroundColor: 'rgba(56, 58, 41, 0.1)'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                
                <Chip
                  icon={<PersonIcon />}
                  label={list.createdBy?.name || 'Usuário'}
                  size="small"
                  sx={{
                    backgroundColor: '#383A29',
                    color: 'white'
                  }}
                />
                <Chip
                  icon={list.isPublic ? <PublicIcon /> : <LockIcon />}
                  label={list.isPublic ? 'Pública' : 'Privada'}
                  size="small"
                  sx={{
                    backgroundColor: list.isPublic ? '#4caf50' : '#d9d9d9',
                    color: list.isPublic ? 'white' : '#383A29'
                  }}
                />
                <Chip
                  label={`${list.products?.length || 0} produtos`}
                  size="small"
                  sx={{
                    backgroundColor: '#d9d9d9',
                    color: '#383A29'
                  }}
                />
              </Box>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 3 }}>
            {list.description && (
              <Typography variant="body1" sx={{ mb: 3, color: '#383A29' }}>
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
                gap: 2
              }}>
                {list.products.map((product: Product) => (
                  <Card key={product._id} sx={{
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
                        height="120"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ p: 2 }}>
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
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.description}
                      </Typography>
                      
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
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Esta lista não possui produtos.
              </Typography>
            )}
            
            {list.sharedWith && list.sharedWith.length > 0 && (
              <>
                <Divider sx={{ my: 3, backgroundColor: '#d9d9d9' }} />
                <Typography variant="h6" sx={{ color: '#383A29', fontWeight: 'bold', mb: 2 }}>
                  Compartilhada com:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {list.sharedWith.map((user, index) => (
                    <Chip
                      key={index}
                      avatar={<Avatar sx={{ backgroundColor: '#383A29' }}><PersonIcon /></Avatar>}
                      label={typeof user === 'string' ? user : (user.name || user.email)}
                      sx={{
                        backgroundColor: '#d9d9d9',
                        color: '#383A29'
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default AdminStockLists;