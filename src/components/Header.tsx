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
  Menu as MenuIcon,
  LightMode,
  DarkMode,
  Settings
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { themeMode, isDark, toggleTheme, setThemeMode } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
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
          py: { xs: 1, sm: 1.5, md: 2 },
          fontWeight: 600,
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem', lg: '1rem' },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: isActiveRoute(item.path) 
            ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(26, 32, 44, 0.1)')
            : 'transparent',
          color: isActiveRoute(item.path) 
            ? (theme.palette.mode === 'dark' ? '#fff' : '#1a202c')
            : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.8)'),
          backdropFilter: isActiveRoute(item.path) ? 'blur(10px)' : 'none',
          border: isActiveRoute(item.path) ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
          minHeight: { xs: '36px', sm: '40px', md: '44px' },
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.15)' 
              : 'rgba(26, 32, 44, 0.08)',
            transform: 'translateY(-2px) scale(1.02)',
            color: theme.palette.mode === 'dark' ? '#fff' : '#1a202c',
            backdropFilter: 'blur(10px)',
            border: theme.palette.mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.3)' 
              : '1px solid rgba(26, 32, 44, 0.2)',
          },
        }}
      >
        {isExtraSmallMobile ? item.label.split(' ')[0] : 
         isSmallMobile ? item.label.split(' ').slice(0, 2).join(' ') : item.label}
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
          background: theme.customColors.surface.header,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.customColors.border.header}`,
          boxShadow: theme.customColors.shadow.header,
          top: 0,
          left: 0,
          right: 0,
          width: '100vw',
          borderRadius: '0 !important',
          minHeight: { xs: 56, sm: 64, md: 72, lg: 80 },
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Container maxWidth={false} disableGutters sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          mx: 0,
          width: '100vw',
          borderRadius: '0 !important',
        }}>
          <Toolbar sx={{ 
            minHeight: { xs: 56, sm: 64, md: 72, lg: 80 },
            height: { xs: 56, sm: 64, md: 72, lg: 80 },
            px: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 2, sm: 3, md: 4, lg: 6 },
          }}>
            {/* Logo Section */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              minWidth: 0,
              flexShrink: 0,
            }}>
              <Box
                component="img"
                src="/Logo Vector.png"
                alt="Lis System Logo"
                onClick={() => navigate('/')}
                sx={{
                  height: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
                  width: 'auto',
                  maxWidth: { xs: 80, sm: 90, md: 100, lg: 110, xl: 120 },
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    opacity: 0.8
                  }
                }}
              />
            </Box>

            {/* Navigation Menu - Desktop */}
            {!isMobile && isAuthenticated && (
              <Box sx={{ 
                display: 'flex',
                gap: { xs: 2, sm: 2.5, md: 3, lg: 4, xl: 5 },
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}>
                {isAdmin ? renderMenuItems(adminMenuItems) : renderMenuItems(userMenuItems)}
              </Box>
            )}

            {/* User Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              minWidth: 0,
              flexShrink: 0,
              gap: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
            }}>
              {isAuthenticated ? (
                <>
                  {/* Theme Toggle Button */}
                  <IconButton
                    color="inherit"
                    onClick={toggleTheme}
                    sx={{
                      borderRadius: 2,
                      p: { xs: 0.75, sm: 1, md: 1.25 },
                      fontSize: 18,
                      mr: { xs: 0.5, sm: 1 },
                      '& .MuiSvgIcon-root': { 
                        fontSize: { xs: 20, sm: 22, md: 24 } 
                      },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    {isDark ? <LightMode /> : <DarkMode />}
                  </IconButton>

                  {/* Mobile Menu Button */}
                  {isMobile && (
                    <IconButton
                      color="inherit"
                      onClick={handleMobileMenuToggle}
                      sx={{
                        borderRadius: 2,
                        p: { xs: 0.75, sm: 1, md: 1.25 },
                        fontSize: 18,
                        mr: { xs: 1, sm: 1.5 },
                        '& .MuiSvgIcon-root': { 
                          fontSize: { xs: 24, sm: 26, md: 28 } 
                        },
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

                  {/* User Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, md: 2 } }}>
                    {!isSmallMobile && (
                      <Chip
                        label={isAdmin ? 'Admin' : 'Usuário'}
                        size="small"
                        sx={{
                          backgroundColor: isAdmin 
                            ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(26, 32, 44, 0.15)')
                            : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(26, 32, 44, 0.1)'),
                          color: theme.palette.mode === 'dark' ? '#fff' : '#1a202c',
                          fontWeight: 600,
                          fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem', lg: '0.8125rem' },
                          border: theme.palette.mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.2)' 
                            : '1px solid rgba(26, 32, 44, 0.2)',
                          height: { xs: 20, sm: 24, md: 28, lg: 32 },
                          '& .MuiChip-label': {
                            px: { xs: 1, sm: 1.25, md: 1.5 },
                          },
                        }}
                      />
                    )}
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        borderRadius: 2,
                        p: { xs: 0.5, sm: 0.75, md: 1 },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: { xs: 28, sm: 32, md: 36, lg: 40, xl: 44 },
                          height: { xs: 28, sm: 32, md: 36, lg: 40, xl: 44 },
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : 'rgba(26, 32, 44, 0.15)',
                          color: theme.palette.mode === 'dark' ? '#fff' : '#1a202c',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '0.9375rem' },
                          border: theme.palette.mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.3)' 
                            : '1px solid rgba(26, 32, 44, 0.25)',
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
                    px: { xs: 2, sm: 2.5, md: 3, lg: 4, xl: 5 },
                    py: { xs: 0.75, sm: 1, md: 1.25, lg: 1.5 },
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '0.9375rem' },
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(26, 32, 44, 0.15)',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#1a202c',
                    border: theme.palette.mode === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.3)' 
                      : '1px solid rgba(26, 32, 44, 0.25)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: { xs: '36px', sm: '40px', md: '44px', lg: '48px' },
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.02)',
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(26, 32, 44, 0.25)',
                      border: theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.5)' 
                        : '1px solid rgba(26, 32, 44, 0.4)',
                    },
                  }}
                >
                  {isExtraSmallMobile ? 'Entrar' : 'Entrar'}
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '280px', sm: '320px', md: '360px' },
            pt: 2,
            background: theme.customColors.surface.primary,
            backdropFilter: 'blur(10px)',
            borderLeft: `1px solid ${theme.customColors.border.primary}`,
          },
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              color: theme.customColors.text.primary, 
              fontWeight: 700,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
            }}
          >
            Menu
          </Typography>
          <List>
            {isAdmin ? renderMobileMenuItems(adminMenuItemsExtended) : renderMobileMenuItems(userMenuItems)}
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={toggleTheme}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  py: { xs: 1.5, sm: 2 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(45, 55, 72, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {isDark ? <LightMode /> : <DarkMode />}
                </ListItemIcon>
                <ListItemText 
                  primary={`Modo ${isDark ? 'Claro' : 'Escuro'}`}
                  primaryTypographyProps={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  py: { xs: 1.5, sm: 2 },
                  transition: 'all 0.3s ease',
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

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 3,
            background: theme.customColors.surface.primary,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.customColors.border.primary}`,
            boxShadow: theme.customColors.shadow.primary,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ 
          borderRadius: 2, 
          mx: 1, 
          mb: 0.5,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(45, 55, 72, 0.05)',
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircle sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.email || 'Usuário'}
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ 
          borderRadius: 2, 
          mx: 1, 
          mb: 0.5,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(229, 62, 62, 0.1)',
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ExitToApp sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Sair
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;