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
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'Poppins, Inter, Montserrat, Arial',
      }}
    >
      <Fade in>
        <Paper
          elevation={0}
          sx={{
            maxWidth: { xs: '100%', sm: 600, md: 700, lg: 800 },
            width: '100%',
            p: { xs: 3, sm: 4, md: 5, lg: 6 },
            borderRadius: 1,
            boxShadow: theme.customColors.shadow.primary,
            background: theme.customColors.surface.card,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.customColors.border.primary}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`
            }
          }}
        >
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
                  color: theme.customColors.text.inverse,
                  boxShadow: theme.customColors.shadow.secondary
                }}
              >
                <ShoppingCart sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  color: theme.customColors.text.primary,
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
              <Typography variant="body1" sx={{ 
                color: theme.customColors.text.secondary,
                mb: 2,
                fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                '@media (min-width: 1600px)': {
                  fontSize: '1.25rem',
                },
                '@media (min-width: 1920px)': {
                  fontSize: '1.35rem',
                },
              }}>
                Adicione um novo produto ao catálogo
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  borderRadius: 1,
                  background: alpha(theme.customColors.status.error, 0.1),
                  border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
                  color: theme.customColors.status.error,
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
                  fullWidth
                  label="Nome do Produto"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ShoppingCart sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.customColors.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.customColors.text.secondary,
                      '&.Mui-focused': {
                        color: theme.customColors.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.customColors.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customColors.primary.main,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.customColors.text.secondary,
                      '&.Mui-focused': {
                        color: theme.customColors.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.customColors.text.primary,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    fullWidth
                    label="Preço de Custo"
                    name="costPrice"
                    type="number"
                    value={formData.costPrice}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.customColors.primary.main, 0.5),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.customColors.primary.main,
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.customColors.text.secondary,
                        '&.Mui-focused': {
                          color: theme.customColors.primary.main,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: theme.customColors.text.primary,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Quantidade em Estoque"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TrendingUp sx={{ color: alpha(theme.customColors.text.primary, 0.7) }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.customColors.primary.main, 0.5),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.customColors.primary.main,
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.customColors.text.secondary,
                        '&.Mui-focused': {
                          color: theme.customColors.primary.main,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: theme.customColors.text.primary,
                      },
                    }}
                  />
                </Box>

                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ 
                    color: theme.customColors.text.primary,
                    fontWeight: 600,
                    mb: 1
                  }}>
                    Categoria
                  </FormLabel>
                  <RadioGroup
                    row
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    sx={{
                      '& .MuiFormControlLabel-root': {
                        marginRight: 3,
                        '& .MuiRadio-root': {
                          color: alpha(theme.customColors.text.primary, 0.5),
                          '&.Mui-checked': {
                            color: theme.customColors.primary.main,
                          },
                        },
                        '& .MuiFormControlLabel-label': {
                          color: theme.customColors.text.primary,
                          fontWeight: 500,
                        },
                      },
                    }}
                  >
                    <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
                    <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                    <FormControlLabel value="unissex" control={<Radio />} label="Unissex" />
                  </RadioGroup>
                </FormControl>

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
                      fullWidth
                      sx={{
                        py: 2,
                        borderRadius: 1,
                        border: `2px dashed ${alpha(theme.customColors.primary.main, 0.3)}`,
                        color: theme.customColors.primary.main,
                        backgroundColor: alpha(theme.customColors.primary.main, 0.05),
                        '&:hover': {
                          borderColor: theme.customColors.primary.main,
                          backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                        },
                      }}
                    >
                      {image ? 'Imagem Selecionada' : 'Upload de Imagem'}
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          borderRadius: 1,
                          border: `2px solid ${theme.customColors.border.primary}`
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {calculatedValues && (
                  <Card sx={{ 
                    background: alpha(theme.customColors.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.customColors.primary.main, 0.2)}`,
                    borderRadius: 1
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ 
                        color: theme.customColors.text.primary,
                        fontWeight: 700,
                        mb: 2
                      }}>
                        Valores Calculados
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: theme.customColors.text.secondary }}>
                            Preço de Venda:
                          </Typography>
                          <Typography sx={{ 
                            color: theme.customColors.status.success,
                            fontWeight: 700
                          }}>
                            R$ {calculatedValues.finalPrice}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: theme.customColors.text.secondary }}>
                            Comissão (30%):
                          </Typography>
                          <Typography sx={{ 
                            color: theme.customColors.status.warning,
                            fontWeight: 700
                          }}>
                            R$ {calculatedValues.commissionAmount}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: theme.customColors.text.secondary }}>
                            Lucro:
                          </Typography>
                          <Typography sx={{ 
                            color: theme.customColors.status.info,
                            fontWeight: 700
                          }}>
                            R$ {calculatedValues.profit}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCart />}
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
                      '&:disabled': {
                        background: alpha(theme.customColors.primary.main, 0.12),
                        color: alpha(theme.customColors.primary.main, 0.38),
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? 'Criando...' : 'Criar Produto'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/admin/products')}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 3, sm: 4 },
                      borderRadius: 1,
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      border: `2px solid ${alpha(theme.customColors.primary.main, 0.3)}`,
                      color: theme.customColors.primary.main,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: theme.customColors.primary.main,
                        backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Stack>
            </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ProductForm;