/**
 * Liten "DEMO"-badge som syns när VITE_DEMO_MODE=true.
 * Hjälper publik/demo-kollegor att se att data är mock/test.
 */
const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export function DemoBadge() {
  if (!IS_DEMO) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '8px',
        right: '8px',
        zIndex: 9998,
        background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
        color: '#FFFFFF',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: '999px',
        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      Demo
    </div>
  )
}
