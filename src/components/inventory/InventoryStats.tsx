import { AlertTriangle, Boxes, Coins, PackageX } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { InventoryStats as InventoryStatsType } from '../../types'
import { formatMoney } from '../../utils/money'

interface StatCard {
  label: string
  value: string
  icon: LucideIcon
  className: string
}

export default function InventoryStats({ stats }: { stats: InventoryStatsType }) {
  const cards: StatCard[] = [
    {
      label: 'Total de productos',
      value: String(stats.totalProducts),
      icon: Boxes,
      className: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Stock bajo',
      value: String(stats.lowStockCount),
      icon: AlertTriangle,
      className: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Agotados',
      value: String(stats.outOfStockCount),
      icon: PackageX,
      className: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Valor del inventario',
      value: formatMoney(stats.estimatedValue),
      icon: Coins,
      className: 'bg-emerald-50 text-emerald-600',
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="card flex items-center gap-3 p-4">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.className}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-gray-500">{card.label}</p>
              <p className="truncate text-lg font-extrabold text-gray-900">{card.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}