import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

const IS_DEV = import.meta.env.DEV

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F5F5',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FEE2E2',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V13" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 17H12.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#DC2626"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h1
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '29px',
                color: '#2A2A2A',
                margin: '0 0 8px 0',
              }}
            >
              Något gick fel
            </h1>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: 1.5,
                color: '#4F4F4F',
                margin: '0 0 24px 0',
              }}
            >
              Ett oväntat fel inträffade. Du kan försöka komma tillbaka eller ladda om sidan.
            </p>

            {IS_DEV && this.state.error && (
              <details
                style={{
                  marginBottom: '24px',
                  textAlign: 'left',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#7F1D1D',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                  Felmeddelande (dev)
                </summary>
                <pre
                  style={{
                    marginTop: '8px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                  }}
                >
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={this.handleReset}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                  boxShadow: '0px 4px 16px rgba(20, 109, 123, 0.24)',
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Försök igen
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#146D7B',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: '1px solid #146D7B',
                  cursor: 'pointer',
                }}
              >
                Ladda om sidan
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
