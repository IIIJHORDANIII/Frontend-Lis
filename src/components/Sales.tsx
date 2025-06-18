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
  Snackbar
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
  price: number;
  quantity?: number;
  image?: string;
  commission?: number;
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

    const currentQuantity = sales[productId] || 0;
    if (!increment && currentQuantity === 0) return; // Não permite devolução abaixo de zero
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    // Se não há mudança, não fazer nada
    if (newQuantity === currentQuantity) return;

    setProcessingProduct(productId);
    
    try {
      if (increment) {
        // Registrar uma venda
        const total = Number(product.price.toFixed(2));
        const commission = Number((total * 0.3).toFixed(2));
  
        const saleData = {
          products: [{
            productId: product._id,
            quantity: 1,
            price: product.price
          }],
          total,
          commission
        };
  
        await api.post('/sales', saleData);
        setSuccess(`Venda registrada: ${product.name}`);
      } else {
        // Registrar uma devolução (venda negativa)
        const total = Number((-product.price).toFixed(2));
        const commission = Number((total * 0.3).toFixed(2)); // Comissão negativa
  
        const returnData = {
          products: [{
            productId: product._id,
            quantity: -1,
            price: product.price
          }],
          total,
          commission
        };
  
        const salesResponse = await api.get('/sales');
        await api.post('/sales', returnData);
        setSuccess(`Devolução registrada: ${product.name}`);
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
    if (increment && product.price < 0) {
      setError('Preço do produto não pode ser negativo.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (!increment && (currentQuantity <= 0 || product.price < 0)) {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Vendas Instantâneas
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Cada clique em + registra uma venda imediata. Cada clique em - registra uma devolução.
      </Alert>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Produtos Disponíveis
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="right">Preço</TableCell>
                <TableCell align="right">Comissão</TableCell>
                <TableCell align="center">Ações</TableCell>
                <TableCell align="center">Todas as Vendas</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const quantity = sales[product._id] || 0;
                const subtotal = product.price * quantity;
                const commission = product.commission || (product.price * 0.3);
                const isProcessing = processingProduct === product._id;
                
                return (
                  <TableRow key={product._id}>
                    <TableCell component="th" scope="row">
                      {product.name}
                    </TableCell>
                    <TableCell align="right">
                      R$ {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      R$ {commission.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(product._id, false)}
                          disabled={quantity === 0 || isProcessing}
                          color="error"
                        >
                          <Remove />
                        </IconButton>
                        
                        {isProcessing ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Typography sx={{ minWidth: '60px', textAlign: 'center' }}>
                            Vender/Devolver
                          </Typography>
                        )}
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(product._id, true)}
                          disabled={isProcessing}
                          color="success"
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" color={quantity > 0 ? 'success.main' : 'text.secondary'}>
                        {quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={subtotal > 0 ? 'success.main' : subtotal < 0 ? 'error.main' : 'text.secondary'}>
                        R$ {subtotal.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {isAdmin && <SalesSummary />}
      
      {/* Snackbar para feedback */}
      <Snackbar
        open={!!success}
        autoHideDuration={2000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Sales;