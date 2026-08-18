import { useState, type FormEvent } from 'react'
import { Banknote, CreditCard, ShoppingBag, Smartphone } from 'lucide-react'
import { PAYMENT_METHODS } from '../../data/paymentMethods'
import type { Customer, PaymentMethod } from '../../types'
import Button from '../ui/Button'
import { Field, Input } from '../ui/Field'

interface CheckoutFormProps {
  onSubmit: (customer: Customer, paymentMethod: PaymentMethod) => void
}

interface FormState {
  name: string
  phone: string
  email: string
  address: string
  paymentMethod: PaymentMethod | null
}

const initial: FormState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  paymentMethod: null,
}

const EMAIL_REGEX = /^\S+@\S+\.\S+$/
const PHONE_REGEX = /^[0-9+\-\s]{6,}$/

const paymentIcons = {
  efectivo: Banknote,
  tarjeta: CreditCard,
  'yape-plin': Smartphone,
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [values, setValues] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!values.name.trim()) next.name = 'El nombre es obligatorio'
    if (!PHONE_REGEX.test(values.phone.trim())) next.phone = 'Ingresa un teléfono válido'
    if (!EMAIL_REGEX.test(values.email.trim())) next.email = 'Ingresa un email válido'
    if (!values.address.trim()) next.address = 'La dirección es obligatoria'
    if (!values.paymentMethod) next.paymentMethod = 'Selecciona un método de pago'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate() || !values.paymentMethod) return
    onSubmit(
      {
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
      },
      values.paymentMethod,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Nombre del cliente" htmlFor="customer-name" error={errors.name}>
        <Input
          id="customer-name"
          value={values.name}
          hasError={Boolean(errors.name)}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Ej: Ana Pérez"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono" htmlFor="customer-phone" error={errors.phone}>
          <Input
            id="customer-phone"
            value={values.phone}
            hasError={Boolean(errors.phone)}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="999 888 777"
          />
        </Field>
        <Field label="Email" htmlFor="customer-email" error={errors.email}>
          <Input
            id="customer-email"
            type="email"
            value={values.email}
            hasError={Boolean(errors.email)}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </Field>
      </div>

      <Field label="Dirección de entrega" htmlFor="customer-address" error={errors.address}>
        <Input
          id="customer-address"
          value={values.address}
          hasError={Boolean(errors.address)}
          onChange={(e) => setField('address', e.target.value)}
          placeholder="Av. Principal 123, Lima"
        />
      </Field>

      <div>
        <span className="label">Método de pago</span>
        <div className="grid gap-2 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const active = values.paymentMethod === method.id
            const Icon = paymentIcons[method.id]
            return (
              <label
                key={method.id}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="sr-only"
                  checked={active}
                  onChange={() => setField('paymentMethod', method.id)}
                />
                <Icon className="h-5 w-5" />
                <span>{method.label}</span>
                <span className="text-[11px] font-normal text-gray-400">
                  {method.description}
                </span>
              </label>
            )
          })}
        </div>
        {errors.paymentMethod && (
          <p className="mt-1 text-xs font-medium text-rose-600">{errors.paymentMethod}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        <ShoppingBag className="h-4 w-4" /> Confirmar venta
      </Button>
    </form>
  )
}