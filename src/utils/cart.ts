import type { CartItem, CartLine, Product } from '../types'

export function getCartLines(items: CartItem[], products: Product[]): CartLine[] {
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      return {
        productId: product.id,
        name: product.name,
        emoji: product.emoji,
        image: product.image,
        category: product.category,
        price: product.price,
        stock: product.stock,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      }
    })
    .filter((line): line is CartLine => line !== null)
}

export function getCartTotals(
  items: CartItem[],
  products: Product[],
): { itemCount: number; subtotal: number } {
  const lines = getCartLines(items, products)
  return {
    itemCount: lines.reduce((acc, line) => acc + line.quantity, 0),
    subtotal: lines.reduce((acc, line) => acc + line.lineTotal, 0),
  }
}

export function canAddToCart(
  product: Product,
  currentQuantity: number,
  requestedQuantity: number,
): boolean {
  return product.stock > 0 && currentQuantity + requestedQuantity <= product.stock
}

export function addToCart(
  items: CartItem[],
  productId: string,
  quantity: number,
  product: Product,
): CartItem[] {
  const currentQuantity = items.find((item) => item.productId === productId)?.quantity ?? 0
  if (!canAddToCart(product, currentQuantity, quantity)) return items
  return [
    ...items.filter((item) => item.productId !== productId),
    { productId, quantity: currentQuantity + quantity },
  ]
}

export function increaseQuantity(
  items: CartItem[],
  productId: string,
  product: Product,
): CartItem[] {
  const item = items.find((item) => item.productId === productId)
  if (!item) return items
  return addToCart(items, productId, 1, product)
}

export function decreaseQuantity(items: CartItem[], productId: string): CartItem[] {
  const item = items.find((item) => item.productId === productId)
  if (!item) return items
  if (item.quantity <= 1) return items.filter((other) => other.productId !== productId)
  return items.map((other) =>
    other.productId === productId ? { ...other, quantity: other.quantity - 1 } : other,
  )
}

export function removeFromCart(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.productId !== productId)
}