interface LoadingSpinnerProps {
  text?: string
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #E6E6E6',
          borderTop: '4px solid #1C938C',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && (
        <p
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '16px',
            color: '#4F4F4F',
            margin: 0,
          }}
        >
          {text}
        </p>
      )}
    </div>
  )
}

export function FullScreenLoader({ text = 'Laddar...' }: { text?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
      }}
    >
      <LoadingSpinner text={text} />
    </div>
  )
}
