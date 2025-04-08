export interface Product {
  id: number
  name: string
  sku: string
  description?: string
  category_id: number
  price: number
  cost: number
  stock: number
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  tax_id?: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: number
  customer_id?: number
  total: number
  tax: number
  status: "pending" | "completed" | "cancelled"
  payment_method: "cash" | "card" | "transfer"
  created_at: string
  updated_at: string
}

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  quantity: number
  price: number
  total: number
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  email: string
  name: string
  role: "admin" | "cashier" | "manager"
  created_at: string
  updated_at: string
}
