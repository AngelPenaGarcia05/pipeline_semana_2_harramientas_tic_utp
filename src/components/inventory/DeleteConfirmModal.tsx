import { AlertTriangle } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import type { Product } from '../../types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

export default function DeleteConfirmModal({
  open,
  onClose,
  product,
}: DeleteConfirmModalProps) {
  const { deleteProduct } = useStore()

  const handleConfirm = () => {
    if (!product) return
    deleteProduct(product.id)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Eliminar producto" maxWidth="max-w-md">
      {product && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-4 text-rose-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">
              ¿Seguro que deseas eliminar <span className="font-bold">{product.name}</span>?
              Esta acción no se puede deshacer. El historial de ventas anteriores se conserva.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}