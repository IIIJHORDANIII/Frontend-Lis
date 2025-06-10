import axios from 'axios';
import { User, Product, AuthResponse, CustomList } from '../types';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (name: string, email: string, cpf: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/register', { name, email, cpf, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const createAdmin = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/admin/create', { email, password });
    return response.data;
  } catch (error) {
    console.error('Create admin error:', error);
    throw error;
  }
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  try {
    const response = await api.post<Product>('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products...');
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const response = await api.get<Product[]>('/products');
    console.log('Products response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    throw error;
  }
};

export const createCustomList = async (
  name: string,
  products: string[],
  sharedWith?: string[],
  isPublic?: boolean,
  description?: string
): Promise<CustomList> => {
  try {
    console.log('Creating custom list with data:', { name, products, sharedWith, isPublic, description });
    const token = localStorage.getItem('token');
    console.log('Auth token:', token ? 'Present' : 'Missing');
    
    const response = await api.post<CustomList>('/custom-lists', {
      name,
      products,
      sharedWith,
      isPublic,
      description
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Custom list created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating custom list:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request headers:', error.config?.headers);
    }
    throw error;
  }
};

export const getCustomLists = async (): Promise<CustomList[]> => {
  try {
    const response = await api.get<CustomList[]>('/custom-lists');
    return response.data;
  } catch (error) {
    console.error('Error fetching custom lists:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<{ _id: string; email: string }[]> => {
  try {
    const response = await api.get<{ _id: string; email: string }[]>('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const shareCustomList = async (listId: string, userIds: string[]): Promise<void> => {
  try {
    await api.post(`/custom-lists/${listId}/share`, { sharedWith: userIds });
  } catch (error) {
    console.error('Error sharing list:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Deleting product:', {
      productId,
      token: token.substring(0, 10) + '...' // Log only part of the token for security
    });

    const response = await api.delete(`/products/${productId}`);
    console.log('Delete response:', response.data);
    
    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(error.response.data?.error || 'Failed to delete product');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check if the server is running.');
      }
    }
    throw error;
  }
};

export const updateProduct = async (productId: string, productData: { name: string; description: string; price: number }): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}; 

// Funções de vendas
export const getSales = async () => {
  const response = await api.get('/sales');
  return response.data;
};

export const createSale = async (saleData: {
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  total: number;
  commission: number;
}) => {
  const response = await api.post('/sales', saleData);
  return response.data;
};

export const getSalesSummary = async () => {
  const response = await api.get('/sales/summary');
  return response.data;
};

export const getCustomListById = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/custom-lists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateCustomList = async (id: string, listData: any) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/custom-lists/${id}`, listData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export { api };