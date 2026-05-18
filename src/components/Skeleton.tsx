interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = '16px', borderRadius = '8px', style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '12px',
      padding: '14px 16px',
      boxShadow: '0px 4px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <Skeleton width="36px" height="36px" borderRadius="10px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton width="60%" height="14px" />
          <Skeleton width="40%" height="11px" />
        </div>
      </div>
      <Skeleton width="70px" height="14px" />
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3' }}>
      <div style={{
        height: '220px',
        background: 'linear-gradient(135deg, #1C938C 0%, #23A49C 100%)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '28px', left: '16px' }}>
          <Skeleton width="24px" height="24px" borderRadius="4px" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{ position: 'absolute', top: '26px', left: '0', right: '0', textAlign: 'center' }}>
          <Skeleton width="120px" height="24px" style={{ margin: '0 auto', background: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <Skeleton width="100px" height="12px" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <Skeleton width="160px" height="28px" style={{ background: 'rgba(255,255,255,0.25)' }} />
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Skeleton width="80px" height="13px" style={{ marginBottom: '4px' }} />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <div style={{ height: '20px' }} />
        <Skeleton width="60px" height="13px" style={{ marginBottom: '4px' }} />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
