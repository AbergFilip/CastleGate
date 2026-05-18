import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="empty-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      {icon && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: '22px',
          color: '#2A2A2A',
          margin: 0,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '125%',
            color: '#2A2A2A',
            opacity: 0.7,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '14px 24px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
            color: '#FFFFFF',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
