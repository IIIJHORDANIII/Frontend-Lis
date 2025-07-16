import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  alpha
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import SalesSummary from './SalesSummary';

interface Product {
  _id: string;
  name: string;
  description: string;
  costPrice: number;
  finalPrice: number;
  commission: number;
  profit: number;
  quantity?: number;
  image?: string;
  category?: string; // Added for new layout
}

interface Sales {
  [productId: string]: number;
}

const Sales: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sales>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState('');
  const [processingProduct, setProcessingProduct] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        
        const productsWithCommission = response.data.map((product: Product) => ({
          ...product,
          commission: product.commission || 0
        }));
        
        setProducts(productsWithCommission);
        
        // Carregar vendas reais do backend ao invés do localStorage
        if (user?._id) {
          try {
            const salesResponse = await api.get('/sales'); // Removido /api
            
            // Calcular quantidades totais por produto
            const salesByProduct: Sales = {};
            salesResponse.data.forEach((sale: any) => {
              sale.products.forEach((product: any) => {
                // Verificar se é productId ou _id
                const productId = product.productId?._id || product.productId || product._id;
                if (!productId) {
                  return;
                }
                if (!salesByProduct[productId]) {
                  salesByProduct[productId] = 0;
                }
                salesByProduct[productId] += product.quantity;
              });
            });
            
            setSales(salesByProduct);
            
            // Manter sincronização com localStorage para persistência visual
            localStorage.setItem(`sales_${user._id}`, JSON.stringify(salesByProduct));
          } catch (error) {
            // Fallback para localStorage se houver erro
            const savedSales = localStorage.getItem(`sales_${user._id}`);
            if (savedSales) {
              const parsedSales = JSON.parse(savedSales);
              setSales(parsedSales);
            }
          }
        }
        
        setError('');
      } catch (err) {
        setError('Falha ao carregar produtos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [isAuthenticated, navigate, user]);

  const handleQuantityChange = async (productId: string, increment: boolean) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    // Impedir venda se a quantidade for 0
    if (increment && (typeof product.quantity === 'number') && product.quantity === 0) {
      setError('Produto sem estoque. Não é possível vender.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const currentQuantity = sales[productId] || 0;
    if (!increment && currentQuantity === 0) return; // Não permite devolução abaixo de zero
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    // Se não há mudança, não fazer nada
    if (newQuantity === currentQuantity) return;

    setProcessingProduct(productId);
    
    try {
      if (increment) {
        // Registrar uma venda
        const total = Number(product.finalPrice.toFixed(2));
        const commission = Number((total * 0.3).toFixed(2));
  
        const saleData = {
          products: [{
            productId: product._id,
            quantity: 1,
            price: product.finalPrice
          }],
          total,
          commission
        };
  
        await api.post('/sales', saleData);
        setSuccess(`Venda registrada: ${product.name}`);

        // Atualizar quantidade do produto no estoque (descontar 1)
        if (typeof product.quantity === 'number') {
          const newStock = Math.max(product.quantity - 1, 0);
          await api.put(`/products/${product._id}`, {
            name: product.name,
            description: product.description,
            costPrice: product.costPrice,
            quantity: newStock
          });
          // Atualizar localmente
          setProducts(prev => prev.map(p => p._id === product._id ? { ...p, quantity: newStock } : p));
        }
      } else {
        // Registrar uma devolução (venda negativa)
        const total = Number((-product.finalPrice).toFixed(2));
        const commission = Number((total * 0.3).toFixed(2)); // Comissão negativa
  
        const returnData = {
          products: [{
            productId: product._id,
            quantity: -1,
            price: product.finalPrice
          }],
          total,
          commission
        };
  
        const salesResponse = await api.get('/sales');
        await api.post('/sales', returnData);
        setSuccess(`Devolução registrada: ${product.name}`);

        // Atualizar quantidade do produto no estoque (somar 1)
        if (typeof product.quantity === 'number') {
          const newStock = product.quantity + 1;
          await api.put(`/products/${product._id}`, {
            name: product.name,
            description: product.description,
            costPrice: product.costPrice,
            quantity: newStock
          });
          // Atualizar localmente
          setProducts(prev => prev.map(p => p._id === product._id ? { ...p, quantity: newStock } : p));
        }
      }

      // Atualizar o estado local para exibição
      const newSales = { ...sales, [productId]: newQuantity };
      setSales(newSales);
      
      // Salvar no localStorage para persistência visual
      if (user?._id) {
        localStorage.setItem(`sales_${user._id}`, JSON.stringify(newSales));
      }

      // Limpar mensagem de sucesso após 2 segundos
      setTimeout(() => setSuccess(''), 2000);
      
    } catch (error) {
      setError(increment ? 'Erro ao registrar venda. Tente novamente.' : 'Erro ao registrar devolução. Tente novamente.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setProcessingProduct(null);
    }

    // Validação extra: impedir quantidade ou total negativos
    if (increment && product.finalPrice < 0) {
      setError('Preço do produto não pode ser negativo.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (!increment && (currentQuantity <= 0 || product.finalPrice < 0)) {
      setError('Não é possível devolver mais do que foi vendido ou preço negativo.');
      setTimeout(() => setError(''), 3000);
      return;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="text.secondary" variant="h6">Nenhum produto disponível para venda</Typography>
        </Box>
      </Container>
    );
  }

  // Calculate totals for the summary section
  const totalVendas = Object.entries(sales).reduce((sum, [productId, quantity]) => {
    const product = products.find(p => p._id === productId);
    return sum + (quantity * (product?.finalPrice || 0));
  }, 0);
  
  const totalComissoes = Object.entries(sales).reduce((sum, [productId, quantity]) => {
    const product = products.find(p => p._id === productId);
    return sum + (quantity * (product?.finalPrice || 0) * 0.3);
  }, 0);
  
  const totalProdutos = Object.values(sales).reduce((sum, quantity) => sum + quantity, 0);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: { xs: 2, md: 4 },
      width: '100%',
    }}>
      {/* Products Section */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" component="h1" sx={{ 
          mb: 3, 
          color: '#2d3748', 
          fontWeight: 'bold',
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }, // Reduced font sizes
          lineHeight: 1.2, // Added line height control
          mt: { xs: 0, sm: 1, md: 2 }, // Added top margin for better spacing
        }}>
          Vendas
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ 
            mb: 3, 
            borderRadius: 2,
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Snackbar
            open={!!success}
            autoHideDuration={2000}
            onClose={() => setSuccess('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {success}
            </Alert>
          </Snackbar>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: { xs: 2, sm: 3, md: 4 },
          }}>
            {products.map((product) => (
              <Card key={product._id} sx={{
                background: 'rgba(255,255,255,0.97)',
                border: '1.5px solid rgba(102,126,234,0.10)',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(102,126,234,0.18)',
                  border: '2px solid #764ba2',
                  transform: 'translateY(-4px) scale(1.02)',
                },
                p: { xs: 1.5, sm: 2, md: 3 },
                minHeight: { xs: '200px', sm: '220px', md: '240px' },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: product.category === 'feminino' 
                    ? 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)'
                    : product.category === 'masculino'
                    ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
                    : 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                  borderRadius: '3px 3px 0 0',
                },
              }}>
                <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 }, pb: { xs: 1, sm: 1.5, md: 2 } }}>
                  <Typography variant="h6" component="h3" sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    lineHeight: 1.3,
                    minHeight: '2.6em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {product.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{
                    mb: 2,
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {product.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.success.main,
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                    }}>
                      R$ {product.finalPrice?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.warning.main,
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                    }}>
                      Comissão: R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        background: product.category === 'feminino' 
                          ? 'rgba(236, 72, 153, 0.1)'
                          : product.category === 'masculino'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(16, 185, 129, 0.1)',
                        color: product.category === 'feminino' 
                          ? '#ec4899'
                          : product.category === 'masculino'
                          ? '#3b82f6'
                          : '#10b981',
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                        border: product.category === 'feminino' 
                          ? '1px solid rgba(236, 72, 153, 0.3)'
                          : product.category === 'masculino'
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                      fontWeight: 600,
                    }}>
                      Estoque: {product.quantity || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                    }}>
                      Quantidade: {sales[product._id] || 0}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => handleQuantityChange(product._id, false)}
                        disabled={processingProduct === product._id || (sales[product._id] || 0) === 0}
                        sx={{
                          background: 'rgba(229, 62, 62, 0.1)',
                          color: theme.palette.error.main,
                          '&:hover': {
                            background: theme.palette.error.main,
                            color: 'white',
                          },
                          '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)',
                          },
                          width: { xs: 32, sm: 36, md: 40 },
                          height: { xs: 32, sm: 36, md: 40 },
                        }}
                      >
                        <Remove sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                      </IconButton>
                      
                      <IconButton
                        onClick={() => handleQuantityChange(product._id, true)}
                        disabled={processingProduct === product._id || (typeof product.quantity === 'number' && product.quantity === 0)}
                        sx={{
                          background: 'rgba(76, 175, 80, 0.1)',
                          color: theme.palette.success.main,
                          '&:hover': {
                            background: theme.palette.success.main,
                            color: 'white',
                          },
                          '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)',
                          },
                          width: { xs: 32, sm: 36, md: 40 },
                          height: { xs: 32, sm: 36, md: 40 },
                        }}
                      >
                        <Add sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Sales Summary Section - Now at bottom for larger screens */}
      <Box sx={{ 
        width: '100%',
        display: { xs: 'block', md: 'flex' },
        justifyContent: 'center',
      }}>
        <Card sx={{
          background: 'linear-gradient(135deg, rgba(74, 85, 104, 0.95) 0%, rgba(113, 128, 150, 0.95) 100%)',
          color: 'white',
          border: '1.5px solid rgba(74, 85, 104, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(74, 85, 104, 0.15)',
          p: { xs: 2, sm: 3, md: 4 },
          backdropFilter: 'blur(10px)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(74, 85, 104, 0.25)',
          },
          transition: 'all 0.3s ease',
          maxWidth: { xs: '100%', md: '600px' },
          width: '100%',
        }}>
          <Typography variant="h5" component="h2" sx={{ 
            mb: 3, 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            textAlign: 'center',
          }}>
            Resumo de Vendas
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3, md: 4 },
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h4" sx={{ 
                color: '#4ade80',
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}>
                R$ {totalVendas.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
              }}>
                Total de Vendas
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h5" sx={{ 
                color: '#fbbf24',
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}>
                R$ {totalComissoes.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
              }}>
                Total de Comissões
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h5" sx={{ 
                color: '#60a5fa',
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}>
                {totalProdutos}
              </Typography>
              <Typography variant="body2" sx={{
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
              }}>
                Produtos Vendidos
              </Typography>
            </Box>
          </Box>

          {/* Informações adicionais para usuários */}
          {!isAdmin && (
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              borderRadius: 2, 
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Typography variant="body2" sx={{
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                fontStyle: 'italic',
              }}>
                💡 Dica: Use os botões + e - para adicionar ou remover produtos da sua venda
              </Typography>
            </Box>
          )}
          
          {isAdmin && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/sales/summary')}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  py: { xs: 1, sm: 1.2, md: 1.5 },
                  px: { xs: 2, sm: 3, md: 4 },
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Ver Resumo Detalhado
              </Button>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default Sales;