import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

interface FieldProps {
  label: string
  error?: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}

export function Field({ label, error, hint, htmlFor, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }

export function Input({ className = '', hasError, ...props }: InputProps) {
  return <input className={`input ${hasError ? 'input-error' : ''} ${className}`} {...props} />
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }

export function Select({ className = '', hasError, children, ...props }: SelectProps) {
  return (
    <select className={`input ${hasError ? 'input-error' : ''} ${className}`} {...props}>
      {children}
    </select>
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }

export function Textarea({ className = '', hasError, ...props }: TextareaProps) {
  return (
    <textarea
      className={`input min-h-24 ${hasError ? 'input-error' : ''} ${className}`}
      {...props}
    />
  )
}