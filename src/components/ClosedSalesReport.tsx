import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  alpha,
  Divider
} from '@mui/material';
import {
  TrendingUp as SalesIcon,
  AccountBalance as CommissionIcon,
  Inventory as StockIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { getClosedSalesReport } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ClosedSale {
  _id: string;
  listName: string;
  userName: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total: number;
  commission: number;
  closedAt: string;
  month: string;
  year: string;
}

const ClosedSalesReport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, isAdmin } = useAuth();
  const [sales, setSales] = useState<ClosedSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Obter mês e ano atual
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = currentDate.getFullYear().toString();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    loadSales();
  }, [isAuthenticated, selectedMonth, selectedYear]);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getClosedSalesReport(selectedMonth || undefined, selectedYear || undefined);
      setSales(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar relatório de vendas fechadas.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular totais
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCommission = sales.reduce((sum, sale) => sum + sale.commission, 0);
  const totalProducts = sales.reduce((sum, sale) => 
    sum + sale.products.reduce((productSum, product) => productSum + product.quantity, 0), 0
  );

  // Agrupar vendas por mês
  const salesByMonth = sales.reduce((acc, sale) => {
    const monthKey = `${sale.month}/${sale.year}`;
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: sale.month,
        year: sale.year,
        sales: [],
        total: 0,
        commission: 0,
        products: 0
      };
    }
    acc[monthKey].sales.push(sale);
    acc[monthKey].total += sale.total;
    acc[monthKey].commission += sale.commission;
    acc[monthKey].products += sale.products.reduce((sum, product) => sum + product.quantity, 0);
    return acc;
  }, {} as { [key: string]: any });

  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = currentDate.getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: theme.customColors.background.default,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <CircularProgress size={60} sx={{ color: theme.customColors.text.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Container maxWidth="xl" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        px: { xs: 1, sm: 2, md: 3 },
      }}>
        {/* Header */}
        <Fade in>
          <Paper
            elevation={0}
            sx={{
              maxWidth: { xs: 340, sm: 400, md: 700, xl: 900 },
              width: '100%',
              mx: 'auto',
              mt: 0,
              mb: { xs: 2, sm: 3, md: 4 },
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 1,
              boxShadow: theme.customColors.shadow.secondary,
              background: theme.customColors.surface.card,
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${theme.customColors.border.primary}`,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.customColors.text.primary,
                mb: 1.5,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem', xl: '2.5rem' },
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              Relatório de Vendas Fechadas
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.customColors.text.secondary,
                mb: 2,
                fontSize: { xs: '0.875rem', sm: '1rem', lg: '1.125rem' },
                lineHeight: 1.4,
                textAlign: 'center',
              }}
            >
              Vendas de listas que foram fechadas e produtos retornados ao estoque
            </Typography>
          </Paper>
        </Fade>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 1,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              maxWidth: 900,
              mx: 'auto',
              boxShadow: theme.customColors.shadow.secondary,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
          width: '100%',
          maxWidth: 900,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel>Mês</InputLabel>
            <Select
              value={selectedMonth}
              label="Mês"
              onChange={(e) => setSelectedMonth(e.target.value)}
              sx={{
                borderRadius: 1,
                background: theme.customColors.surface.card,
              }}
            >
              <MenuItem value="">Todos os meses</MenuItem>
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel>Ano</InputLabel>
            <Select
              value={selectedYear}
              label="Ano"
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{
                borderRadius: 1,
                background: theme.customColors.surface.card,
              }}
            >
              <MenuItem value="">Todos os anos</MenuItem>
              {years.map((year) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Resumo Geral */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
          width: '100%',
          maxWidth: 1200,
        }}>
          <Fade in timeout={400}>
            <Card sx={{
              background: theme.customColors.surface.card,
              border: `1.5px solid ${theme.customColors.border.primary}`,
              borderRadius: 1,
              boxShadow: theme.customColors.shadow.secondary,
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <SalesIcon sx={{ 
                  fontSize: 40, 
                  color: theme.customColors.status.success,
                  mb: 1
                }} />
                <Typography variant="h6" sx={{ 
                  color: theme.customColors.text.secondary,
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}>
                  Total de Vendas
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.customColors.status.success,
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                }}>
                  {formatCurrency(totalSales)}
                </Typography>
              </CardContent>
            </Card>
          </Fade>

          <Fade in timeout={600}>
            <Card sx={{
              background: theme.customColors.surface.card,
              border: `1.5px solid ${theme.customColors.border.primary}`,
              borderRadius: 1,
              boxShadow: theme.customColors.shadow.secondary,
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <CommissionIcon sx={{ 
                  fontSize: 40, 
                  color: theme.customColors.status.warning,
                  mb: 1
                }} />
                <Typography variant="h6" sx={{ 
                  color: theme.customColors.text.secondary,
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}>
                  Total de Comissões
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.customColors.status.warning,
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                }}>
                  {formatCurrency(totalCommission)}
                </Typography>
              </CardContent>
            </Card>
          </Fade>

          <Fade in timeout={800}>
            <Card sx={{
              background: theme.customColors.surface.card,
              border: `1.5px solid ${theme.customColors.border.primary}`,
              borderRadius: 1,
              boxShadow: theme.customColors.shadow.secondary,
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <StockIcon sx={{ 
                  fontSize: 40, 
                  color: theme.customColors.status.info,
                  mb: 1
                }} />
                <Typography variant="h6" sx={{ 
                  color: theme.customColors.text.secondary,
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}>
                  Produtos Vendidos
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.customColors.status.info,
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                }}>
                  {totalProducts}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Box>

        {/* Relatório por Mês */}
        {Object.keys(salesByMonth).length > 0 ? (
          <Box sx={{
            width: '100%',
            maxWidth: 1200,
            mb: 4,
          }}>
            {Object.entries(salesByMonth).map(([monthKey, monthData], index) => (
              <Fade in key={monthKey} timeout={400 + (index * 200)}>
                <Paper
                  elevation={0}
                  sx={{
                    mb: 3,
                    background: theme.customColors.surface.card,
                    border: `1.5px solid ${theme.customColors.border.primary}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: theme.customColors.shadow.secondary,
                  }}
                >
                  {/* Header do Mês */}
                  <Box sx={{
                    p: { xs: 2, sm: 3 },
                    background: alpha(theme.customColors.primary.main, 0.05),
                    borderBottom: `1px solid ${theme.customColors.border.primary}`,
                  }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 2,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ color: theme.customColors.primary.main }} />
                        <Typography variant="h5" sx={{
                          fontWeight: 700,
                          color: theme.customColors.text.primary,
                          fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        }}>
                          {months.find(m => m.value === monthData.month)?.label} {monthData.year}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${monthData.sales.length} vendas`}
                          size="small"
                          sx={{
                            background: alpha(theme.customColors.status.success, 0.1),
                            color: theme.customColors.status.success,
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={formatCurrency(monthData.total)}
                          size="small"
                          sx={{
                            background: alpha(theme.customColors.status.info, 0.1),
                            color: theme.customColors.status.info,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Tabela de Vendas */}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{
                          background: alpha(theme.customColors.primary.main, 0.05),
                        }}>
                          <TableCell sx={{ fontWeight: 600, color: theme.customColors.text.primary }}>
                            Lista/Vendedor
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: theme.customColors.text.primary }}>
                            Produtos
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: theme.customColors.text.primary }}>
                            Total
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: theme.customColors.text.primary }}>
                            Comissão
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: theme.customColors.text.primary }}>
                            Data Fechamento
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monthData.sales.map((sale: ClosedSale) => (
                          <TableRow key={sale._id} sx={{
                            '&:hover': {
                              background: alpha(theme.customColors.primary.main, 0.02),
                            },
                          }}>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2" sx={{
                                  fontWeight: 600,
                                  color: theme.customColors.text.primary,
                                }}>
                                  {sale.listName}
                                </Typography>
                                <Typography variant="caption" sx={{
                                  color: theme.customColors.text.secondary,
                                }}>
                                  {sale.userName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                {sale.products.map((product, idx) => (
                                  <Typography key={idx} variant="body2" sx={{
                                    color: theme.customColors.text.secondary,
                                    fontSize: '0.875rem',
                                  }}>
                                    {product.name} (x{product.quantity})
                                  </Typography>
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                color: theme.customColors.status.success,
                              }}>
                                {formatCurrency(sale.total)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                color: theme.customColors.status.warning,
                              }}>
                                {formatCurrency(sale.commission)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{
                                color: theme.customColors.text.secondary,
                                fontSize: '0.875rem',
                              }}>
                                {formatDate(sale.closedAt)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Fade>
            ))}
          </Box>
        ) : (
          <Fade in>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4,
                borderRadius: 1,
                fontSize: '1.1rem',
                maxWidth: 900,
                mx: 'auto',
                boxShadow: theme.customColors.shadow.secondary,
              }}
            >
              Nenhuma venda fechada encontrada para o período selecionado.
            </Alert>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default ClosedSalesReport; 