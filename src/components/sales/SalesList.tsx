import { useState } from 'react'
import { ChevronDown, Receipt } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { PAYMENT_METHODS } from '../../data/paymentMethods'
import { formatMoney } from '../../utils/money'
import type { Sale } from '../../types'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'

interface SalesListProps {
  limit?: number
}

export default function SalesList({ limit }: SalesListProps) {
  const { sales } = useStore()
  const visible = limit ? sales.slice(0, limit) : sales

  if (sales.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-8 w-8" />}
        title="Aún no hay ventas"
        description="Cuando confirmes una venta desde el checkout, aparecerá aquí con su número de pedido."
      />
    )
  }

  return (
    <ul className="space-y-3">
      {visible.map((sale) => (
        <SaleCard key={sale.id} sale={sale} />
      ))}
    </ul>
  )
}

function SaleCard({ sale }: { sale: Sale }) {
  const [expanded, setExpanded] = useState(false)
  const formattedDate = new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(sale.createdAt))
  const paymentLabel =
    PAYMENT_METHODS.find((method) => method.id === sale.paymentMethod)?.label ??
    sale.paymentMethod
  const itemCount = sale.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <li className="card overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-gray-900">{sale.id}</span>
            <Badge tone="blue">{paymentLabel}</Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {sale.customer.name} · {formattedDate} · {itemCount}{' '}
            {itemCount === 1 ? 'artículo' : 'artículos'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-bold text-gray-900">{formatMoney(sale.total)}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-400">Cliente</dt>
              <dd className="font-medium text-gray-800">{sale.customer.name}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Teléfono</dt>
              <dd className="font-medium text-gray-800">{sale.customer.phone}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Email</dt>
              <dd className="font-medium text-gray-800">{sale.customer.email}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Dirección</dt>
              <dd className="font-medium text-gray-800">{sale.customer.address}</dd>
            </div>
          </dl>
          <ul className="mt-3 space-y-1 border-t border-gray-100 pt-3 text-sm">
            {sale.items.map((item, index) => (
              <li
                key={`${sale.id}-${item.productId}-${index}`}
                className="flex items-center justify-between gap-2 text-gray-600"
              >
                <span>
                  {item.emoji} {item.productName}{' '}
                  <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">
                  {formatMoney(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}