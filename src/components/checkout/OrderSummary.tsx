import { useStore } from '../../context/StoreContext'
import { getCartLines } from '../../utils/cart'
import { formatMoney } from '../../utils/money'

export default function OrderSummary() {
  const { cartItems, products, cartCount } = useStore()
  const lines = getCartLines(cartItems, products)
  const subtotal = lines.reduce((acc, line) => acc + line.lineTotal, 0)

  return (
    <div className="card p-5">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Resumen del pedido</h2>
      {lines.length === 0 ? (
        <p className="text-sm text-gray-500">No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {lines.map((line) => (
              <li
                key={line.productId}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-gray-700">
                  <span aria-hidden="true">{line.emoji}</span>
                  <span className="line-clamp-1">{line.name}</span>
                  <span className="shrink-0 text-gray-400">× {line.quantity}</span>
                </span>
                <span className="shrink-0 font-semibold text-gray-900">
                  {formatMoney(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Artículos</span>
              <span>{cartCount}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between pt-1 text-lg font-extrabold text-gray-900">
              <span>Total</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}