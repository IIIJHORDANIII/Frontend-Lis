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
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    { path: '/sales/summary', label: 'Resumo de Vendas', icon: <TrendingUp /> },
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
        startIcon={!isSmallMobile ? item.icon : undefined}
        sx={{
          borderRadius: 3,
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 1, sm: 1.5 },
          fontWeight: 600,
          fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
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
          '@media (max-width: 600px)': {
            px: 1,
            fontSize: '0.625rem',
            minWidth: 'auto',
            minHeight: '36px',
          },
        }}
      >
        {isSmallMobile ? item.label.split(' ')[0] : item.label}
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
            py: { xs: 1.5, sm: 2 },
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
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label} 
            primaryTypographyProps={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
            }}
          />
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 1px 8px rgba(45,55,72,0.08)',
          top: 0,
          left: 0,
          right: 0,
          width: '100vw',
          borderRadius: '0 !important',
          minHeight: { xs: 48, sm: 56, md: 64 },
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Container maxWidth={false} disableGutters sx={{
          px: { xs: 1, sm: 2, md: 3 },
          mx: 0,
          width: '100vw',
          borderRadius: '0 !important',
          position: 'relative',
        }}>
          <Toolbar sx={{ 
            minHeight: { xs: 48, sm: 56, md: 64 },
            height: { xs: 48, sm: 56, md: 64 },
            px: { xs: 0.5, sm: 1.5, md: 3 },
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0,
            borderRadius: '0 !important',
            position: 'relative',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 2 }, flexShrink: 0, zIndex: 2 }}>
              <Box
                component="img"
                src="/Logo Vector.png"
                alt="Lis System Logo"
                onClick={() => navigate('/')}
                sx={{
                  height: { xs: 22, sm: 28, md: 36 },
                  width: 'auto',
                  maxWidth: { xs: 40, sm: 60, md: 120 },
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
              <Box sx={{ 
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex', 
                gap: { xs: 0.5, sm: 1, md: 2 }, 
                alignItems: 'center', 
                zIndex: 1,
                background: 'none',
              }}>
                {isAdmin ? renderMenuItems(adminMenuItems) : renderMenuItems(userMenuItems)}
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', ml: 'auto', flexShrink: 0, zIndex: 2 }}>
              {isAuthenticated ? (
                <>
                  {isMobile && (
                    <IconButton
                      color="inherit"
                      onClick={handleMobileMenuToggle}
                      sx={{
                        borderRadius: 2,
                        p: 0.25,
                        fontSize: 18,
                        '& .MuiSvgIcon-root': { fontSize: 20 },
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {!isSmallMobile && (
                      <Chip
                        label={isAdmin ? 'Admin' : 'Usuário'}
                        size="small"
                        sx={{
                          backgroundColor: isAdmin ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: { xs: '0.5rem', sm: '0.625rem', md: '0.75rem' },
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          height: { xs: 14, sm: 20, md: 24 },
                          '& .MuiChip-label': {
                            px: { xs: 0.5, sm: 1 },
                          },
                        }}
                      />
                    )}
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        borderRadius: 2,
                        p: 0.1,
                        transition: 'all 0.3s ease',
                        ml: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.7rem',
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
                    px: 1,
                    py: 0.25,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '24px',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.02)',
                      background: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {isSmallMobile ? 'Entrar' : 'Entrar'}
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '260px', sm: '280px', md: '320px' },
            pt: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#2d3748', 
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            }}
          >
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
                  py: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    backgroundColor: 'rgba(229, 62, 62, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText 
                  primary="Sair" 
                  primaryTypographyProps={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 3,
            mt: 1,
            minWidth: { xs: 120, sm: 140, md: 160 },
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
            mx: 0.5,
            mb: 0.25,
            py: { xs: 0.5, sm: 0.75 },
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(45, 55, 72, 0.1)',
            }
          }}
        >
          <AccountCircle sx={{ mr: 1, color: '#4a5568', fontSize: 18 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#2d3748', 
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
            }}
          >
            {user?.email || 'Usuário'}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            mt: 0.25,
            color: '#e53e3e',
            py: { xs: 0.5, sm: 0.75 },
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(229, 62, 62, 0.1)',
            }
          }}
        >
          <ExitToApp sx={{ mr: 1, fontSize: 18 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
            }}
          >
            Sair
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;