import { describe, expect, it } from 'vitest'
import type { CartItem, Product } from '../../types'
import {
  addToCart,
  canAddToCart,
  decreaseQuantity,
  getCartLines,
  getCartTotals,
  increaseQuantity,
  removeFromCart,
} from '../cart'

const product: Product = {
  id: 'p1',
  name: 'Producto de prueba',
  description: 'Descripción',
  category: 'munecas',
  price: 10,
  stock: 5,
  minStock: 2,
  image: '',
  emoji: '🎲',
}

describe('canAddToCart', () => {
  it('permite agregar cuando hay stock suficiente', () => {
    expect(canAddToCart(product, 0, 1)).toBe(true)
    expect(canAddToCart(product, 3, 2)).toBe(true)
  })

  it('impide superar el stock disponible', () => {
    expect(canAddToCart(product, 4, 2)).toBe(false)
    expect(canAddToCart(product, 5, 1)).toBe(false)
  })

  it('impide agregar cuando el producto está agotado', () => {
    expect(canAddToCart({ ...product, stock: 0 }, 0, 1)).toBe(false)
  })
})

describe('addToCart', () => {
  it('agrega un producto nuevo', () => {
    expect(addToCart([], 'p1', 1, product)).toEqual([{ productId: 'p1', quantity: 1 }])
  })

  it('acumula la cantidad de un producto existente', () => {
    const once = addToCart([], 'p1', 2, product)
    expect(addToCart(once, 'p1', 1, product)).toEqual([{ productId: 'p1', quantity: 3 }])
  })

  it('no agrega más unidades de las que hay en stock', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 4 }]
    expect(addToCart(items, 'p1', 2, product)).toEqual(items)
  })
})

describe('increaseQuantity y decreaseQuantity', () => {
  it('aumenta la cantidad sin superar el stock', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 4 }]
    expect(increaseQuantity(items, 'p1', product)).toEqual([{ productId: 'p1', quantity: 5 }])
    const atLimit = increaseQuantity(items, 'p1', product)
    expect(increaseQuantity(atLimit, 'p1', product)).toEqual(atLimit)
  })

  it('reduce la cantidad y elimina la línea al llegar a cero', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 2 }]
    expect(decreaseQuantity(items, 'p1')).toEqual([{ productId: 'p1', quantity: 1 }])
    expect(decreaseQuantity([{ productId: 'p1', quantity: 1 }], 'p1')).toEqual([])
  })
})

describe('removeFromCart', () => {
  it('elimina el producto del carrito', () => {
    const items: CartItem[] = [
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 1 },
    ]
    expect(removeFromCart(items, 'p1')).toEqual([{ productId: 'p2', quantity: 1 }])
  })
})

describe('getCartLines y getCartTotals', () => {
  it('construye las líneas del carrito con sus totales', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 2 }]
    const lines = getCartLines(items, [product])
    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatchObject({ productId: 'p1', quantity: 2, lineTotal: 20 })
  })

  it('ignora productos que ya no existen', () => {
    const items: CartItem[] = [
      { productId: 'p1', quantity: 2 },
      { productId: 'desconocido', quantity: 3 },
    ]
    expect(getCartLines(items, [product])).toHaveLength(1)
  })

  it('calcula subtotal y cantidad total de artículos', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 2 }]
    expect(getCartTotals(items, [product])).toEqual({ itemCount: 2, subtotal: 20 })
  })

  it('devuelve ceros con el carrito vacío', () => {
    expect(getCartTotals([], [product])).toEqual({ itemCount: 0, subtotal: 0 })
  })
})