import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Alert,
  Avatar,
  Fade,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  alpha,
  Stack,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart,
  Description,
  AttachMoney,
  CloudUpload,
  Image as ImageIcon
} from '@mui/icons-material';
import { createProduct } from '../services/api';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    commission: '',
    quantity: '',
    category: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação dos campos obrigatórios
    if (!formData.name.trim()) {
      setError('Nome do produto é obrigatório');
      return;
    }
    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Preço deve ser maior que zero');
      return;
    }
    if (!formData.commission || parseFloat(formData.commission) < 0) {
      setError('Comissão deve ser maior ou igual a zero');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('Quantidade deve ser maior ou igual a zero');
      return;
    }
    if (!formData.category) {
      setError('Categoria é obrigatória');
      return;
    }
    
    setLoading(true);
    
    try {
      const productData = new FormData();
      productData.append('name', formData.name.trim());
      productData.append('description', formData.description.trim());
      productData.append('price', formData.price);
      productData.append('commission', formData.commission);
      productData.append('quantity', formData.quantity);
      productData.append('category', formData.category);
      if (image) {
        productData.append('image', image);
      }
  
      await createProduct(productData);
      navigate('/admin/products');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(`Erro: ${err.response.data.message}`);
      } else if (err.response?.data?.error) {
        setError(`Erro: ${err.response.data.error}`);
      } else if (err.message) {
        setError(`Erro: ${err.message}`);
      } else {
        setError('Falha ao criar produto. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
              }
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: '0 8px 32px rgba(56, 58, 41, 0.3)'
                }}
              >
                <ShoppingCart sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 1
                }}
              >
                Novo Produto
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Adicione um novo produto ao estoque
              </Typography>
            </Box>

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

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Nome do Produto"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ShoppingCart sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    label="Preço"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    label="Comissão (%)"
                    name="commission"
                    type="number"
                    value={formData.commission}
                    onChange={handleChange}
                    required
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    label="Quantidade"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ShoppingCart sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl component="fieldset" sx={{ flex: 1 }} required>
                    <FormLabel component="legend">Categoria</FormLabel>
                  <RadioGroup
                    row
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                    <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
                    <FormControlLabel value="infantil" control={<Radio />} label="Infantil" />
                  </RadioGroup>
                </FormControl>
                </Box>
                
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                      component="span"
                    startIcon={<CloudUpload />}
                    sx={{
                        width: '100%',
                        py: 2,
                        border: '2px dashed',
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                      '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                      {image ? 'Imagem Selecionada' : 'Selecionar Imagem'}
                  </Button>
                  </label>
                  
                  {imagePreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          border: '2px solid',
                          borderColor: theme.palette.primary.main
                        }}
                      />
                    </Box>
                  )}
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                  size="large"
                disabled={loading}
                sx={{
                    py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  },
                  '&:disabled': {
                      background: theme.palette.grey[300],
                      color: theme.palette.grey[500]
                  }
                }}
              >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Criar Produto'
                  )}
              </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ProductForm;