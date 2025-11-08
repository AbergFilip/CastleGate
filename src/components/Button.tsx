import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'small'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

function Button({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '',
  onClick,
  type = 'button'
}: ButtonProps) {
  const baseClasses = variant === 'primary' 
    ? 'btn-primary' 
    : 'btn-secondary'
  
  const sizeClasses = size === 'small' 
    ? 'text-sm py-2 px-4' 
    : ''

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button

