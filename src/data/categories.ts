import type { Category } from '../types'

export const CATEGORIES: Category[] = [
  { id: 'munecas', name: 'Muñecas', emoji: '🪆', color: 'pink' },
  { id: 'vehiculos', name: 'Vehículos', emoji: '🚗', color: 'blue' },
  { id: 'juegos-mesa', name: 'Juegos de mesa', emoji: '🎲', color: 'violet' },
  { id: 'peluches', name: 'Peluches', emoji: '🧸', color: 'pink' },
  { id: 'construccion', name: 'Construcción', emoji: '🧱', color: 'yellow' },
  { id: 'educativos', name: 'Educativos', emoji: '📚', color: 'green' },
  { id: 'aire-libre', name: 'Aire libre', emoji: '⚽', color: 'green' },
]

export function getCategory(categoryId: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === categoryId)
}

export function getCategoryName(categoryId: string): string {
  return getCategory(categoryId)?.name ?? categoryId
}