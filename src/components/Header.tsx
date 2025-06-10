import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Link as RouterLink,
  useNavigate
} from 'react-router-dom';
import {
  AccountCircle,
  ExitToApp,
  Store,
  Add,
  PersonAdd,
  List,
  Inventory,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #383A29 0%, #4a4d35 100%)',
        borderBottom: '1px solid rgba(217, 217, 217, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src="/Logo Vector.png"
            alt="Lis System Logo"
            onClick={() => navigate('/')}
            sx={{
              height: 40,
              width: 'auto',
              maxWidth: 150,
              objectFit: 'contain',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                opacity: 0.8
              }
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/products"
                    startIcon={<Store />}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Estoque
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/products/new"
                    startIcon={<Add />}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Novo Produto
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/register"
                    startIcon={<PersonAdd />}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Nova Vendedora
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/custom-lists/new"
                    startIcon={<List />}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Nova Lista
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/stock-lists"
                    startIcon={<Inventory />}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Listas de Estoque
                  </Button>
                </>
              )}
           
              <Button
                color="inherit"
                component={RouterLink}
                to={isAdmin ? "/sales/summary" : "/sales"}
                startIcon={<TrendingUp />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Vendas
              </Button>
              
              <Box sx={{ ml: 2 }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: alpha(theme.palette.common.white, 0.2),
                      color: 'white',
                      fontWeight: 600,
                      border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 200,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Logado como
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user?.email}
                    </Typography>
                    {isAdmin && (
                      <Chip 
                        label="Admin" 
                        size="small" 
                        color="primary" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1)
                      }
                    }}
                  >
                    <ExitToApp sx={{ mr: 2, color: 'error.main' }} />
                    Sair
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Entrar
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;