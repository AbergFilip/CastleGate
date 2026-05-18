import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled')
  )
}

/** Första fält att fokusera: input/textarea, inte stäng-knappen (första i DOM). */
function getInitialFocusElement(container: HTMLElement): HTMLElement | null {
  const closeBtn = container.querySelector<HTMLElement>('[aria-label="Stäng"]')
  const field = container.querySelector<HTMLElement>(
    'input:not([type="hidden"]), textarea, select'
  )
  if (field && !(field as HTMLInputElement).disabled) return field
  const focusable = getFocusableElements(container)
  const notClose = focusable.find((el) => el !== closeBtn)
  return notClose ?? focusable[0] ?? null
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  /** Inline onClose från föräldrar ändras varje render — får inte trigga om fokus/lyssnare. */
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      previousActiveElementRef.current = document.activeElement as HTMLElement | null
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const container = modalRef.current
    const initial = getInitialFocusElement(container)
    if (initial) {
      initial.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        previousActiveElementRef.current?.focus()
        return
      }

      if (e.key !== 'Tab') return

      const focusableEls = getFocusableElements(container)
      if (focusableEls.length === 0) return

      const first = focusableEls[0]
      const last = focusableEls[focusableEls.length - 1]
      const current = document.activeElement as HTMLElement

      if (e.shiftKey) {
        if (current === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (current === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 24px 16px',
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#2A2A2A',
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Stäng"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#2A2A2A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  ariaLabel?: string
  maxLength?: number
  step?: string | number
  min?: string | number
  max?: string | number
  inputMode?: 'text' | 'decimal' | 'numeric' | 'email' | 'tel' | 'url' | 'search' | 'none'
  autoComplete?: string
}

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  ariaLabel,
  maxLength,
  step,
  min,
  max,
  inputMode,
  autoComplete,
}: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
      <label
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          color: '#2A2A2A',
        }}
      >
        {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-label={ariaLabel || label}
        maxLength={maxLength}
        step={step}
        min={min}
        max={max}
        inputMode={inputMode}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #E5E5E5',
          borderRadius: '12px',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '16px',
          color: '#2A2A2A',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#1C3C9B'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E5E5E5'
        }}
      />
    </div>
  )
}

interface FormTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
      <label
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          color: '#2A2A2A',
        }}
      >
        {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #E5E5E5',
          borderRadius: '12px',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '16px',
          color: '#2A2A2A',
          outline: 'none',
          boxSizing: 'border-box',
          resize: 'vertical',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#1C3C9B'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E5E5E5'
        }}
      />
    </div>
  )
}

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  fullWidth?: boolean
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '14px 24px',
        borderRadius: '12px',
        border: 'none',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 600,
        fontSize: '16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: variant === 'primary' ? '#1C3C9B' : '#F4F6FF',
        color: variant === 'primary' ? '#FFFFFF' : '#1C3C9B',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.9'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1'
        }
      }}
    >
      {children}
    </button>
  )
}

