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
  price: number;
  commission: number;
  category: string;
  image: string;
  quantity?: number;
}

export interface CustomList {
  _id: string;
  name: string;
  description: string;
  products: Product[];
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