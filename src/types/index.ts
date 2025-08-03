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
  reservedStock?: number;
  availableStock?: number;
  isFullyReserved?: boolean;
}

export interface ProductWithQuantity {
  productId: string;
  quantity: number;
  availableQuantity?: number;
  displayAvailableQuantity?: number;
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
  isOutOfStock?: boolean;
  isOutOfStockForAdmin?: boolean;
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

export interface CondicionalProduct {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Condicional {
  _id: string;
  sellerId: string;
  clientName: string;
  products: CondicionalProduct[];
  totalOriginal: number;
  discount: number;
  totalWithDiscount: number;
  status: 'aberto' | 'fechado' | 'excluido';
  notes: string;
  closedAt?: string;
  saleId?: string;
  sale?: Sale;
  createdAt: string;
  updatedAt: string;
}