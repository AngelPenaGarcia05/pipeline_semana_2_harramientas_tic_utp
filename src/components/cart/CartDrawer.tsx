import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { getCartLines } from '../../utils/cart'
import { formatMoney } from '../../utils/money'
import Button from '../ui/Button'
import CartItemRow from './CartItemRow'

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    products,
    cartCount,
    cartSubtotal,
    clearCart,
  } = useStore()

  const lines = getCartLines(cartItems, products)

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-50" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={closeCart}
          />
        </div>
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col bg-white shadow-xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            Tu carrito
            {cartCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                {cartCount} {cartCount === 1 ? 'artículo' : 'artículos'}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <p className="font-semibold text-gray-700">Tu carrito está vacío</p>
            <p className="text-sm text-gray-500">
              Explora el catálogo y agrega juguetes para empezar.
            </p>
            <Link to="/" onClick={closeCart}>
              <Button>Ir a la tienda</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {lines.map((line) => (
                  <CartItemRow key={line.productId} line={line} />
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatMoney(cartSubtotal)}
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between text-lg font-extrabold text-gray-900">
                <span>Total</span>
                <span>{formatMoney(cartSubtotal)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/ventas" onClick={closeCart} className="w-full">
                  <Button className="w-full">
                    Finalizar compra <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={clearCart}>
                  <Trash2 className="h-4 w-4" /> Vaciar carrito
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}