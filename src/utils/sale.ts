import type { CartLine, Customer, PaymentMethod, Product, Sale, SaleItem } from '../types'

export function buildOrderNumber(date: Date = new Date()): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `V-${yyyy}${mm}${dd}-${random}`
}

export function getSaleTotals(lines: CartLine[]): { subtotal: number; total: number } {
  const subtotal = lines.reduce((acc, line) => acc + line.lineTotal, 0)
  return { subtotal, total: subtotal }
}

export function createSale(
  customer: Customer,
  lines: CartLine[],
  paymentMethod: PaymentMethod,
  date: Date = new Date(),
): Sale {
  const { subtotal, total } = getSaleTotals(lines)
  const items: SaleItem[] = lines.map((line) => ({
    productId: line.productId,
    productName: line.name,
    emoji: line.emoji,
    unitPrice: line.price,
    quantity: line.quantity,
  }))
  return {
    id: buildOrderNumber(date),
    customer,
    items,
    subtotal,
    total,
    paymentMethod,
    createdAt: date.toISOString(),
  }
}

export function applySaleToStock(products: Product[], sale: Sale): Product[] {
  return products.map((product) => {
    const sold = sale.items.find((item) => item.productId === product.id)
    if (!sold) return product
    return { ...product, stock: Math.max(0, product.stock - sold.quantity) }
  })
}