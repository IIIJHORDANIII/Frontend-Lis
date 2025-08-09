import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, useTheme } from '@mui/material';
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
import { ThemeProvider } from './contexts/ThemeContext';
import AdminStockLists from './components/AdminStockLists';
import PrivacyPolicy from './components/PrivacyPolicy';
import Condicionais from './components/Condicionais';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import ClosedSalesReport from './components/ClosedSalesReport';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner message="Carregando..." size="large" />;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner message="Carregando..." size="large" />;
  }
  
  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/sales" />;
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
          <LoadingSpinner message="Carregando..." size="large" />
        ) : (
          <Navigate to={isAuthenticated ? (isAdmin ? "/admin/products" : "/sales") : "/login"} />
        )
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/products" element={<AdminRoute><AppLayout><ProductList /></AppLayout></AdminRoute>} />
      <Route path="/admin/products/new" element={<AdminRoute><AppLayout><ProductForm /></AppLayout></AdminRoute>} />
      <Route path="/admin/register" element={<AdminRoute><AppLayout><Register /></AppLayout></AdminRoute>} />
      <Route path="/admin/stock-lists" element={<AdminRoute><AppLayout><AdminStockLists /></AppLayout></AdminRoute>} />
      <Route path="/sales/summary" element={<AdminRoute><AppLayout><SalesSummary /></AppLayout></AdminRoute>} />
      <Route path="/sales/closed-report" element={<AdminRoute><AppLayout><ClosedSalesReport /></AppLayout></AdminRoute>} />
      
      {/* User Routes */}
      <Route path="/custom-lists" element={<ProtectedRoute><AppLayout><CustomLists /></AppLayout></ProtectedRoute>} />
      <Route path="/custom-lists/new" element={<AdminRoute><AppLayout><CustomListForm /></AppLayout></AdminRoute>} />
      <Route path="/edit-list/:id" element={<AdminRoute><AppLayout><EditListForm /></AppLayout></AdminRoute>} />
      <Route path="/sales" element={<ProtectedRoute><AppLayout><Sales /></AppLayout></ProtectedRoute>} />
      <Route path="/condicionais" element={<ProtectedRoute><AppLayout><Condicionais /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
};

// Componente para layout com Header
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: 'Poppins, Inter, Montserrat, Arial',
    }}>
      {/* Dynamic Gradient Background */}
      <Box sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)'
          : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 25%, #e2e8f0 50%, #edf2f7 75%, #f7fafc 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientMove 20s ease-in-out infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }} />
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            py: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
            position: 'relative',
            zIndex: 1,
            pt: { 
              xs: 20, // 64px header + 112px padding
              sm: 22, // 72px header + 112px padding
              md: 24, // 80px header + 112px padding
              lg: 26, // 88px header + 112px padding
              xl: 28  // 88px header + 120px padding
            },
            '@media (max-width: 600px)': {
              px: 2,
              py: 2,
              pt: 18, // Adjusted for mobile
            },
            '@media (min-width: 1920px)': {
              px: 8,
              py: 8,
              pt: 30, // Adjusted for large screens
            },
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
