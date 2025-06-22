import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from '@mui/material';
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
                price: product.price,
                subtotal: 0
              };
            }
            acc[key].quantity += product.quantity;
            acc[key].subtotal += product.quantity * product.price;
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
    } catch (err: any) {
      console.error('Erro ao zerar vendas:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erro ao zerar vendas do usuário. Por favor, tente novamente.';
      alert(errorMessage);
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <Box p={3}>
        <Typography>Nenhuma venda encontrada</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 4, border: '2px solid #383A29' }}>
      <Typography variant="h5" sx={{ color: '#383A29', fontWeight: 'bold', mb: 3 }}>
        Resumo de Vendas por Vendedora
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#383A29' }} />
        </Box>
      )}
      
      {error && (
        <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
          {error}
        </Typography>
      )}
      
      {!loading && !error && (
        <>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 2, 
            mb: 3 
          }}>
            <Paper sx={{ p: 2, backgroundColor: '#383A29', color: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total de Vendas
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalVendas)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, backgroundColor: '#d9d9d9', color: '#383A29' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total de Comissões
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalComissoes)}
              </Typography>
            </Paper>
          </Box>
          
          {groupedSalesArray.map((userGroup) => (
            <Accordion key={userGroup.userId} sx={{ mb: 2, border: '1px solid #d9d9d9' }}>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: '#383A29' }} />}
                sx={{ backgroundColor: '#f5f5f5' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                  <Typography sx={{ color: '#383A29', fontWeight: 'bold' }}>
                    {userGroup.userName} ({userGroup.sales.length} venda{userGroup.sales.length > 1 ? 's' : ''})
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#383A29', fontWeight: 'bold' }}>
                      {formatCurrency(userGroup.totalValue)}
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                      Comissão: {formatCurrency(userGroup.totalCommission)}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {userGroup.sales.map((sale, saleIndex) => (
                  <Box key={sale._id} sx={{ mb: saleIndex < userGroup.sales.length - 1 ? 3 : 0 }}>
                    <Typography variant="h6" sx={{ color: '#383A29', fontWeight: 'bold', mb: 2 }}>
                      Venda #{saleIndex + 1} - {new Date(sale.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#d9d9d9' }}>
                            <TableCell sx={{ color: '#383A29', fontWeight: 'bold' }}>Produto</TableCell>
                            <TableCell sx={{ color: '#383A29', fontWeight: 'bold' }}>Quantidade</TableCell>
                            <TableCell sx={{ color: '#383A29', fontWeight: 'bold' }}>Preço Unit.</TableCell>
                            <TableCell sx={{ color: '#383A29', fontWeight: 'bold' }}>Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sale.products.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ color: '#383A29' }}>{product.name}</TableCell>
                              <TableCell sx={{ color: '#383A29' }}>{product.quantity}</TableCell>
                              <TableCell sx={{ color: '#383A29' }}>{formatCurrency(product.price)}</TableCell>
                              <TableCell sx={{ color: '#383A29', fontWeight: 'bold' }}>
                                {formatCurrency(product.subtotal)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: '#383A29', fontWeight: 'bold' }}>
                        Total da Venda: {formatCurrency(sale.total)}
                      </Typography>
                      <Typography sx={{ color: '#383A29', fontWeight: 'bold' }}>
                        Comissão: {formatCurrency(sale.commission)}
                      </Typography>
                    </Box>
                    {saleIndex < userGroup.sales.length - 1 && (
                      <Box sx={{ borderBottom: '1px solid #d9d9d9', mt: 2 }} />
                    )}
                  </Box>
                ))}
                
                {/* Resumo total do usuário */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#383A29', color: 'white', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Resumo de {userGroup.userName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        Total de Vendas: {formatCurrency(userGroup.totalValue)}
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        Total de Comissões: {formatCurrency(userGroup.totalCommission)}
                      </Typography>
                    </Box>
                  </Box>
                  {user?.isAdmin && (
                    <Button
                      variant="contained"
                      color="error"
                      disabled={deletingUserId === userGroup.userId}
                      onClick={() => handleDeleteUserSales(userGroup.userId)}
                      sx={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                        },
                        '&:disabled': {
                          backgroundColor: '#ccc',
                          color: '#666',
                        },
                        ml: 2,
                        px: 3,
                        py: 1,
                      }}
                    >
                      {deletingUserId === userGroup.userId ? (
                        <>
                          <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
                          Zerando...
                        </>
                      ) : (
                        'Zerar vendas deste usuário'
                      )}
                    </Button>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
    </Paper>
  );
};

export default SalesSummary;