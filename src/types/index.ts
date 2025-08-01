export interface User {
  _id: string;
  id?: string;
  email: string;
  name?: string;
  isAdmin: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  costPrice: number;
  finalPrice: number;
  commission: number;
  profit: number;
  category: string;
  image: string;
  quantity?: number;
}

export interface ProductWithQuantity {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface CustomList {
  _id: string;
  name: string;
  description: string;
  products: ProductWithQuantity[];
  userId: string;
  isPublic: boolean;
  sharedWith: User[];
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    isAdmin: boolean;
  };
}

export interface Sale {
  _id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  total: number;
  commission: number;
  createdAt: string;
}