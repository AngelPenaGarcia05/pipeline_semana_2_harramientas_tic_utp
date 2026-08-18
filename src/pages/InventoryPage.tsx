import { useMemo, useState } from 'react'
import { PackagePlus } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { getInventoryStats } from '../utils/products'
import type { Product } from '../types'
import Button from '../components/ui/Button'
import InventoryStats from '../components/inventory/InventoryStats'
import InventoryTable from '../components/inventory/InventoryTable'
import ProductForm from '../components/inventory/ProductForm'
import StockAdjustModal from '../components/inventory/StockAdjustModal'
import DeleteConfirmModal from '../components/inventory/DeleteConfirmModal'
import SalesList from '../components/sales/SalesList'

export default function InventoryPage() {
  const { products } = useStore()
  const stats = useMemo(() => getInventoryStats(products), [products])
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [stockProduct, setStockProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const handleNew = () => {
    setEditingProduct(null)
    setProductFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setProductFormOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Inventario</h1>
          <p className="text-sm text-gray-500">
            Administra tus productos, stock y precios.
          </p>
        </div>
        <Button onClick={handleNew}>
          <PackagePlus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      <InventoryStats stats={stats} />
      <InventoryTable
        products={products}
        onEdit={handleEdit}
        onAdjustStock={setStockProduct}
        onDelete={setDeletingProduct}
      />

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Ventas recientes</h2>
        <SalesList limit={5} />
      </div>

      <ProductForm
        open={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        product={editingProduct}
      />
      <StockAdjustModal
        open={stockProduct !== null}
        onClose={() => setStockProduct(null)}
        product={stockProduct}
      />
      <DeleteConfirmModal
        open={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
      />
    </div>
  )
}