import { describe, expect, it } from 'vitest'
import type { Product, ProductFilters } from '../../types'
import { filterProducts, getInventoryStats, getProductStatus } from '../products'

const products: Product[] = [
  {
    id: 'a',
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
    id: 'b',
    name: 'Auto de Carreras',
    description: '',
    category: 'vehiculos',
    price: 40,
    stock: 0,
    minStock: 6,
    image: '',
    emoji: '🏎️',
  },
  {
    id: 'c',
    name: 'Bloques de Madera',
    description: '',
    category: 'construccion',
    price: 32,
    stock: 4,
    minStock: 6,
    image: '',
    emoji: '🧱',
  },
  {
    id: 'd',
    name: 'Tren de Madera',
    description: '',
    category: 'vehiculos',
    price: 49,
    stock: 7,
    minStock: 6,
    image: '',
    emoji: '🚂',
  },
]

const baseFilters: ProductFilters = {
  search: '',
  category: 'all',
  minPrice: null,
  maxPrice: null,
  sortBy: 'featured',
  sortOrder: 'asc',
}

function filterWith(overrides: Partial<ProductFilters>) {
  return filterProducts(products, { ...baseFilters, ...overrides })
}

describe('filterProducts', () => {
  it('busca por nombre ignorando mayúsculas', () => {
    expect(filterWith({ search: 'muñeca' }).map((p) => p.id)).toEqual(['a'])
    expect(filterWith({ search: 'AUTO' }).map((p) => p.id)).toEqual(['b'])
    expect(filterWith({ search: 'tren' }).map((p) => p.id)).toEqual(['d'])
  })

  it('filtra por categoría', () => {
    expect(filterWith({ category: 'vehiculos' }).map((p) => p.id)).toEqual(['b', 'd'])
  })

  it('filtra por rango de precio', () => {
    expect(filterWith({ minPrice: 35, maxPrice: 46 }).map((p) => p.id)).toEqual(['a', 'b'])
    expect(filterWith({ minPrice: 45 }).map((p) => p.id)).toEqual(['a', 'd'])
    expect(filterWith({ maxPrice: 33 }).map((p) => p.id)).toEqual(['c'])
  })

  it('combina búsqueda y categoría', () => {
    expect(filterWith({ search: 'madera', category: 'construccion' }).map((p) => p.id)).toEqual([
      'c',
    ])
  })

  it('ordena por precio ascendente y descendente', () => {
    expect(filterWith({ sortBy: 'price', sortOrder: 'asc' }).map((p) => p.id)).toEqual([
      'c',
      'b',
      'a',
      'd',
    ])
    expect(filterWith({ sortBy: 'price', sortOrder: 'desc' }).map((p) => p.id)).toEqual([
      'd',
      'a',
      'b',
      'c',
    ])
  })

  it('ordena por nombre en ambos sentidos', () => {
    expect(filterWith({ sortBy: 'name', sortOrder: 'asc' }).map((p) => p.id)).toEqual([
      'b',
      'c',
      'a',
      'd',
    ])
    expect(filterWith({ sortBy: 'name', sortOrder: 'desc' }).map((p) => p.id)).toEqual([
      'd',
      'a',
      'c',
      'b',
    ])
  })

  it('devuelve una lista vacía cuando no hay resultados', () => {
    expect(filterWith({ search: 'inexistente' })).toEqual([])
  })
})

describe('getProductStatus', () => {
  it('marca el producto como agotado sin stock', () => {
    expect(getProductStatus(products[1])).toBe('agotado')
  })

  it('marca stock bajo cuando el stock está por debajo del mínimo', () => {
    expect(getProductStatus(products[2])).toBe('stock-bajo')
  })

  it('marca disponible cuando hay stock suficiente', () => {
    expect(getProductStatus(products[0])).toBe('disponible')
  })
})

describe('getInventoryStats', () => {
  it('calcula los indicadores del inventario', () => {
    const stats = getInventoryStats(products)
    expect(stats.totalProducts).toBe(4)
    expect(stats.totalUnits).toBe(23)
    expect(stats.lowStockCount).toBe(1)
    expect(stats.outOfStockCount).toBe(1)
    expect(stats.estimatedValue).toBe(45 * 12 + 32 * 4 + 49 * 7)
  })

  it('devuelve ceros con un inventario vacío', () => {
    expect(getInventoryStats([])).toEqual({
      totalProducts: 0,
      totalUnits: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      estimatedValue: 0,
    })
  })
})