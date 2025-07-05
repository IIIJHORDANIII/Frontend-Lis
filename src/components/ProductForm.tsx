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
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  ShoppingCart,
  Description,
  AttachMoney,
  CloudUpload,
  Image as ImageIcon,
  TrendingUp
} from '@mui/icons-material';
import { createProduct } from '../services/api';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    costPrice: '',
    quantity: '',
    category: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Função para calcular os valores automaticamente
  const calculateValues = (costPrice: number) => {
    if (!costPrice || costPrice <= 0) return null;
    
    // Fórmula: PreçoVenda = (PreçoCusto * 2) / 0.70
    const finalPrice = (costPrice * 2) / 0.70;
    const commissionAmount = finalPrice * 0.30; // 30% fixo
    const profit = finalPrice - costPrice - commissionAmount;
    
    return {
      finalPrice: finalPrice.toFixed(2),
      commissionAmount: commissionAmount.toFixed(2),
      profit: profit.toFixed(2)
    };
  };

  const calculatedValues = calculateValues(parseFloat(formData.costPrice));

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
    const costPriceValue = parseFloat(formData.costPrice);
    if (!formData.costPrice || isNaN(costPriceValue) || costPriceValue <= 0) {
      setError('Preço de custo deve ser um número maior que zero');
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
      productData.append('costPrice', costPriceValue.toString());
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
      <Container maxWidth="xl" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        px: { xs: 1, sm: 2, md: 3 },
      }}>
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
              background: 'white',
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
                  mb: 1,
                  fontSize: { xs: '1.3rem', sm: '1.7rem', md: '2.5rem' },
                  '@media (min-width: 1600px)': {
                    fontSize: '2.75rem',
                  },
                  '@media (min-width: 1920px)': {
                    fontSize: '3rem',
                  },
                }}
              >
                Novo Produto
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary,
                mb: 2,
                fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                '@media (min-width: 1600px)': {
                  fontSize: '1.25rem',
                },
                '@media (min-width: 1920px)': {
                  fontSize: '1.35rem',
                },
              }}>
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
                
                <TextField
                  label="Preço de Custo (R$)"
                  name="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={handleChange}
                  required
                  inputProps={{ step: "0.01" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Card de exibição dos valores calculados */}
                {calculatedValues && (
                  <Card sx={{ 
                    background: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderRadius: 2
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ 
                        color: theme.palette.primary.main, 
                        fontWeight: 600, 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <TrendingUp />
                        Valores Calculados Automaticamente
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Preço de Venda
                          </Typography>
                          <Typography variant="h6" sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                            R$ {calculatedValues.finalPrice}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Comissão (30%)
                          </Typography>
                          <Typography variant="h6" sx={{ color: theme.palette.warning.main, fontWeight: 600 }}>
                            R$ {calculatedValues.commissionAmount}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Lucro Líquido
                          </Typography>
                          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 600 }}>
                            R$ {calculatedValues.profit}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}
                
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
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 1, 
                      textAlign: 'center',
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem'
                    }}
                  >
                    Formatos aceitos: JPG, PNG, GIF • Máximo: 5MB • Será redimensionada para 9:16
                  </Typography>
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
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          mt: 1, 
                          color: theme.palette.info.main,
                          fontStyle: 'italic'
                        }}
                      >
                        A imagem será automaticamente redimensionada para o formato 9:16
                      </Typography>
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