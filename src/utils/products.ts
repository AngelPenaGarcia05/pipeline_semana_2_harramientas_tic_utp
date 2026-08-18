import type { InventoryStats, Product, ProductFilters, ProductStatus } from '../types'

export function getProductStatus(product: Product): ProductStatus {
  if (product.stock === 0) return 'agotado'
  if (product.stock <= product.minStock) return 'stock-bajo'
  return 'disponible'
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const search = filters.search.trim().toLowerCase()

  const result = products.filter((product) => {
    const matchesSearch = search === '' || product.name.toLowerCase().includes(search)
    const matchesCategory =
      filters.category === 'all' || product.category === filters.category
    const matchesMin = filters.minPrice === null || product.price >= filters.minPrice
    const matchesMax = filters.maxPrice === null || product.price <= filters.maxPrice
    return matchesSearch && matchesCategory && matchesMin && matchesMax
  })

  const direction = filters.sortOrder === 'asc' ? 1 : -1
  return [...result].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price':
        return (a.price - b.price) * direction
      case 'name':
        return a.name.localeCompare(b.name, 'es') * direction
      default:
        return 0
    }
  })
}

export function getInventoryStats(products: Product[]): InventoryStats {
  const totalProducts = products.length
  const totalUnits = products.reduce((acc, product) => acc + product.stock, 0)
  const lowStockCount = products.filter(
    (product) => getProductStatus(product) === 'stock-bajo',
  ).length
  const outOfStockCount = products.filter(
    (product) => getProductStatus(product) === 'agotado',
  ).length
  const estimatedValue = products.reduce(
    (acc, product) => acc + product.price * product.stock,
    0,
  )
  return { totalProducts, totalUnits, lowStockCount, outOfStockCount, estimatedValue }
}