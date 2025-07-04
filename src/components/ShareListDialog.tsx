import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../services/api';

interface ShareListDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  listId: string | null;
}

const ShareListDialog: React.FC<ShareListDialogProps> = ({
  open,
  onClose,
  onSuccess,
  listId
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);

  const handleShare = async () => {
    if (!listId) return;
    
    try {
      setLoading(true);
      setError('');
      await api.post(`/custom-lists/${listId}/share`, { email });
      setSharedUsers([...sharedUsers, email]);
      setEmail('');
    } catch (err) {
      setError('Erro ao compartilhar lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = async (userEmail: string) => {
    if (!listId) return;

    try {
      setLoading(true);
      setError('');
      await api.delete(`/custom-lists/${listId}/share`, {
        data: { email: userEmail }
      });
      setSharedUsers(sharedUsers.filter(email => email !== userEmail));
    } catch (err) {
      setError('Erro ao remover compartilhamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          '@media (min-width: 1920px)': {
            maxWidth: 700,
            minWidth: 500,
            margin: '32px auto',
          },
        }
      }}
    >
      <DialogTitle>Compartilhar Lista</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

              <TextField
          autoFocus
          margin="dense"
          label="Email do usuário"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        {sharedUsers.length > 0 && (
          <List>
            {sharedUsers.map((userEmail) => (
              <ListItem key={userEmail}>
                <ListItemText primary={userEmail} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveShare(userEmail)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleShare}
          color="primary"
          disabled={loading || !email}
        >
          {loading ? <CircularProgress size={24} /> : 'Compartilhar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareListDialog; 