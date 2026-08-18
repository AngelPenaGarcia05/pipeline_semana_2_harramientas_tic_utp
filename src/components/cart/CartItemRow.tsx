import { Minus, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { formatMoney } from '../../utils/money'
import type { CartLine } from '../../types'
import ProductImage from '../product/ProductImage'

interface CartItemRowProps {
  line: CartLine
}

export default function CartItemRow({ line }: CartItemRowProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useStore()
  const atStockLimit = line.quantity >= line.stock

  return (
    <li className="flex gap-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100">
        <ProductImage
          emoji={line.emoji}
          image={line.image}
          alt={line.name}
          category={line.category}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">{line.name}</p>
          <button
            onClick={() => removeFromCart(line.productId)}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Eliminar ${line.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400">{formatMoney(line.price)} c/u</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => decreaseQuantity(line.productId)}
              disabled={line.quantity <= 1}
              className="rounded-lg border border-gray-200 p-1 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
            <button
              onClick={() => increaseQuantity(line.productId)}
              disabled={atStockLimit}
              className="rounded-lg border border-gray-200 p-1 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-bold text-gray-900">{formatMoney(line.lineTotal)}</p>
        </div>
      </div>
    </li>
  )
}