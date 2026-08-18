import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import type { ToastMessage } from '../../types'

const styles: Record<ToastMessage['type'], { icon: typeof Info; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  error: { icon: XCircle, classes: 'border-rose-200 bg-rose-50 text-rose-800' },
  info: { icon: Info, classes: 'border-blue-200 bg-blue-50 text-blue-800' },
}

export default function ToastViewport() {
  const { toasts, dismissToast } = useStore()

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2"
      role="region"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const { icon: Icon, classes } = styles[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${classes}`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="rounded p-0.5 hover:opacity-70"
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}