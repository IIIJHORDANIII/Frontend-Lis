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
  alpha,
  Container,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Link as RouterLink,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  AccountCircle,
  ExitToApp,
  Store,
  Add,
  PersonAdd,
  List as ListIcon,
  Inventory,
  TrendingUp,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const adminMenuItems = [
    { path: '/admin/products', label: 'Estoque', icon: <Store /> },
    { path: '/admin/products/new', label: 'Novo Produto', icon: <Add /> },
    { path: '/admin/register', label: 'Nova Vendedora', icon: <PersonAdd /> },
    { path: '/custom-lists/new', label: 'Nova Lista', icon: <ListIcon /> },
    { path: '/admin/stock-lists', label: 'Listas de Estoque', icon: <Inventory /> },
  ];

  const userMenuItems = [
    { path: '/user-lists', label: 'Minhas Listas', icon: <ListIcon /> },
    { path: '/sales', label: 'Vendas', icon: <TrendingUp /> },
  ];

  const adminMenuItemsExtended = [
    ...adminMenuItems,
    { path: '/sales/summary', label: 'Resumo de Vendas', icon: <TrendingUp /> },
  ];

  const renderMenuItems = (items: typeof adminMenuItems) => (
    items.map((item) => (
      <Button
        key={item.path}
        color="inherit"
        component={RouterLink}
        to={item.path}
        startIcon={item.icon}
        sx={{
          borderRadius: 3,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: isActiveRoute(item.path) 
            ? 'rgba(255, 255, 255, 0.2)'
            : 'transparent',
          color: isActiveRoute(item.path) ? '#fff' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: isActiveRoute(item.path) ? 'blur(10px)' : 'none',
          border: isActiveRoute(item.path) ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px) scale(1.02)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {item.label}
      </Button>
    ))
  );

  const renderMobileMenuItems = (items: typeof adminMenuItems) => (
    items.map((item) => (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          component={RouterLink}
          to={item.path}
          selected={isActiveRoute(item.path)}
          onClick={() => setMobileMenuOpen(false)}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 0.5,
            transition: 'all 0.3s ease',
            '&.Mui-selected': {
              backgroundColor: 'rgba(45, 55, 72, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(45, 55, 72, 0.15)',
              }
            },
            '&:hover': {
              backgroundColor: 'rgba(45, 55, 72, 0.05)',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    ))
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          top: 16,
          left: 24,
          right: 24,
          width: 'auto',
          borderRadius: 3,
          zIndex: theme.zIndex.appBar
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 2, px: 0 }}>
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
                  filter: 'brightness(0) invert(1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    opacity: 0.8
                  }
                }}
              />
            </Box>
            
            {isAuthenticated && !isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                {isAdmin ? renderMenuItems(adminMenuItems) : renderMenuItems(userMenuItems)}
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  {isMobile && (
                    <IconButton
                      color="inherit"
                      onClick={handleMobileMenuToggle}
                      sx={{
                        borderRadius: 2,
                        p: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <MenuIcon />
                    </IconButton>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={isAdmin ? 'Admin' : 'Usuário'}
                      size="small"
                      sx={{
                        backgroundColor: isAdmin ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        borderRadius: 2,
                        p: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.02)',
                      background: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  Entrar
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2d3748', fontWeight: 700 }}>
            Menu
          </Typography>
          <List>
            {isAdmin ? renderMobileMenuItems(adminMenuItemsExtended) : renderMobileMenuItems(userMenuItems)}
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  color: '#e53e3e',
                  '&:hover': {
                    backgroundColor: 'rgba(229, 62, 62, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 3,
            mt: 1,
            minWidth: 200,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <MenuItem
          onClick={handleClose}
          sx={{
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(45, 55, 72, 0.1)',
            }
          }}
        >
          <AccountCircle sx={{ mr: 2, color: '#4a5568' }} />
          <Typography variant="body2" sx={{ color: '#2d3748', fontWeight: 600 }}>
            {user?.email || 'Usuário'}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            mx: 1,
            mt: 0.5,
            color: '#e53e3e',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(229, 62, 62, 0.1)',
            }
          }}
        >
          <ExitToApp sx={{ mr: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Sair
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;