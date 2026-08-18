import { describe, expect, it } from 'vitest'
import type { CartLine, Customer, Product } from '../../types'
import { applySaleToStock, buildOrderNumber, createSale, getSaleTotals } from '../sale'

const customer: Customer = {
  name: 'Ana Pérez',
  phone: '999888777',
  email: 'ana@test.com',
  address: 'Av. Principal 123',
}

const lines: CartLine[] = [
  {
    productId: 'p1',
    name: 'Muñeca Bella',
    emoji: '👧',
    image: '',
    category: 'munecas',
    price: 45,
    stock: 10,
    quantity: 2,
    lineTotal: 90,
  },
  {
    productId: 'p2',
    name: 'Auto de Carreras',
    emoji: '🏎️',
    image: '',
    category: 'vehiculos',
    price: 40,
    stock: 10,
    quantity: 1,
    lineTotal: 40,
  },
]

describe('getSaleTotals', () => {
  it('calcula el subtotal y el total de una venta', () => {
    expect(getSaleTotals(lines)).toEqual({ subtotal: 130, total: 130 })
  })

  it('devuelve ceros sin líneas', () => {
    expect(getSaleTotals([])).toEqual({ subtotal: 0, total: 0 })
  })
})

describe('createSale', () => {
  it('crea una venta con datos, ítems y totales correctos', () => {
    const date = new Date(2026, 5, 15, 10, 30, 0)
    const sale = createSale(customer, lines, 'tarjeta', date)

    expect(sale.customer).toEqual(customer)
    expect(sale.paymentMethod).toBe('tarjeta')
    expect(sale.subtotal).toBe(130)
    expect(sale.total).toBe(130)
    expect(sale.createdAt).toBe(date.toISOString())
    expect(sale.items).toHaveLength(2)
    expect(sale.items[0]).toMatchObject({
      productId: 'p1',
      productName: 'Muñeca Bella',
      unitPrice: 45,
      quantity: 2,
    })
  })
})

describe('buildOrderNumber', () => {
  it('genera un número de pedido con el formato esperado', () => {
    const date = new Date(2026, 0, 5)
    const orderNumber = buildOrderNumber(date)
    expect(orderNumber).toMatch(/^V-\d{8}-\d{4}$/)
    expect(orderNumber.startsWith('V-20260105-')).toBe(true)
  })
})

describe('applySaleToStock', () => {
  const products: Product[] = [
    {
      id: 'p1',
      name: 'Muñeca Bella',
      description: '',
      category: 'munecas',
      price: 45,
      stock: 12,
      minStock: 6,
      image: '',
      emoji: '👧',
    },
    {
      id: 'p3',
      name: 'Oso Peluche',
      description: '',
      category: 'peluches',
      price: 21,
      stock: 10,
      minStock: 6,
      image: '',
      emoji: '🧸',
    },
  ]

  it('reduce el stock de los productos vendidos', () => {
    const sale = createSale(customer, lines, 'efectivo')
    const updated = applySaleToStock(products, sale)
    expect(updated.find((p) => p.id === 'p1')?.stock).toBe(10)
    expect(updated.find((p) => p.id === 'p3')?.stock).toBe(10)
  })

  it('no deja stock negativo', () => {
    const lowStockProducts = [
      { ...products[0], stock: 1 },
      products[1],
    ]
    const sale = createSale(customer, lines, 'efectivo')
    expect(applySaleToStock(lowStockProducts, sale)[0].stock).toBe(0)
  })
})