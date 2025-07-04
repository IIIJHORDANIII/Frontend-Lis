import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress, Container, alpha, useTheme } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import CustomListForm from './components/CustomListForm';
import EditListForm from './components/EditListForm';
import CustomLists from './components/CustomLists';
import Sales from './components/Sales';
import SalesSummary from './components/SalesSummary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminStockLists from './components/AdminStockLists';
import UserStockLists from './components/UserStockLists';
import PrivacyPolicy from './components/PrivacyPolicy';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/user-lists" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  return (
    <Routes>
      {/* Landing Page - Sem Header */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Login Page - Sem Header */}
      <Route path="/login" element={<Login />} />
      
      {/* Privacy Policy - Sem Header */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Protected Routes - Com Header */}
      <Route path="/dashboard" element={
        isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh' 
          }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Navigate to={isAuthenticated ? (isAdmin ? "/admin/products" : "/user-lists") : "/login"} />
        )
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/products" element={<AdminRoute><AppLayout><ProductList /></AppLayout></AdminRoute>} />
      <Route path="/admin/products/new" element={<AdminRoute><AppLayout><ProductForm /></AppLayout></AdminRoute>} />
      <Route path="/admin/register" element={<AdminRoute><AppLayout><Register /></AppLayout></AdminRoute>} />
      <Route path="/admin/stock-lists" element={<AdminRoute><AppLayout><AdminStockLists /></AppLayout></AdminRoute>} />
      <Route path="/sales/summary" element={<AdminRoute><AppLayout><SalesSummary /></AppLayout></AdminRoute>} />
      
      {/* User Routes */}
      <Route path="/custom-lists" element={<ProtectedRoute><AppLayout><CustomLists /></AppLayout></ProtectedRoute>} />
      <Route path="/custom-lists/new" element={<AdminRoute><AppLayout><CustomListForm /></AppLayout></AdminRoute>} />
      <Route path="/edit-list/:id" element={<AdminRoute><AppLayout><EditListForm /></AppLayout></AdminRoute>} />
      <Route path="/sales" element={<ProtectedRoute><AppLayout><Sales /></AppLayout></ProtectedRoute>} />
      <Route path="/user-lists" element={<ProtectedRoute><AppLayout><UserStockLists /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
};

// Componente para layout com Header
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: 'Poppins, Inter, Montserrat, Arial',
    }}>
      {/* Subtle Gradient Background */}
      <Box sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 12s ease-in-out infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }} />
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container 
          maxWidth="xl"
          component="main" 
          sx={{ 
            flexGrow: 1,
            py: { xs: 1, sm: 2, md: 3, lg: 4 },
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            position: 'relative',
            zIndex: 1,
            pt: { 
              xs: 10, // 48px header + 2px top + 2px bottom + 16px padding
              sm: 12, // 56px header + 8px top + 8px bottom + 16px padding  
              md: 14, // 64px header + 16px top + 16px bottom + 16px padding
              lg: 16  // 64px header + 24px top + 24px bottom + 16px padding
            },
            '@media (max-width: 600px)': {
              px: 0.5,
              py: 0.5,
              pt: 9, // Ajuste fino para mobile
            },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
