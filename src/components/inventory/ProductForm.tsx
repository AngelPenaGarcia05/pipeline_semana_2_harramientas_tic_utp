import { useEffect, useState, type FormEvent } from 'react'
import { CATEGORIES } from '../../data/categories'
import { useStore } from '../../context/StoreContext'
import type { Product } from '../../types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Field'

interface ProductFormProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

interface FormState {
  name: string
  description: string
  category: string
  price: string
  stock: string
  minStock: string
  emoji: string
  image: string
}

const emptyState: FormState = {
  name: '',
  description: '',
  category: CATEGORIES[0].id,
  price: '',
  stock: '0',
  minStock: '6',
  emoji: '🧸',
  image: '',
}

export default function ProductForm({ open, onClose, product }: ProductFormProps) {
  const { addProduct, updateProduct } = useStore()
  const [values, setValues] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    if (!open) return
    if (product) {
      setValues({
        name: product.name,
        description: product.description,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        minStock: String(product.minStock),
        emoji: product.emoji,
        image: product.image,
      })
    } else {
      setValues(emptyState)
    }
    setErrors({})
  }, [open, product])

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!values.name.trim()) next.name = 'El nombre es obligatorio'
    if (!values.category) next.category = 'Selecciona una categoría'
    const price = Number(values.price)
    if (values.price === '' || Number.isNaN(price) || price <= 0) {
      next.price = 'Ingresa un precio mayor a 0'
    }
    const stock = Number(values.stock)
    if (values.stock === '' || Number.isNaN(stock) || stock < 0) {
      next.stock = 'El stock no puede ser negativo'
    }
    const minStock = Number(values.minStock)
    if (values.minStock === '' || Number.isNaN(minStock) || minStock < 0) {
      next.minStock = 'Ingresa un valor válido'
    }
    if (!values.emoji.trim()) next.emoji = 'Usa un emoji como imagen temporal'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    const data = {
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      price: Number(values.price),
      stock: Math.round(Number(values.stock)),
      minStock: Math.round(Number(values.minStock)),
      emoji: values.emoji.trim(),
      image: values.image.trim(),
    }
    if (product) {
      updateProduct(product.id, data)
    } else {
      addProduct(data)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? 'Editar producto' : 'Nuevo producto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Nombre" htmlFor="product-name" error={errors.name}>
          <Input
            id="product-name"
            value={values.name}
            hasError={Boolean(errors.name)}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Ej: Muñeca Bella"
          />
        </Field>

        <Field label="Descripción corta" htmlFor="product-description">
          <Textarea
            id="product-description"
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Describe brevemente el producto..."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoría" htmlFor="product-category" error={errors.category}>
            <Select
              id="product-category"
              value={values.category}
              hasError={Boolean(errors.category)}
              onChange={(e) => setField('category', e.target.value)}
            >
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Precio (S/)" htmlFor="product-price" error={errors.price}>
            <Input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              hasError={Boolean(errors.price)}
              onChange={(e) => setField('price', e.target.value)}
              placeholder="0.00"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stock" htmlFor="product-stock" error={errors.stock}>
            <Input
              id="product-stock"
              type="number"
              min="0"
              value={values.stock}
              hasError={Boolean(errors.stock)}
              onChange={(e) => setField('stock', e.target.value)}
            />
          </Field>
          <Field
            label="Stock mínimo"
            htmlFor="product-minstock"
            error={errors.minStock}
            hint="Por debajo de este valor se marca como stock bajo"
          >
            <Input
              id="product-minstock"
              type="number"
              min="0"
              value={values.minStock}
              hasError={Boolean(errors.minStock)}
              onChange={(e) => setField('minStock', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Emoji" htmlFor="product-emoji" error={errors.emoji}>
            <Input
              id="product-emoji"
              value={values.emoji}
              hasError={Boolean(errors.emoji)}
              onChange={(e) => setField('emoji', e.target.value)}
              placeholder="🧸"
            />
          </Field>
          <Field
            label="URL de imagen"
            htmlFor="product-image"
            hint="Opcional: deja vacío para usar el emoji"
          >
            <Input
              id="product-image"
              type="url"
              value={values.image}
              onChange={(e) => setField('image', e.target.value)}
              placeholder="https://..."
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{product ? 'Guardar cambios' : 'Crear producto'}</Button>
        </div>
      </form>
    </Modal>
  )
}