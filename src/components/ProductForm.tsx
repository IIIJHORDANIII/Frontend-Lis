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
  Radio
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
    setLoading(true);
    
    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('commission', formData.commission);
      productData.append('quantity', formData.quantity);
      productData.append('category', formData.category);
      if (image) {
        productData.append('image', image);
      }
  
      await createProduct(productData);
      navigate('/admin/products');
    } catch (err) {
      setError('Falha ao criar produto. Tente novamente.');
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
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Paper 
            elevation={24}
            sx={{ 
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(217, 217, 217, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(217, 217, 217, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
               
              }
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #383A29 0%, #4a4d35 100%)'
                }}
              >
                <ShoppingCart sx={{ fontSize: 40, color: '#d9d9d9' }} />
              </Avatar>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #383A29 0%, #4a4d35 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Novo Produto
              </Typography>
              <Typography variant="body1" sx={{ color: '#383A29' }}>
                Adicione um novo produto ao estoque
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
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
              <Box sx={{ display: 'grid', gap: 3 }}>
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
                        <ShoppingCart sx={{ color: '#383A29' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(56, 58, 41, 0.2)'
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(56, 58, 41, 0.3)'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#383A29'
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#383A29'
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        <Description sx={{ color: '#383A29' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(56, 58, 41, 0.2)'
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(56, 58, 41, 0.3)'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#383A29'
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#383A29'
                    }
                  }}
                />
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Preço"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: '#383A29' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56, 58, 41, 0.2)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56, 58, 41, 0.3)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#383A29'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#383A29'
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Comissão (%)"
                    name="commission"
                    type="number"
                    value={formData.commission}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: '#383A29' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56, 58, 41, 0.2)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56, 58, 41, 0.3)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#383A29'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#383A29'
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Quantidade"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ShoppingCart sx={{ color: '#383A29' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56, 58, 41, 0.2)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(56, 58, 41, 0.3)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#383A29'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#383A29'
                      }
                    }}
                  />
                </Box>
                
                <FormControl component="fieldset" required>
                  <FormLabel component="legend" sx={{ color: '#383A29', fontWeight: 600, mb: 1 }}>
                    Classificação
                  </FormLabel>
                  <RadioGroup
                    row
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    sx={{
                      '& .MuiFormControlLabel-root': {
                        marginRight: 3,
                        '&:last-child': {
                          marginRight: 0
                        }
                      },
                      '& .MuiRadio-root': {
                        color: '#383A29',
                        '&.Mui-checked': {
                          color: '#383A29'
                        }
                      },
                      '& .MuiFormControlLabel-label': {
                        color: '#383A29',
                        fontWeight: 500
                      }
                    }}
                  >
                    <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                    <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
                    <FormControlLabel value="infantil" control={<Radio />} label="Infantil" />
                  </RadioGroup>
                </FormControl>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: 3,
                      borderColor: '#383A29',
                      color: '#383A29',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(56, 58, 41, 0.3)',
                        backgroundColor: '#383A29',
                        color: '#d9d9d9'
                      }
                    }}
                  >
                    Upload da Imagem
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #383A29 0%, #4a4d35 100%)',
                  boxShadow: '0 4px 15px rgba(56, 58, 41, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(56, 58, 41, 0.6)',
                    background: 'linear-gradient(135deg, #2d2f20 0%, #383A29 100%)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
                  }
                }}
              >
                {loading ? 'Criando Produto...' : 'Criar Produto'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ProductForm;