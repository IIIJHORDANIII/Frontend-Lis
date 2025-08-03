import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Condicional, Product } from '../types';
import {
  getCondicionais,
  getCondicionalById,
  updateCondicional,
  closeCondicional,
  deleteCondicional,
  getProducts
} from '../services/api';
import { formatCurrency } from '../utils/format';

const Condicionais: React.FC = () => {
  const theme = useTheme();
  const [condicionais, setCondicionais] = useState<Condicional[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'aberto' | 'fechado' | 'excluido' | 'todos'>('todos');
  const [selectedCondicional, setSelectedCondicional] = useState<Condicional | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    clientName: '',
    discount: 0,
    notes: ''
  });

  useEffect(() => {
    loadCondicionais();
    loadProducts();
  }, [selectedStatus]);

  const loadCondicionais = async () => {
    try {
      setLoading(true);
      const status = selectedStatus === 'todos' ? undefined : selectedStatus;
      const data = await getCondicionais(status);
      setCondicionais(data);
    } catch (error) {
      setError('Erro ao carregar condicionais');
      console.error('Erro ao carregar condicionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleEdit = (condicional: Condicional) => {
    setSelectedCondicional(condicional);
    setEditForm({
      clientName: condicional.clientName,
      discount: condicional.discount,
      notes: condicional.notes
    });
    setEditDialogOpen(true);
  };

  const handleView = async (condicionalId: string) => {
    try {
      const condicional = await getCondicionalById(condicionalId);
      setSelectedCondicional(condicional);
      setViewDialogOpen(true);
    } catch (error) {
      setError('Erro ao carregar detalhes do condicional');
    }
  };

  const handleClose = (condicional: Condicional) => {
    setSelectedCondicional(condicional);
    setCloseDialogOpen(true);
  };

  const handleDelete = (condicional: Condicional) => {
    setSelectedCondicional(condicional);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCondicional) return;

    try {
      await updateCondicional(selectedCondicional._id, editForm);
      setSuccess('Condicional atualizado com sucesso!');
      setEditDialogOpen(false);
      loadCondicionais();
    } catch (error) {
      setError('Erro ao atualizar condicional');
    }
  };

  const handleConfirmClose = async () => {
    if (!selectedCondicional) return;

    try {
      await closeCondicional(selectedCondicional._id);
      setSuccess('Condicional fechado com sucesso!');
      setCloseDialogOpen(false);
      loadCondicionais();
    } catch (error) {
      setError('Erro ao fechar condicional');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCondicional) return;

    try {
      await deleteCondicional(selectedCondicional._id);
      setSuccess('Condicional excluído com sucesso!');
      setDeleteDialogOpen(false);
      loadCondicionais();
    } catch (error) {
      setError('Erro ao excluir condicional');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'warning';
      case 'fechado':
        return 'success';
      case 'excluido':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'Aberto';
      case 'fechado':
        return 'Fechado';
      case 'excluido':
        return 'Excluído';
      default:
        return status;
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando condicionais...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciar Condicionais
      </Typography>

      {/* Filtros */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value as any)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="aberto">Abertos</MenuItem>
            <MenuItem value="fechado">Fechados</MenuItem>
            <MenuItem value="excluido">Excluídos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lista de Condicionais */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Produtos</TableCell>
              <TableCell>Total Original</TableCell>
              <TableCell>Desconto</TableCell>
              <TableCell>Total Final</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {condicionais.map((condicional) => (
              <TableRow key={condicional._id}>
                <TableCell>{condicional.clientName}</TableCell>
                <TableCell>
                  {new Date(condicional.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {condicional.products.length} produto(s)
                </TableCell>
                <TableCell>{formatCurrency(condicional.totalOriginal)}</TableCell>
                <TableCell>{formatCurrency(condicional.discount)}</TableCell>
                <TableCell>{formatCurrency(condicional.totalWithDiscount)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(condicional.status)}
                    color={getStatusColor(condicional.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleView(condicional._id)}
                    size="small"
                    title="Visualizar"
                  >
                    <ViewIcon />
                  </IconButton>
                  
                  {condicional.status === 'aberto' && (
                    <>
                      <IconButton
                        onClick={() => handleEdit(condicional)}
                        size="small"
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleClose(condicional)}
                        size="small"
                        title="Fechar"
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(condicional)}
                        size="small"
                        title="Excluir"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Visualização */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalhes do Condicional - {selectedCondicional?.clientName}
        </DialogTitle>
        <DialogContent>
          {selectedCondicional && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Cliente:</Typography>
                  <Typography>{selectedCondicional.clientName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Data:</Typography>
                  <Typography>
                    {new Date(selectedCondicional.createdAt).toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Chip
                    label={getStatusText(selectedCondicional.status)}
                    color={getStatusColor(selectedCondicional.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Original:</Typography>
                  <Typography>{formatCurrency(selectedCondicional.totalOriginal)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Desconto:</Typography>
                  <Typography>{formatCurrency(selectedCondicional.discount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Final:</Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(selectedCondicional.totalWithDiscount)}
                  </Typography>
                </Grid>
              </Grid>

              {selectedCondicional.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Observações:</Typography>
                  <Typography>{selectedCondicional.notes}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Produtos
              </Typography>
              <List>
                {selectedCondicional.products.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={getProductName(item.productId)}
                      secondary={`Quantidade: ${item.quantity} | Preço: ${formatCurrency(item.price)}`}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle1">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Condicional</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Cliente"
            value={editForm.clientName}
            onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Desconto"
            type="number"
            value={editForm.discount}
            onChange={(e) => setEditForm({ ...editForm, discount: Number(e.target.value) })}
            margin="normal"
            InputProps={{
              startAdornment: <Typography>R$</Typography>
            }}
          />
          <TextField
            fullWidth
            label="Observações"
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Fechamento */}
      <Dialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
      >
        <DialogTitle>Confirmar Fechamento</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja fechar este condicional? 
            Isso irá criar uma nova venda com os produtos selecionados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmClose} variant="contained" color="success">
            Fechar Condicional
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este condicional? 
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Condicionais; 