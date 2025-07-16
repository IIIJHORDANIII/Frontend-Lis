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
    <Paper sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, 
      border: '2px solid #white',
      borderRadius: 3,
    }}>
      <Typography variant="h5" sx={{ 
        color: '#2d3748', 
        fontWeight: 'bold', 
        mb: 3,
        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
      }}>
        Resumo de Vendas por Vendedora
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#2d3748' }} />
        </Box>
      )}
      
      {error && (
        <Typography color="error" sx={{ 
          textAlign: 'center', 
          py: 2,
          fontSize: { xs: '0.875rem', sm: '1rem' },
        }}>
          {error}
        </Typography>
      )}
      
      {!loading && !error && (
        <>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }, 
            gap: { xs: 2, sm: 3, md: 4 }, 
            mb: 3 
          }}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              backgroundColor: '#2d3748', 
              color: 'white',
              borderRadius: 3,
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              }}>
                Total de Vendas
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
              }}>
                {formatCurrency(totalVendas)}
              </Typography>
            </Paper>
            <Paper sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              backgroundColor: '#d9d9d9', 
              color: '#2d3748',
              borderRadius: 3,
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              }}>
                Total de Comissões
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
              }}>
                {formatCurrency(totalComissoes)}
              </Typography>
            </Paper>
          </Box>
          
          {groupedSalesArray.map((userGroup) => (
            <Accordion key={userGroup.userId} sx={{ 
              mb: 2, 
              border: '1px solid #d9d9d9',
              borderRadius: 2,
              '&:before': {
                display: 'none',
              },
            }}>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: '#383A29' }} />}
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  minHeight: { xs: '48px', sm: '56px', md: '64px' },
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  width: '100%', 
                  mr: 2,
                  gap: { xs: 1, sm: 0 },
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      color: '#383A29', 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    }}>
                      {userGroup.userName}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#718096',
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                    }}>
                      {userGroup.sales.length} venda{userGroup.sales.length > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 2, md: 3 },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: '#2d3748', 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
                    }}>
                      Total: {formatCurrency(userGroup.totalValue)}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: '#718096',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                    }}>
                      Comissão: {formatCurrency(userGroup.totalCommission)}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                <TableContainer sx={{ 
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          color: '#2d3748',
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        }}>
                          Produto
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          color: '#2d3748',
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        }}>
                          Qtd
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          color: '#2d3748',
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        }}>
                          Preço
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          color: '#2d3748',
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        }}>
                          Subtotal
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userGroup.sales.flatMap(sale => 
                        sale.products.map((product, index) => (
                          <TableRow key={`${sale._id}-${index}`}>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                            }}>
                              {product.name}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                            }}>
                              {product.quantity}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                            }}>
                              {formatCurrency(product.price)}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                            }}>
                              {formatCurrency(product.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mt: 2,
                  gap: { xs: 1, sm: 2 },
                }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteUserSales(userGroup.userId)}
                    disabled={deletingUserId === userGroup.userId}
                    sx={{
                      borderColor: '#e53e3e',
                      color: '#e53e3e',
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                      minHeight: { xs: '32px', sm: '36px', md: '40px' },
                      '&:hover': {
                        backgroundColor: 'rgba(229, 62, 62, 0.1)',
                        borderColor: '#c53030',
                      },
                    }}
                  >
                    {deletingUserId === userGroup.userId ? 'Zerando...' : 'Zerar Vendas'}
                  </Button>
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