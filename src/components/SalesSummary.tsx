import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress, 
  Button,
  useTheme,
  alpha,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../contexts/AuthContext';
import { api, deleteUserSales } from '../services/api';

interface SaleProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Sale {
  _id: string;
  userId: string;
  userName: string;
  products: SaleProduct[];
  total: number;
  commission: number;
  createdAt: string;
}

interface GroupedSales {
  userId: string;
  userName: string;
  sales: Sale[];
  totalValue: number;
  totalCommission: number;
}

const SalesSummary: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletedCount, setDeletedCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/sales/summary');
        
        // Garantir que os dados estejam no formato correto
        const formattedSales = response.data.map((sale: any) => {
          // Agrupar produtos iguais
          const groupedProducts = sale.products.reduce((acc: any, product: any) => {
            const key = product.productId;
            if (!acc[key]) {
              acc[key] = {
                productId: product.productId,
                name: product.name,
                quantity: 0,
                price: product.finalPrice,
                subtotal: 0
              };
            }
            acc[key].quantity += product.quantity;
            acc[key].subtotal += product.quantity * product.finalPrice;
            return acc;
          }, {});

          // Calcular comissão se não estiver definida
          const total = Number(sale.total) || 0;
          const commission = Number(sale.commission) || Number((total * 0.3).toFixed(2));

          const formattedSale = {
            _id: sale._id,
            userId: sale.userId,
            userName: sale.userName || 'Usuário não identificado',
            products: Object.values(groupedProducts),
            total,
            commission,
            createdAt: sale.createdAt
          };
          return formattedSale;
        });
        
        setSales(formattedSales);
      } catch (err) {
        setError('Erro ao carregar vendas');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Agrupar vendas por usuário
  const groupedSales = sales.reduce((acc: { [key: string]: GroupedSales }, sale) => {
    const userId = sale.userId;
    
    if (!acc[userId]) {
      acc[userId] = {
        userId: sale.userId,
        userName: sale.userName,
        sales: [],
        totalValue: 0,
        totalCommission: 0
      };
    }
    
    acc[userId].sales.push(sale);
    acc[userId].totalValue += sale.total;
    acc[userId].totalCommission += sale.commission;
    
    return acc;
  }, {});

  // Converter para array e ordenar por valor total (maior para menor)
  const groupedSalesArray = Object.values(groupedSales).sort((a, b) => b.totalValue - a.totalValue);

  // Calcular totais gerais
  const totalVendas = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalComissoes = sales.reduce((acc, sale) => acc + sale.commission, 0);

  // Agrupar produtos por nome e calcular totais
  const productSummary = sales.reduce((acc: any, sale) => {
    sale.products.forEach((product: any) => {
      if (!acc[product.name]) {
        acc[product.name] = {
          name: product.name,
          totalQuantity: 0,
          totalValue: 0
        };
      }
      acc[product.name].totalQuantity += product.quantity;
      acc[product.name].totalValue += product.subtotal;
    });
    return acc;
  }, {});

  const handleDeleteUserSales = async (userId: string) => {
    const userGroup = groupedSalesArray.find(group => group.userId === userId);
    if (!userGroup) return;

    const confirmMessage = `Tem certeza que deseja zerar todas as vendas de ${userGroup.userName}?\n\n` +
                          `Isso irá remover:\n` +
                          `• ${userGroup.sales.length} venda${userGroup.sales.length > 1 ? 's' : ''}\n` +
                          `• Total de R$ ${formatCurrency(userGroup.totalValue)}\n` +
                          `• Comissões de R$ ${formatCurrency(userGroup.totalCommission)}\n\n` +
                          `Esta ação não pode ser desfeita!`;

    if (!window.confirm(confirmMessage)) return;
    
    setDeletingUserId(userId);
    try {
      const response = await deleteUserSales(userId);
      setSales((prev) => prev.filter((sale) => sale.userId !== userId));
      
      // Mostrar feedback sobre quantas vendas foram deletadas
      const deletedMessage = response?.deletedCount 
        ? `Vendas de ${userGroup.userName} foram zeradas com sucesso!\n${response.deletedCount} venda${response.deletedCount > 1 ? 's' : ''} removida${response.deletedCount > 1 ? 's' : ''}.`
        : `Vendas de ${userGroup.userName} foram zeradas com sucesso!`;
      
      alert(deletedMessage);
    } catch (err) {
      setError('Erro ao zerar vendas. Tente novamente.');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: theme.customColors.text.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            background: alpha(theme.customColors.status.error, 0.1),
            border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
            color: theme.customColors.status.error,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <Box p={3}>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2,
            background: alpha(theme.customColors.status.info, 0.1),
            border: `1px solid ${alpha(theme.customColors.status.info, 0.3)}`,
            color: theme.customColors.status.info,
          }}
        >
          Nenhuma venda encontrada
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Resumo Geral */}
      <Paper sx={{
        p: 3,
        mb: 3,
        background: theme.customColors.surface.card,
        border: `1px solid ${theme.customColors.border.primary}`,
        borderRadius: 3,
        boxShadow: theme.customColors.shadow.secondary,
      }}>
        <Typography variant="h5" sx={{ 
          color: theme.customColors.text.primary, 
          fontWeight: 700, 
          mb: 2,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
        }}>
          Resumo Geral
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" sx={{ 
              color: theme.customColors.text.secondary, 
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}>
              Total de Vendas
            </Typography>
            <Typography variant="h4" sx={{ 
              color: theme.customColors.status.success, 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}>
              {formatCurrency(totalVendas)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" sx={{ 
              color: theme.customColors.text.secondary, 
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}>
              Total de Comissões
            </Typography>
            <Typography variant="h4" sx={{ 
              color: theme.customColors.status.warning, 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}>
              {formatCurrency(totalComissoes)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" sx={{ 
              color: theme.customColors.text.secondary, 
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}>
              Número de Vendedores
            </Typography>
            <Typography variant="h4" sx={{ 
              color: theme.customColors.primary.main, 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}>
              {groupedSalesArray.length}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Vendas por Vendedor */}
      <Typography variant="h5" sx={{ 
        color: theme.customColors.text.primary, 
        fontWeight: 700, 
        mb: 2,
        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
      }}>
        Vendas por Vendedor
      </Typography>

      {groupedSalesArray.map((group, index) => (
        <Accordion key={group.userId} sx={{
          mb: 2,
          background: theme.customColors.surface.card,
          border: `1px solid ${theme.customColors.border.primary}`,
          borderRadius: 3,
          boxShadow: theme.customColors.shadow.secondary,
          '&:before': {
            display: 'none',
          },
        }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: theme.customColors.text.primary }} />}
            sx={{
              backgroundColor: alpha(theme.customColors.text.primary, 0.05),
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography sx={{ 
                color: theme.customColors.text.primary, 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}>
                {group.userName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography sx={{ 
                  color: theme.customColors.status.success, 
                  fontWeight: 700,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}>
                  {formatCurrency(group.totalValue)}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUserSales(group.userId);
                  }}
                  disabled={deletingUserId === group.userId}
                  sx={{
                    borderColor: theme.customColors.status.error,
                    color: theme.customColors.status.error,
                    '&:hover': {
                      backgroundColor: alpha(theme.customColors.status.error, 0.1),
                      borderColor: theme.customColors.status.error,
                    },
                  }}
                >
                  {deletingUserId === group.userId ? 'Zerando...' : 'Zerar Vendas'}
                </Button>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      color: theme.customColors.text.primary, 
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}>
                      Produto
                    </TableCell>
                    <TableCell sx={{ 
                      color: theme.customColors.text.primary, 
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}>
                      Quantidade
                    </TableCell>
                    <TableCell sx={{ 
                      color: theme.customColors.text.primary, 
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}>
                      Preço Unit.
                    </TableCell>
                    <TableCell sx={{ 
                      color: theme.customColors.text.primary, 
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}>
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.sales.flatMap(sale => sale.products).map((product, productIndex) => (
                    <TableRow key={productIndex}>
                      <TableCell sx={{ 
                        color: theme.customColors.text.primary,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}>
                        {product.name}
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.customColors.text.secondary,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}>
                        {product.quantity}
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.customColors.text.secondary,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}>
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.customColors.status.success,
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}>
                        {formatCurrency(product.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.customColors.text.primary, 0.02), borderRadius: 2 }}>
              <Typography sx={{ 
                color: theme.customColors.text.secondary,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}>
                <strong>Total de Vendas:</strong> {formatCurrency(group.totalValue)} | 
                <strong> Comissões:</strong> {formatCurrency(group.totalCommission)}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default SalesSummary;