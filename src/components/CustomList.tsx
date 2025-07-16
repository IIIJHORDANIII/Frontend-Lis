import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box
} from '@mui/material';
import { CustomList as CustomListType } from '../types';

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

interface CustomListProps {
  list: CustomListType;
  onShare: (listId: string) => void;
}

const CustomList: React.FC<CustomListProps> = ({ list }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
      {list.products.map((productItem) => (
        <Card key={productItem.productId} sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
          <CardMedia
            component="img"
            width="100%"
            sx={{
              objectFit: 'cover',
              aspectRatio: '3/5'
            }}
            image={productItem.product?.image || DEFAULT_IMAGE}
            alt={productItem.product?.name || 'Produto'}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
          <CardContent sx={{ flexGrow: 1, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
                {productItem.product?.name || 'Produto não encontrado'}
          </Typography>
              <Typography variant="h6" color="primary">
                {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
                }).format(productItem.product?.finalPrice || 0)}
              </Typography>
        </Box>
            <Typography variant="body2" color="text.secondary">
              {productItem.product?.description || ''}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Quantidade: {productItem.quantity}
            </Typography>
          </CardContent>
        </Card>
              ))}
            </Box>
  );
};

export default CustomList; 