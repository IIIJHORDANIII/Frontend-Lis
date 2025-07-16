import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha,
  Alert
} from '@mui/material';
import { getCustomLists } from '../services/api';
import { CustomList } from '../types';

const CustomListDisplay: React.FC = () => {
  const theme = useTheme();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const data = await getCustomLists();
        setLists(data);
      } catch (err) {
        setError('Failed to fetch custom lists');
      }
    };
    fetchLists();
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ 
          mb: 4,
          p: 3,
          background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
          borderRadius: 3,
          color: theme.customColors.text.inverse,
          boxShadow: theme.customColors.shadow.secondary,
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem', xl: '2.5rem' },
            lineHeight: 1.2,
            '@media (min-width: 1600px)': {
              fontSize: '2.75rem',
            },
            '@media (min-width: 1920px)': {
              fontSize: '3rem',
            },
          }}>
            Minhas Listas Personalizadas
          </Typography>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              background: alpha(theme.customColors.status.error, 0.1),
              border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
              color: theme.customColors.status.error,
              '& .MuiAlert-icon': {
                fontSize: '1.25rem'
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {lists.map((list) => (
            <Card key={list._id} sx={{ 
              width: '100%',
              background: theme.customColors.surface.card,
              border: `1.5px solid ${theme.customColors.border.primary}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              boxShadow: theme.customColors.shadow.secondary,
              '&:hover': {
                border: `1.5px solid ${theme.customColors.primary.main}`,
                transform: 'translateY(-4px)',
                boxShadow: theme.customColors.shadow.primary,
              }
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: theme.customColors.text.primary,
                  fontWeight: 700,
                  borderBottom: `2px solid ${theme.customColors.border.primary}`,
                  pb: 1,
                  mb: 2,
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                }}>
                  {list.name}
                </Typography>
                <List>
                  {list.products.map((product) => (
                    <ListItem key={product._id} sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      border: `1px solid ${theme.customColors.border.primary}`,
                      '&:hover': {
                        backgroundColor: alpha(theme.customColors.primary.main, 0.05),
                        borderColor: theme.customColors.primary.main,
                      }
                    }}>
                      <ListItemText
                        primary={
                          <Typography sx={{ 
                            color: theme.customColors.text.primary, 
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                          }}>
                            {product.name}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ 
                            color: theme.customColors.status.success,
                            fontWeight: 700,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                          }}>
                            R$ {product.finalPrice.toFixed(2)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default CustomListDisplay;