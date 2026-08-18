import { useEffect, useState, type FormEvent } from 'react'
import { useStore } from '../../context/StoreContext'
import type { Product } from '../../types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, Input } from '../ui/Field'

interface StockAdjustModalProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

export default function StockAdjustModal({ open, onClose, product }: StockAdjustModalProps) {
  const { adjustStock } = useStore()
  const [amount, setAmount] = useState('1')
  const [mode, setMode] = useState<'add' | 'remove'>('add')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setAmount('1')
    setMode('add')
    setError('')
  }, [open, product])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!product) return
    const quantity = Number(amount)
    if (Number.isNaN(quantity) || quantity <= 0) {
      setError('Ingresa una cantidad mayor a 0')
      return
    }
    if (mode === 'remove' && quantity > product.stock) {
      setError(`Solo puedes quitar hasta ${product.stock} unidades`)
      return
    }
    adjustStock(product.id, mode === 'add' ? Math.round(quantity) : -Math.round(quantity))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Ajustar stock" maxWidth="max-w-md">
      {product && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{product.name}</span> · Stock
            actual: <span className="font-semibold text-gray-900">{product.stock}</span>
          </p>

          <div className="grid grid-cols-2 gap-2">
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition-colors ${
                mode === 'add'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="stock-mode"
                className="sr-only"
                checked={mode === 'add'}
                onChange={() => setMode('add')}
              />
              Sumar
            </label>
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition-colors ${
                mode === 'remove'
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="stock-mode"
                className="sr-only"
                checked={mode === 'remove'}
                onChange={() => setMode('remove')}
              />
              Quitar
            </label>
          </div>

          <Field label="Cantidad" htmlFor="stock-amount" error={error}>
            <Input
              id="stock-amount"
              type="number"
              min="1"
              value={amount}
              hasError={Boolean(error)}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Aplicar</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}