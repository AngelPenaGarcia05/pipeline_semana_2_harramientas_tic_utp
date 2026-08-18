export type PaymentMethod = 'efectivo' | 'tarjeta' | 'yape-plin'

export type CategoryColor = 'blue' | 'yellow' | 'pink' | 'green' | 'violet'

export interface Category {
  id: string
  name: string
  emoji: string
  color: CategoryColor
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  minStock: number
  image: string
  emoji: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartLine {
  productId: string
  name: string
  emoji: string
  image: string
  category: string
  price: number
  stock: number
  quantity: number
  lineTotal: number
}

export interface Customer {
  name: string
  phone: string
  email: string
  address: string
}

export interface SaleItem {
  productId: string
  productName: string
  emoji: string
  unitPrice: number
  quantity: number
}

export interface Sale {
  id: string
  customer: Customer
  items: SaleItem[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  createdAt: string
}

export interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

export type ProductStatus = 'disponible' | 'stock-bajo' | 'agotado'

export type SortBy = 'featured' | 'name' | 'price'

export type SortOrder = 'asc' | 'desc'

export interface ProductFilters {
  search: string
  category: string
  minPrice: number | null
  maxPrice: number | null
  sortBy: SortBy
  sortOrder: SortOrder
}

export interface InventoryStats {
  totalProducts: number
  totalUnits: number
  lowStockCount: number
  outOfStockCount: number
  estimatedValue: number
}