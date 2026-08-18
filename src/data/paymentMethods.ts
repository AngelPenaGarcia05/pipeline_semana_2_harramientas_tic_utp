import type { PaymentMethod } from '../types'

export interface PaymentMethodOption {
  id: PaymentMethod
  label: string
  description: string
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'efectivo', label: 'Efectivo', description: 'Pago en efectivo' },
  { id: 'tarjeta', label: 'Tarjeta', description: 'Visa, Mastercard y más' },
  { id: 'yape-plin', label: 'Yape / Plin', description: 'Billetera digital' },
]