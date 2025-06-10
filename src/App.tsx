import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/user-lists" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2 },
          maxWidth: '1400px',
          mx: 'auto',
          width: '100%'
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/products" element={<AdminRoute><ProductList /></AdminRoute>} />
          <Route path="/admin/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
          <Route path="/admin/register" element={<AdminRoute><Register /></AdminRoute>} />
          <Route path="/sales/summary" element={<AdminRoute><SalesSummary /></AdminRoute>} />
          <Route path="/custom-lists" element={<ProtectedRoute><CustomLists /></ProtectedRoute>} />
          <Route path="/custom-lists/new" element={<AdminRoute><CustomListForm /></AdminRoute>} />
          <Route path="/edit-list/:id" element={<AdminRoute><EditListForm /></AdminRoute>} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/admin/stock-lists" element={<AdminRoute><AdminStockLists /></AdminRoute>} />
          <Route path="/user-lists" element={<ProtectedRoute><UserStockLists /></ProtectedRoute>} />
          <Route path="/" element={
            isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Navigate to={isAuthenticated ? (isAdmin ? "/admin/products" : "/user-lists") : "/login"} />
            )
          } />
        </Routes>
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
