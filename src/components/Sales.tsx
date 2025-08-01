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
  ButtonGroup,
  alpha,
  Fade,
  Stack,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Add, Remove, Inventory as StockIcon, Description as PdfIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import SalesSummary from './SalesSummary';
import { jsPDF } from 'jspdf';

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [condicionalModalOpen, setCondicionalModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: number}>({});
  const [recipientName, setRecipientName] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Injetar estilos CSS globais para forçar opacidade do modal
  useEffect(() => {
    if (condicionalModalOpen) {
      const style = document.createElement('style');
      style.id = 'modal-opacity-fix';
      style.textContent = `
        .MuiDialog-paper {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
          backdrop-filter: none !important;
          opacity: 1 !important;
        }
        .MuiDialog-root .MuiDialog-paper {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiDialogContent-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiDialogTitle-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiDialogActions-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
        .MuiDialog-root .MuiCard-root {
          background: ${theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff'} !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('modal-opacity-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [condicionalModalOpen, theme.palette.mode]);

  console.log('=== DEBUG SALES ===');
  console.log('Sales component - isAdmin:', isAdmin);
  console.log('Sales component - user:', user);
  console.log('Should show button:', !isAdmin);
  console.log('==================');

  useEffect(() => {
    console.log('Sales useEffect - isAuthenticated:', isAuthenticated);
    console.log('Sales useEffect - user:', user);
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('Carregando produtos...');
        console.log('Token no localStorage:', localStorage.getItem('token'));
        
        // Para usuários não-admin, carregar produtos das listas custom compartilhadas
        if (!isAdmin) {
          console.log('Usuário não é admin, carregando listas custom...');
          const customListsResponse = await api.get('/custom-lists');
          console.log('Listas custom do usuário:', customListsResponse.data);
          
          // Extrair todos os produtos das listas custom
          const allProducts: Product[] = [];
          customListsResponse.data.forEach((list: any) => {
            if (list.products && Array.isArray(list.products)) {
              list.products.forEach((item: any) => {
                // Verificar se o item tem produto completo ou apenas ID
                if (item.product && typeof item.product === 'object') {
                  // Usar a quantidade da lista custom ao invés da quantidade original do produto
                  const productWithCustomQuantity = {
                    ...item.product,
                    quantity: item.quantity, // Quantidade da lista custom
                    commission: (item.product.finalPrice || 0) * 0.3
                  };
                  allProducts.push(productWithCustomQuantity);
                }
              });
            }
          });
          
          console.log('Produtos das listas custom:', allProducts);
          setProducts(allProducts);
        } else {
          // Para admins, carregar todos os produtos
          console.log('Usuário é admin, carregando todos os produtos...');
          const response = await api.get('/products');
          console.log('Resposta da API:', response.data);
          console.log('Quantidade de produtos:', response.data.length);
          
          const productsWithCommission = response.data.map((product: Product) => ({
            ...product,
            commission: product.commission || 0
          }));
          
          console.log('Produtos processados:', productsWithCommission);
          setProducts(productsWithCommission);
        }
        
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

  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  console.log('Produtos filtrados:', filteredProducts);
  console.log('Categoria selecionada:', selectedCategory);

  // New summary calculations
  const totalSales = Object.values(sales).reduce((sum, quantity) => sum + quantity, 0) * (products.find(p => p._id === Object.keys(sales)[0])?.finalPrice || 0);
  const averagePrice = totalSales / totalProdutos;

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOpenCondicional = () => {
    setCondicionalModalOpen(true);
    setSelectedProducts({});
    setRecipientName("");
  };

  const handleCloseCondicional = () => {
    setCondicionalModalOpen(false);
    setSelectedProducts({});
    setRecipientName("");
  };

  const handleProductSelection = (productId: string, quantity: number) => {
    if (quantity === 0) {
      const newSelected = { ...selectedProducts };
      delete newSelected[productId];
      setSelectedProducts(newSelected);
    } else {
      setSelectedProducts(prev => ({
        ...prev,
        [productId]: quantity
      }));
    }
  };

  const generateCondicionalPDF = async () => {
    if (!recipientName.trim()) {
      setError('Por favor, informe o nome do cliente.');
      return;
    }
    const selectedItems = Object.entries(selectedProducts)
      .map(([productId, quantity]) => {
        const product = products.find(p => p._id === productId);
        return product ? { ...product, selectedQuantity: quantity } : null;
      })
      .filter(Boolean);

    if (selectedItems.length === 0) {
      setError('Selecione pelo menos um produto para gerar o condicional.');
      return;
    }

    // Pega nome da vendedora
    const sellerName = user?.name || user?.email || 'Vendedora';

    // Criar conteúdo do PDF
    const pdfContent = {
      date: new Date().toLocaleDateString('pt-BR'),
      seller: sellerName,
      client: recipientName,
      items: selectedItems.map((item: any) => ({
        name: item.name,
        quantity: item.selectedQuantity,
        price: item.finalPrice,
        total: item.finalPrice * item.selectedQuantity
      })),
      total: selectedItems.reduce((sum: number, item: any) => sum + (item.finalPrice * item.selectedQuantity), 0)
    };

    // Gerar PDF usando jsPDF
    const doc = new jsPDF();

    // Adicionar logo centralizada como background
    const logoUrl = '/logo10.png';
    const getBase64FromUrl = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Logo não encontrada');
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        throw new Error('Não foi possível carregar a logo para o PDF.');
      }
    };
    let logoBase64 = '';
    try {
      logoBase64 = await getBase64FromUrl(logoUrl);
    } catch (err) {
      setError('Não foi possível carregar a logo para o PDF.');
      return;
    }

    // Calcular proporção real da imagem
    const getImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.src = base64;
      });
    };
    const { width: imgWidth, height: imgHeight } = await getImageDimensions(logoBase64);
    const aspectRatio = imgWidth / imgHeight;

    // Dimensões da página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    // Largura da logo: 70% da largura da página
    const logoWidth = pageWidth * 0.7;
    // Altura proporcional
    const logoHeight = logoWidth / aspectRatio;
    // Centralizar
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = (pageHeight - logoHeight) / 2;

    // Desenhar logo sem distorção
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Conteúdo do PDF
    doc.setFontSize(12);
    doc.text(`Data: ${pdfContent.date}`, 20, 45);
    doc.text(`Vendedora: ${pdfContent.seller}`, 20, 55);
    doc.text(`Cliente: ${pdfContent.client}`, 20, 65);

    // Cabeçalho da tabela
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Produto', 20, 85);
    doc.text('Qtd', 120, 85);
    doc.text('Preço', 140, 85);
    doc.text('Total', 170, 85);

    // Itens
    doc.setFont('helvetica', 'normal');
    let yPosition = 95;
    pdfContent.items.forEach((item: any) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(item.name.substring(0, 30), 20, yPosition);
      doc.text(item.quantity.toString(), 120, yPosition);
      doc.text(`R$ ${item.price.toFixed(2)}`, 140, yPosition);
      doc.text(`R$ ${item.total.toFixed(2)}`, 170, yPosition);
      yPosition += 10;
    });

    // Total
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: R$ ${pdfContent.total.toFixed(2)}`, 20, yPosition + 10);

    // Salvar PDF
    doc.save(`condicional_${pdfContent.client}_${pdfContent.date.replace(/\//g, '-')}.pdf`);
    
    setCondicionalModalOpen(false);
    setSelectedProducts({});
    setRecipientName("");
    setSuccess('Condicional gerado com sucesso!');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: { xs: 2, md: 4 },
      width: '100%',
    }}>
      {/* Header */}
      <Fade in>
        <Paper
          elevation={0}
          sx={{
            maxWidth: { xs: '100%', sm: 500, md: 800, xl: 1000 },
            width: '100%',
            mx: 'auto',
            mt: 0, // No top margin since AppLayout already provides padding
            mb: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
            p: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }, // Increased padding
            borderRadius: 4,
            boxShadow: theme.customColors.shadow.primary,
            background: theme.customColors.surface.header,
            backdropFilter: 'blur(12px)',
            border: `1.5px solid ${theme.customColors.border.secondary}`,
            '@media (min-width: 1600px)': {
              maxWidth: 1200,
              p: 8,
            },
            '@media (min-width: 1920px)': {
              maxWidth: 1400,
              p: 9,
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            gap: { xs: 3, sm: 0 } 
          }}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a202c',
                  mb: 1.5,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem', xl: '2.75rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  '@media (min-width: 1600px)': {
                    fontSize: '3rem',
                  },
                  '@media (min-width: 1920px)': {
                    fontSize: '3.25rem',
                  },
                }}
              >
                Vendas
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#2d3748',
                  mb: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.375rem' },
                  lineHeight: 1.3,
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  '@media (min-width: 1600px)': {
                    fontSize: '1.5rem',
                  },
                  '@media (min-width: 1920px)': {
                    fontSize: '1.625rem',
                  },
                }}
              >
                Acompanhe suas vendas e comissões
              </Typography>
              
              {/* Botão de Condicional */}
              <Button
                variant="contained"
                startIcon={<PdfIcon />}
                onClick={handleOpenCondicional}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.375rem' },
                  px: { xs: 2.5, sm: 3, md: 3.5, lg: 4, xl: 4.5 },
                  py: { xs: 1.25, sm: 1.5, md: 1.75, lg: 2, xl: 2.25 },
                  borderRadius: 3,
                  boxShadow: '0 6px 20px 0 rgba(102,126,234,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  transition: 'all 0.3s ease',
                  minHeight: { xs: '44px', sm: '48px', md: '52px', lg: '56px', xl: '60px' },
                  letterSpacing: '0.02em',
                  mt: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    boxShadow: '0 10px 40px 0 rgba(102,126,234,0.25)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                GERAR CONDICIONAL
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            maxWidth: 900,
            mx: 'auto',
            boxShadow: theme.customColors.shadow.secondary,
            '& .MuiAlert-icon': {
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Category Filter */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 4,
        width: '100%',
        maxWidth: 900,
      }}>
        <ButtonGroup
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: theme.customColors.shadow.secondary,
            background: theme.customColors.surface.card,
            border: `1px solid ${theme.customColors.border.primary}`,
            '& .MuiButton-root': {
              borderColor: theme.customColors.border.primary,
              color: theme.customColors.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                borderColor: theme.customColors.primary.main,
                color: theme.customColors.primary.main,
              },
              '&.Mui-selected': {
                backgroundColor: theme.customColors.primary.main,
                color: theme.customColors.text.inverse,
                '&:hover': {
                  backgroundColor: theme.customColors.primary.light,
                },
              },
            },
          }}
        >
          <Button
            onClick={() => handleCategoryFilter('all')}
            sx={{
              backgroundColor: selectedCategory === 'all' ? theme.customColors.primary.main : 'transparent',
              color: selectedCategory === 'all' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
              '&:hover': {
                backgroundColor: selectedCategory === 'all' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
              },
            }}
          >
            Todos
          </Button>
          <Button
            onClick={() => handleCategoryFilter('feminino')}
            sx={{
              backgroundColor: selectedCategory === 'feminino' ? theme.customColors.primary.main : 'transparent',
              color: selectedCategory === 'feminino' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
              '&:hover': {
                backgroundColor: selectedCategory === 'feminino' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
              },
            }}
          >
            Feminino
          </Button>
          <Button
            onClick={() => handleCategoryFilter('masculino')}
            sx={{
              backgroundColor: selectedCategory === 'masculino' ? theme.customColors.primary.main : 'transparent',
              color: selectedCategory === 'masculino' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
              '&:hover': {
                backgroundColor: selectedCategory === 'masculino' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
              },
            }}
          >
            Masculino
          </Button>
          <Button
            onClick={() => handleCategoryFilter('unissex')}
            sx={{
              backgroundColor: selectedCategory === 'unissex' ? theme.customColors.primary.main : 'transparent',
              color: selectedCategory === 'unissex' ? theme.customColors.text.inverse : theme.customColors.text.secondary,
              '&:hover': {
                backgroundColor: selectedCategory === 'unissex' ? theme.customColors.primary.light : alpha(theme.customColors.primary.main, 0.1),
              },
            }}
          >
            Unissex
          </Button>
        </ButtonGroup>
      </Box>
      
      {/* Products Grid */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '500px' 
        }}>
          <CircularProgress size={80} sx={{ color: theme.customColors.text.primary }} />
        </Box>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)'
          },
          gap: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
          mt: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          maxWidth: { xs: '100%', sm: 900, md: 1400, lg: 1600, xl: 1800 },
          mx: 'auto',
          width: '100%',
        }}>
          {filteredProducts.map((product) => (
            <Fade in key={product._id} timeout={400}>
              <Card
                sx={{
                  background: theme.customColors.surface.card,
                  border: `1.5px solid ${theme.customColors.border.primary}`,
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: hoveredCard === product._id 
                    ? theme.customColors.shadow.primary
                    : theme.customColors.shadow.secondary,
                  transform: hoveredCard === product._id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  '&:hover': {
                    boxShadow: theme.customColors.shadow.primary,
                    border: `2px solid ${theme.customColors.primary.main}`,
                    transform: 'translateY(-8px) scale(1.03)',
                  },
                  p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                  minHeight: { xs: '320px', sm: '360px', md: '400px', lg: '440px', xl: '480px' },
                }}
                onMouseEnter={() => setHoveredCard(product._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    width="100%"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      aspectRatio: '3/5',
                      transition: 'transform 0.3s ease',
                      transform: hoveredCard === product._id ? 'scale(1.05)' : 'scale(1)',
                      borderRadius: 3,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 }, pb: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: theme.customColors.text.primary,
                      mb: 1.5,
                      fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem', lg: '1.5rem' },
                      lineHeight: 1.3,
                      minHeight: '2.6em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2.5,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem', lg: '1.0625rem' },
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.description}
                  </Typography>
                  {/* Informações de preço baseadas no tipo de usuário */}
                  {isAdmin ? (
                    // Admin vê todos os detalhes
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Custo:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.error, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {product.costPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Venda:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.success, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {product.finalPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Comissão:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.warning, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Lucro:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.info, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {product.profit?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    // Usuário padrão vê apenas comissão e preço final
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Comissão (30%):
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.customColors.status.warning, fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          R$ {((product.finalPrice || 0) * 0.30).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } }}>
                          Preço Final:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.customColors.status.success, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}>
                          R$ {product.finalPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        background: alpha(theme.customColors.primary.main, 0.1),
                        color: theme.customColors.primary.main,
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem' }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StockIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: theme.customColors.text.secondary }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' } }}>
                        {product.quantity || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                {/* Controles de Venda */}
                <CardActions sx={{ 
                  p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 }, 
                  pt: 0,
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  gap: 1
                }}>
                  {/* Quantidade Vendida */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    minWidth: 'fit-content'
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                      fontWeight: 600
                    }}>
                      Vendidos:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 700,
                      color: theme.customColors.status.success,
                      minWidth: '1.5rem',
                      textAlign: 'center'
                    }}>
                      {sales[product._id] || 0}
                    </Typography>
                  </Box>
                  
                  {/* Botões de Controle */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5
                  }}>
                    <IconButton
                      onClick={() => handleQuantityChange(product._id, false)}
                      disabled={processingProduct === product._id || (sales[product._id] || 0) === 0}
                      sx={{
                        color: theme.customColors.status.error,
                        backgroundColor: alpha(theme.customColors.status.error, 0.1),
                        border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.customColors.status.error, 0.2),
                          transform: 'scale(1.1)',
                        },
                        '&:disabled': {
                          color: theme.customColors.text.disabled,
                          backgroundColor: alpha(theme.customColors.text.disabled, 0.1),
                          border: `1px solid ${alpha(theme.customColors.text.disabled, 0.2)}`,
                        },
                        transition: 'all 0.2s ease',
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
                        color: theme.customColors.status.success,
                        backgroundColor: alpha(theme.customColors.status.success, 0.1),
                        border: `1px solid ${alpha(theme.customColors.status.success, 0.3)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.customColors.status.success, 0.2),
                          transform: 'scale(1.1)',
                        },
                        '&:disabled': {
                          color: theme.customColors.text.disabled,
                          backgroundColor: alpha(theme.customColors.text.disabled, 0.1),
                          border: `1px solid ${alpha(theme.customColors.text.disabled, 0.2)}`,
                        },
                        transition: 'all 0.2s ease',
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                      }}
                    >
                      <Add sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Fade>
          ))}
        </Box>
      )}
      
      {/* Sales Summary Card - Bottom */}
      {isAuthenticated && (
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: { xs: '100%', sm: 500, md: 800, xl: 1000 },
              width: '100%',
              mx: 'auto',
              mt: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 },
              mb: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
              p: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
              borderRadius: 4,
              boxShadow: theme.customColors.shadow.primary,
              background: theme.customColors.surface.card,
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${theme.customColors.border.primary}`,
              '@media (min-width: 1600px)': {
                maxWidth: 1200,
                p: 8,
              },
              '@media (min-width: 1920px)': {
                maxWidth: 1400,
                p: 9,
              },
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                color: theme.customColors.text.primary,
                mb: 3,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem', xl: '2.25rem' },
                textAlign: 'center',
                '@media (min-width: 1600px)': {
                  fontSize: '2.5rem',
                },
                '@media (min-width: 1920px)': {
                  fontSize: '2.75rem',
                },
              }}
            >
              Resumo de Vendas
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(4, 1fr)'
              },
              gap: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
              mt: 3,
            }}>
              {/* Total Sales */}
              <Box sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                borderRadius: 3,
                background: alpha(theme.customColors.status.success, 0.1),
                border: `1px solid ${alpha(theme.customColors.status.success, 0.3)}`,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customColors.shadow.secondary,
                }
              }}>
                <Typography variant="h6" sx={{ 
                  color: theme.customColors.status.success, 
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                  mb: 1
                }}>
                  Total de Vendas
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.customColors.status.success, 
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' }
                }}>
                  R$ {totalSales.toFixed(2)}
                </Typography>
              </Box>

              {/* Commission */}
              <Box sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                borderRadius: 3,
                background: alpha(theme.customColors.status.warning, 0.1),
                border: `1px solid ${alpha(theme.customColors.status.warning, 0.3)}`,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customColors.shadow.secondary,
                }
              }}>
                <Typography variant="h6" sx={{ 
                  color: theme.customColors.status.warning, 
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                  mb: 1
                }}>
                  Comissão (30%)
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.customColors.status.warning, 
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' }
                }}>
                  R$ {(totalSales * 0.30).toFixed(2)}
                </Typography>
              </Box>

              {/* Products Count */}
              <Box sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                borderRadius: 3,
                background: alpha(theme.customColors.status.info, 0.1),
                border: `1px solid ${alpha(theme.customColors.status.info, 0.3)}`,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customColors.shadow.secondary,
                }
              }}>
                <Typography variant="h6" sx={{ 
                  color: theme.customColors.status.info, 
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                  mb: 1
                }}>
                  Produtos
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.customColors.status.info, 
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' }
                }}>
                  {products.length}
                </Typography>
              </Box>

              {/* Average Price */}
              <Box sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                borderRadius: 3,
                background: alpha(theme.customColors.primary.main, 0.1),
                border: `1px solid ${alpha(theme.customColors.primary.main, 0.3)}`,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customColors.shadow.secondary,
                }
              }}>
                <Typography variant="h6" sx={{ 
                  color: theme.customColors.primary.main, 
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                  mb: 1
                }}>
                  Preço Médio
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.customColors.primary.main, 
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' }
                }}>
                  R$ {averagePrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Tips for Users */}
            <Box sx={{
              mt: 4,
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: 3,
              background: alpha(theme.customColors.text.primary, 0.05),
              border: `1px solid ${alpha(theme.customColors.text.primary, 0.1)}`,
            }}>
              <Typography variant="body1" sx={{
                color: theme.customColors.text.secondary,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                textAlign: 'center',
                fontWeight: 500,
                lineHeight: 1.6,
              }}>
                💡 <strong>Dica:</strong> Foque nos produtos com maior comissão para maximizar seus ganhos!
              </Typography>
            </Box>
          </Paper>
        </Fade>
      )}
      
      {/* Modal de Condicional */}
      <Dialog
        open={condicionalModalOpen}
        onClose={handleCloseCondicional}
        maxWidth="md"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            boxShadow: theme.customColors.shadow.primary,
            border: `1px solid ${theme.customColors.border.primary}`,
            opacity: 1,
            '& .MuiDialogContent-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialogTitle-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialogActions-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiCard-root': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialog-paper': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            },
            '& .MuiDialog-container': {
              background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            }
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
            backdropFilter: 'none !important',
          },
          '& .MuiBackdrop-root': {
            backdropFilter: 'none !important',
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          color: theme.customColors.text.primary,
          borderBottom: `1px solid ${theme.customColors.border.primary}`,
          pb: 2,
          background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
        }}>
          Selecionar Produtos para Condicional
        </DialogTitle>
        
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
        }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Nome do cliente"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              fullWidth
              required
              variant="outlined"
              autoFocus
              sx={{ mb: 2 }}
            />
          </Box>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 2,
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            {filteredProducts.map((product) => (
              <Card key={product._id} sx={{
                p: 2,
                border: `1px solid ${theme.customColors.border.primary}`,
                borderRadius: 2,
                background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.customColors.shadow.secondary,
                  transform: 'translateY(-2px)',
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 600,
                      color: theme.customColors.text.primary,
                      mb: 0.5
                    }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: theme.customColors.text.secondary,
                      fontSize: '0.875rem'
                    }}>
                      R$ {product.finalPrice?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const currentQty = selectedProducts[product._id] || 0;
                      if (currentQty > 0) {
                        handleProductSelection(product._id, currentQty - 1);
                      }
                    }}
                    sx={{
                      color: theme.customColors.text.secondary,
                      '&:hover': {
                        color: theme.customColors.primary.main,
                      }
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  
                  <Typography variant="body2" sx={{
                    minWidth: '2rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: theme.customColors.text.primary
                  }}>
                    {selectedProducts[product._id] || 0}
                  </Typography>
                  
                  <IconButton
                    size="small"
                    onClick={() => {
                      const currentQty = selectedProducts[product._id] || 0;
                      const maxQty = product.quantity || 0;
                      if (currentQty < maxQty) {
                        handleProductSelection(product._id, currentQty + 1);
                      }
                    }}
                    sx={{
                      color: theme.customColors.text.secondary,
                      '&:hover': {
                        color: theme.customColors.primary.main,
                      }
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                
                <Typography variant="caption" sx={{
                  color: theme.customColors.text.secondary,
                  fontSize: '0.75rem',
                  display: 'block',
                  textAlign: 'center',
                  mt: 1
                }}>
                  Estoque: {product.quantity || 0}
                </Typography>
              </Card>
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{
          p: { xs: 2, sm: 3, md: 4 },
          pt: 0,
          gap: 2,
          justifyContent: 'center',
          background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
        }}>
          <Button
            onClick={handleCloseCondicional}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: theme.customColors.border.primary,
              color: theme.customColors.text.secondary,
              '&:hover': {
                borderColor: theme.customColors.primary.main,
                color: theme.customColors.primary.main,
              }
            }}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={generateCondicionalPDF}
            variant="contained"
            startIcon={<PdfIcon />}
            disabled={Object.keys(selectedProducts).length === 0 || !recipientName.trim()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: theme.customColors.text.disabled,
                color: theme.customColors.text.disabled,
              }
            }}
          >
            Gerar PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens de sucesso */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess('')} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            boxShadow: theme.customColors.shadow.secondary,
            '& .MuiAlert-icon': {
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;