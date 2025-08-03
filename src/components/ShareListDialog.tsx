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
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../services/api';
import { useModalOpacity } from '../hooks/useModalOpacity';

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
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);

  // Aplicar correção de opacidade do modal
  useModalOpacity(open);

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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none',
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: 1,
          background: theme.palette.mode === 'dark' ? '#2d3748 !important' : '#ffffff !important',
          border: `1.5px solid ${theme.customColors.border.primary}`,
          boxShadow: theme.customColors.shadow.primary,
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
          '@media (min-width: 1920px)': {
            maxWidth: 700,
            minWidth: 500,
            margin: '32px auto',
          },
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
        color: theme.customColors.text.primary, 
        fontWeight: 600,
        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
      }}>
        Compartilhar Lista
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1,
              background: alpha(theme.customColors.status.error, 0.1),
              border: `1px solid ${alpha(theme.customColors.status.error, 0.3)}`,
              color: theme.customColors.status.error,
              '& .MuiAlert-icon': {
                fontSize: '1.25rem'
              }
            }}
          >
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
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              backgroundColor: alpha(theme.customColors.text.primary, 0.02),
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.customColors.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.customColors.primary.main,
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root': {
              color: theme.customColors.text.secondary,
              '&.Mui-focused': {
                color: theme.customColors.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              color: theme.customColors.text.primary,
            },
          }}
        />

        {sharedUsers.length > 0 && (
          <List>
            {sharedUsers.map((userEmail) => (
              <ListItem 
                key={userEmail}
                sx={{
                  backgroundColor: alpha(theme.customColors.text.primary, 0.02),
                  borderRadius: 1,
                  mb: 1,
                  border: `1px solid ${theme.customColors.border.primary}`,
                }}
              >
                <ListItemText 
                  primary={userEmail} 
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: theme.customColors.text.primary,
                      fontWeight: 500,
                    }
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveShare(userEmail)}
                    disabled={loading}
                    sx={{
                      color: theme.customColors.status.error,
                      backgroundColor: alpha(theme.customColors.status.error, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.customColors.status.error, 0.2),
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            borderRadius: 1,
            fontWeight: 600,
            color: theme.customColors.text.primary,
            '&:hover': {
              backgroundColor: alpha(theme.customColors.text.primary, 0.05),
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleShare}
          disabled={loading || !email}
          sx={{
            borderRadius: 1,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
            color: theme.customColors.text.inverse,
            boxShadow: theme.customColors.shadow.secondary,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: theme.customColors.shadow.primary,
              background: `linear-gradient(135deg, ${theme.customColors.primary.light} 0%, ${theme.customColors.primary.main} 100%)`,
            },
            '&:disabled': {
              background: alpha(theme.customColors.text.primary, 0.12),
              color: alpha(theme.customColors.text.primary, 0.38),
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: theme.customColors.text.inverse }} /> : 'Compartilhar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareListDialog; 