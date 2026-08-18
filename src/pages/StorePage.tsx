import { useMemo, useState } from 'react'
import { PackageSearch, RotateCcw, Search } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { useStore } from '../context/StoreContext'
import { filterProducts } from '../utils/products'
import type { SortBy, SortOrder } from '../types'
import ProductCard from '../components/product/ProductCard'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { Input, Select } from '../components/ui/Field'

interface StoreFilters {
  search: string
  category: string
  minPrice: number | null
  maxPrice: number | null
  sortBy: SortBy
  sortOrder: SortOrder
}

const DEFAULT_FILTERS: StoreFilters = {
  search: '',
  category: 'all',
  minPrice: null,
  maxPrice: null,
  sortBy: 'featured',
  sortOrder: 'asc',
}

export default function StorePage() {
  const { products } = useStore()
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_FILTERS)

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters])

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.sortBy !== 'featured'

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-white to-pink-50 px-6 py-10 sm:px-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
            🧸 Catálogo actualizado
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Juguetes para cada <span className="text-pink-600">sueño</span> y{' '}
            <span className="text-blue-600">aventura</span>
          </h1>
          <p className="mt-3 max-w-xl text-gray-600">
            Descubre muñecas, vehículos, peluches, juegos de mesa y mucho más. Compra fácil y
            rápido en Juguetería Arcoíris.
          </p>
        </div>
      </section>

      <div className="card mb-6 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
          <div className="relative xl:col-span-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar juguete por nombre..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="pl-10"
              aria-label="Buscar productos"
            />
          </div>
          <Select
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3 xl:col-span-2">
            <Input
              type="number"
              min={0}
              placeholder="Precio mín."
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  minPrice: e.target.value === '' ? null : Number(e.target.value),
                }))
              }
              aria-label="Precio mínimo"
            />
            <Input
              type="number"
              min={0}
              placeholder="Precio máx."
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  maxPrice: e.target.value === '' ? null : Number(e.target.value),
                }))
              }
              aria-label="Precio máximo"
            />
          </div>
          <Select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':') as [SortBy, SortOrder]
              setFilters((f) => ({ ...f, sortBy, sortOrder }))
            }}
            aria-label="Ordenar productos"
          >
            <option value="featured:asc">Destacados</option>
            <option value="price:asc">Precio: menor a mayor</option>
            <option value="price:desc">Precio: mayor a menor</option>
            <option value="name:asc">Nombre: A-Z</option>
            <option value="name:desc">Nombre: Z-A</option>
          </Select>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilters((f) => ({ ...f, category: 'all' }))}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            filters.category === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilters((f) => ({ ...f, category: category.id }))}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filters.category === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100'
            }`}
          >
            {category.emoji} {category.name}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <RotateCcw className="h-4 w-4" /> Limpiar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="h-8 w-8" />}
          title="No encontramos productos"
          description="Prueba con otros términos de búsqueda o limpia los filtros para ver todo el catálogo."
          action={
            <Button onClick={clearFilters} variant="outline">
              <RotateCcw className="h-4 w-4" /> Limpiar filtros
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}