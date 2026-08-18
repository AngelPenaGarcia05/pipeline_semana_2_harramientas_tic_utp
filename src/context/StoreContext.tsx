/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  CartItem,
  Customer,
  PaymentMethod,
  Product,
  Sale,
  ToastMessage,
} from '../types'
import { INITIAL_PRODUCTS } from '../data/products'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  addToCart as addToCartUtil,
  canAddToCart,
  decreaseQuantity as decreaseQuantityUtil,
  getCartLines,
  getCartTotals,
  increaseQuantity as increaseQuantityUtil,
  removeFromCart as removeFromCartUtil,
} from '../utils/cart'
import { applySaleToStock, createSale } from '../utils/sale'

interface StoreContextValue {
  products: Product[]
  cartItems: CartItem[]
  cartCount: number
  cartSubtotal: number
  sales: Sale[]
  toasts: ToastMessage[]
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addProduct: (data: Omit<Product, 'id'>) => void
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => void
  deleteProduct: (id: string) => void
  adjustStock: (id: string, delta: number) => void
  addToCart: (product: Product, quantity?: number) => boolean
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  completeSale: (customer: Customer, paymentMethod: PaymentMethod) => Sale | null
  pushToast: (type: ToastMessage['type'], message: string) => void
  dismissToast: (id: number) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS)
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', [])
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', [])
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (!product) return []
        const quantity = Math.min(item.quantity, product.stock)
        return quantity > 0 ? [{ productId: item.productId, quantity }] : []
      }),
    )
  }, [products, setCartItems])

  const pushToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((prev) => [...prev, { id, type, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const addProduct = useCallback(
    (data: Omit<Product, 'id'>) => {
      setProducts((prev) => [...prev, { ...data, id: createId() }])
      pushToast('success', 'Producto creado correctamente')
    },
    [pushToast, setProducts],
  )

  const updateProduct = useCallback(
    (id: string, data: Partial<Omit<Product, 'id'>>) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
      pushToast('success', 'Producto actualizado')
    },
    [pushToast, setProducts],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      pushToast('info', 'Producto eliminado del catálogo')
    },
    [pushToast, setProducts],
  )

  const adjustStock = useCallback(
    (id: string, delta: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
        ),
      )
      pushToast('success', 'Stock actualizado')
    },
    [pushToast, setProducts],
  )

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      const currentQuantity =
        cartItems.find((item) => item.productId === product.id)?.quantity ?? 0
      if (!canAddToCart(product, currentQuantity, quantity)) {
        pushToast('error', `No hay suficiente stock de "${product.name}"`)
        return false
      }
      setCartItems(addToCartUtil(cartItems, product.id, quantity, product))
      pushToast('success', `"${product.name}" agregado al carrito`)
      return true
    },
    [cartItems, pushToast, setCartItems],
  )

  const increaseQuantity = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId)
      if (!product) return
      setCartItems(increaseQuantityUtil(cartItems, productId, product))
    },
    [cartItems, products, setCartItems],
  )

  const decreaseQuantity = useCallback(
    (productId: string) => {
      setCartItems(decreaseQuantityUtil(cartItems, productId))
    },
    [cartItems, setCartItems],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      setCartItems(removeFromCartUtil(cartItems, productId))
    },
    [cartItems, setCartItems],
  )

  const clearCart = useCallback(() => {
    setCartItems([])
    pushToast('info', 'Carrito vaciado')
  }, [pushToast, setCartItems])

  const completeSale = useCallback(
    (customer: Customer, paymentMethod: PaymentMethod) => {
      if (cartItems.length === 0) return null
      const lines = getCartLines(cartItems, products)
      const sale = createSale(customer, lines, paymentMethod)
      setProducts(applySaleToStock(products, sale))
      setSales((prev) => [sale, ...prev])
      setCartItems([])
      pushToast('success', 'Venta registrada correctamente')
      return sale
    },
    [cartItems, products, pushToast, setCartItems, setProducts, setSales],
  )

  const { itemCount: cartCount, subtotal: cartSubtotal } = useMemo(
    () => getCartTotals(cartItems, products),
    [cartItems, products],
  )

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      cartItems,
      cartCount,
      cartSubtotal,
      sales,
      toasts,
      isCartOpen,
      openCart,
      closeCart,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      completeSale,
      pushToast,
      dismissToast,
    }),
    [
      products,
      cartItems,
      cartCount,
      cartSubtotal,
      sales,
      toasts,
      isCartOpen,
      openCart,
      closeCart,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      completeSale,
      pushToast,
      dismissToast,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore debe usarse dentro de StoreProvider')
  }
  return context
}