import { Boxes, Package, Pencil, Plus, Trash2 } from 'lucide-react'
import { getCategory } from '../../data/categories'
import { getProductStatus } from '../../utils/products'
import { formatMoney } from '../../utils/money'
import type { Product, ProductStatus } from '../../types'
import Badge from '../ui/Badge'
import ProductImage from '../product/ProductImage'

interface InventoryTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onAdjustStock: (product: Product) => void
  onDelete: (product: Product) => void
}

const STATUS_CONFIG: Record<
  ProductStatus,
  { tone: 'green' | 'amber' | 'red'; label: string }
> = {
  disponible: { tone: 'green', label: 'Disponible' },
  'stock-bajo': { tone: 'amber', label: 'Stock bajo' },
  agotado: { tone: 'red', label: 'Agotado' },
}

export default function InventoryTable({
  products,
  onEdit,
  onAdjustStock,
  onDelete,
}: InventoryTableProps) {
  if (products.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <Boxes className="h-7 w-7" />
        </div>
        <p className="font-semibold text-gray-700">No hay productos en el inventario</p>
        <p className="text-sm text-gray-500">Crea tu primer producto para empezar.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getProductStatus(product)
              const config = STATUS_CONFIG[status]
              const category = getCategory(product.category)
              return (
                <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                        <ProductImage
                          emoji={product.emoji}
                          image={product.image}
                          alt={product.name}
                          category={product.category}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[220px] truncate font-semibold text-gray-900">
                          {product.name}
                        </p>
                        <p className="max-w-[220px] truncate text-xs text-gray-400">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">
                      {category?.emoji} {category?.name ?? product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {formatMoney(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        status === 'agotado'
                          ? 'text-rose-600'
                          : status === 'stock-bajo'
                            ? 'text-amber-600'
                            : 'text-gray-900'
                      }`}
                    >
                      <Package className="h-3.5 w-3.5" />
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={config.tone}>{config.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onAdjustStock(product)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                        aria-label={`Ajustar stock de ${product.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Eliminar ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}