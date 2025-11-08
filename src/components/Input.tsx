import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  large?: boolean
}

function Input({ label, error, large = false, className = '', ...props }: InputProps) {
  const inputClasses = large 
    ? 'input-field-large' 
    : 'input-field'

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <input
        className={`${inputClasses} ${className} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}

export default Input

