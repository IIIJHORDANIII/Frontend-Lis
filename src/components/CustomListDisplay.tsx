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
  ListItemText
} from '@mui/material';
import { getCustomLists } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CustomList {
  _id: string;
  name: string;
  products: Product[];
}

const CustomListDisplay: React.FC = () => {
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
          backgroundColor: '#383A29',
          borderRadius: 2,
          color: 'white'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Minhas Listas Personalizadas
          </Typography>
        </Box>
        
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2, p: 2, backgroundColor: '#ffebee', borderRadius: 1 }}>
            {error}
          </Typography>
        )}
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {lists.map((list) => (
            <Card key={list._id} sx={{ 
              width: '100%',
              border: '2px solid #d9d9d9',
              transition: 'all 0.3s ease',
              '&:hover': {
                border: '2px solid #383A29',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(56, 58, 41, 0.15)'
              }
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: '#383A29',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #d9d9d9',
                  pb: 1,
                  mb: 2
                }}>
                  {list.name}
                </Typography>
                <List>
                  {list.products.map((product) => (
                    <ListItem key={product._id} sx={{
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: '#f5f5f5',
                      '&:hover': {
                        backgroundColor: '#d9d9d9'
                      }
                    }}>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#383A29', fontWeight: 'bold' }}>
                            {product.name}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: '#383A29' }}>
                            R$ {product.price.toFixed(2)}
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