import { useState } from 'react'
import { getCategory } from '../../data/categories'
import { getCategoryStyles } from '../ui/categoryStyles'

interface ProductImageProps {
  emoji: string
  image: string
  alt: string
  category: string
  className?: string
}

export default function ProductImage({
  emoji,
  image,
  alt,
  category,
  className = '',
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const categoryInfo = getCategory(category)
  const tile = categoryInfo ? getCategoryStyles(categoryInfo.color).tile : 'bg-gray-100'

  if (!image || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${tile} ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-5xl sm:text-6xl" aria-hidden="true">
          {emoji}
        </span>
      </div>
    )
  }

  return (
    <img
      src={image}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  )
}