import { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  size?: 'default' | 'small'
  onClick?: () => void
  active?: boolean
  className?: string
}

function Chip({ children, size = 'default', onClick, active = false, className = '' }: ChipProps) {
  const sizeClasses = size === 'small' 
    ? 'chip-small' 
    : 'chip'

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} ${active ? 'bg-primary text-white' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export default Chip

