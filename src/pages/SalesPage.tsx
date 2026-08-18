import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Receipt, ShoppingBag } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { PAYMENT_METHODS } from '../data/paymentMethods'
import { formatMoney } from '../utils/money'
import type { Customer, PaymentMethod, Sale } from '../types'
import CheckoutForm from '../components/checkout/CheckoutForm'
import OrderSummary from '../components/checkout/OrderSummary'
import SalesList from '../components/sales/SalesList'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function SalesPage() {
  const { cartItems, completeSale } = useStore()
  const [lastSale, setLastSale] = useState<Sale | null>(null)

  const handleCheckout = (customer: Customer, paymentMethod: PaymentMethod) => {
    const sale = completeSale(customer, paymentMethod)
    if (sale) setLastSale(sale)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Ventas</h1>
        <p className="text-sm text-gray-500">
          Completa el checkout para registrar una venta y actualizar el inventario.
        </p>
      </div>

      {lastSale ? (
        <SuccessSale sale={lastSale} />
      ) : cartItems.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Tu carrito está vacío"
          description="Agrega productos desde la tienda para poder generar una venta."
          action={
            <Link to="/">
              <Button>Ir a la tienda</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="card p-5 lg:col-span-3">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Datos del cliente</h2>
            <CheckoutForm onSubmit={handleCheckout} />
          </div>
          <div className="lg:col-span-2">
            <OrderSummary />
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Historial de ventas</h2>
        <SalesList />
      </div>
    </div>
  )
}

function SuccessSale({ sale }: { sale: Sale }) {
  const paymentLabel =
    PAYMENT_METHODS.find((method) => method.id === sale.paymentMethod)?.label ??
    sale.paymentMethod

  return (
    <div className="card p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">
          ¡Venta realizada correctamente!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          El stock del inventario se actualizó automáticamente y la venta quedó guardada.
        </p>
        <div className="mt-4 rounded-xl bg-blue-50 px-5 py-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Número de pedido
          </p>
          <p className="text-lg font-extrabold text-blue-700">{sale.id}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
            <Receipt className="h-4 w-4 text-blue-600" /> Resumen de la compra
          </h3>
          <ul className="space-y-1 text-sm">
            {sale.items.map((item, index) => (
              <li
                key={`${sale.id}-${item.productId}-${index}`}
                className="flex justify-between gap-2 text-gray-600"
              >
                <span>
                  {item.emoji} {item.productName}{' '}
                  <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span>{formatMoney(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-sm font-bold text-gray-900">
            <span>Total</span>
            <span>{formatMoney(sale.total)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 p-4">
          <h3 className="mb-2 text-sm font-bold text-gray-700">Datos del cliente</h3>
          <dl className="space-y-1.5 text-sm text-gray-600">
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Nombre</dt>
              <dd className="text-right font-medium">{sale.customer.name}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Teléfono</dt>
              <dd className="font-medium">{sale.customer.phone}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Email</dt>
              <dd className="text-right font-medium">{sale.customer.email}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Pago</dt>
              <dd className="font-medium">{paymentLabel}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link to="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" /> Volver a la tienda
          </Button>
        </Link>
        <Link to="/inventario" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Ver inventario
          </Button>
        </Link>
      </div>
    </div>
  )
}