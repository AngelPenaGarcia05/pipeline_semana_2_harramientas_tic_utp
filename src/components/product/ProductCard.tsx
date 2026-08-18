import { PackageX, ShoppingCart } from 'lucide-react'
import { getCategory } from '../../data/categories'
import { useStore } from '../../context/StoreContext'
import { getProductStatus } from '../../utils/products'
import { formatMoney } from '../../utils/money'
import type { Product } from '../../types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ProductImage from './ProductImage'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useStore()
  const status = getProductStatus(product)
  const inCart = cartItems.find((item) => item.productId === product.id)?.quantity ?? 0
  const canAdd = status !== 'agotado' && inCart < product.stock
  const category = getCategory(product.category)

  const handleAdd = () => {
    addToCart(product)
  }

  return (
    <div className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage
          emoji={product.emoji}
          image={product.image}
          alt={product.name}
          category={product.category}
        />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            {category?.emoji} {category?.name}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          {status === 'agotado' && (
            <Badge tone="red">
              <PackageX className="h-3.5 w-3.5" /> Agotado
            </Badge>
          )}
          {status === 'stock-bajo' && <Badge tone="amber">Quedan {product.stock}</Badge>}
          {status === 'disponible' && <Badge tone="green">Disponible</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold text-gray-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-gray-500">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-lg font-extrabold text-gray-900">
              {formatMoney(product.price)}
            </p>
            <p className="text-xs text-gray-400">Stock: {product.stock}</p>
          </div>
          <Button onClick={handleAdd} disabled={!canAdd} size="sm">
            <ShoppingCart className="h-4 w-4" />
            {status === 'agotado' ? 'Agotado' : inCart > 0 ? `Agregar (${inCart})` : 'Agregar'}
          </Button>
        </div>
      </div>
    </div>
  )
}