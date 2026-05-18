import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const COLORS: Record<ToastType, string> = {
  success: '#1C938C',
  error: '#DC2626',
  info: '#2563EB',
}

const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '375px',
          padding: '16px',
          paddingTop: 'env(safe-area-inset-top, 16px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

interface ToastProps {
  id: string
  message: string
  type: ToastType
  onDismiss: (id: string) => void
}

function Toast({ id, message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  const color = COLORS[type]

  return (
    <div
      className="toast-slide-in"
      style={{
        background: '#FFFFFF',
        color: '#2A2A2A',
        padding: '14px 20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
        borderLeft: `4px solid ${color}`,
        fontFamily: 'Roboto, sans-serif',
        fontSize: '15px',
        fontWeight: 500,
        pointerEvents: 'auto',
      }}
      role="alert"
    >
      {message}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
