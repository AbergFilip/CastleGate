import { useNavigate, Link } from 'react-router-dom'

function InventoryItemBigChill() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties/inventories')
    }
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box',
          height: '88px',
          zIndex: 3,
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2
          style={{
            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '29px',
            color: '#2A2A2A',
            margin: 0,
          }}
        >
          Big Chill Kylskåp
        </h2>
      </div>

      <div style={{ padding: '104px 16px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>Översikt</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <DataRow label="Inköpsdatum" value="2014-07-14" />
            <DataRow label="Inköpspris" value="18 990 kr" />
            <DataRow label="Produktnummer" value="SKU#217FF" />
            <DataRow label="Serienummer" value="SE512655001" />
            <DataRow label="Garanti" value="3 år" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>Estimerat värde</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                defaultValue="Ex. 9 000 kr"
                style={{
                  border: '1px solid #D8DEE6',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  color: '#2A2A2A',
                  width: '140px',
                }}
              />
              <button
                type="button"
                style={{
                  background: 'linear-gradient(135deg, #1A7498 0%, #2EB8B0 100%)',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '10px 16px',
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0px 8px 18px rgba(26, 116, 152, 0.25)',
                }}
              >
                Sätt värde
              </button>
            </div>
          </div>
        </section>

        <section style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>Hantera</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ActionRow label="Felanmälan" to="/properties/inventories/big-chill/fault-report" icon="report" />
            <ActionRow label="Reklamation" to="/properties/inventories/big-chill/reclaim" icon="edit" />
            <ActionRow label="DNA-märkning" to="/properties/inventories/big-chill/dna" icon="shield" />
          </div>
        </section>

        <section style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>Kvitto</h3>
          <Link
            to="/properties/inventories/big-chill/receipt"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC',
              borderRadius: '12px',
              padding: '16px',
              textDecoration: 'none',
              color: '#2A2A2A',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>Elgiganten Sickla</span>
              <span style={{ fontSize: '14px', opacity: 0.7 }}>2014-07-14</span>
            </div>
            <span style={{ fontWeight: 600 }}>18 990 kr</span>
          </Link>
        </section>
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>{label}</span>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>{value}</span>
    </div>
  )
}

function ActionRow({ label, to }: { label: string; to: string; icon?: 'report' | 'edit' | 'shield' }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textDecoration: 'none',
        background: '#F8FAFC',
        borderRadius: '12px',
        padding: '16px',
        color: '#2A2A2A',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '15px',
        fontWeight: 500,
      }}
    >
      <span>{label}</span>
      <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
        <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Link>
  )
}

export default InventoryItemBigChill
