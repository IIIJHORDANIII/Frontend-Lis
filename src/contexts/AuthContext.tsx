import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  id?: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('AuthContext useEffect - token:', token);
    console.log('AuthContext useEffect - userStr:', userStr);
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('AuthContext useEffect - userData:', userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.isAdmin);
        setUser(userData);
      } catch (error) {
        console.error('AuthContext useEffect - error parsing user:', error);
        // Handle error silently
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    console.log('AuthContext login - token:', token);
    console.log('AuthContext login - userData:', userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};