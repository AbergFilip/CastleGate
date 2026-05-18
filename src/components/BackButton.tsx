import { Link } from 'react-router-dom'

interface BackButtonProps {
  to: string
  color?: string
  label?: string
}

/**
 * Tillbaka-knapp med tillräckligt stor touch-target (minst 44x44px).
 * Används i page headers.
 */
export function BackButton({ to, color = '#FFFFFF', label = 'Tillbaka' }: BackButtonProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      style={{
        position: 'absolute',
        left: '4px',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        minWidth: '44px',
        minHeight: '44px',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18L9 12L15 6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
