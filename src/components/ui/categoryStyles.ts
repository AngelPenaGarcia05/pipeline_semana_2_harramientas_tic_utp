import type { CategoryColor } from '../../types'

interface CategoryStyles {
  badge: string
  tile: string
}

const styles: Record<CategoryColor, CategoryStyles> = {
  blue: { badge: 'bg-blue-100 text-blue-700', tile: 'bg-blue-100' },
  yellow: { badge: 'bg-yellow-100 text-yellow-700', tile: 'bg-yellow-100' },
  pink: { badge: 'bg-pink-100 text-pink-700', tile: 'bg-pink-100' },
  green: { badge: 'bg-emerald-100 text-emerald-700', tile: 'bg-emerald-100' },
  violet: { badge: 'bg-violet-100 text-violet-700', tile: 'bg-violet-100' },
}

export function getCategoryStyles(color: CategoryColor): CategoryStyles {
  return styles[color]
}