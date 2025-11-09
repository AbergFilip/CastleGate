import { useNavigate, Link } from 'react-router-dom'

function InventoryReceipt() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties/inventories/big-chill')
    }
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
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
          Elgiganten kvitto
        </h2>
      </div>

      <div style={{ padding: '104px 16px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '18px', color: '#2A2A2A' }}>Elgiganten AB</span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.75 }}>Org nr: 553290-3059</span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.75 }}>Tfn: 046-123958</span>
          </div>
          <ReceiptRow label="Nr" value="1104000409449 Kassa: 2 (Peter)" />
          <ReceiptRow label="Tid" value="2014-07-14 15:56" />
          <ReceiptRow label="QR2626X-H Husqvarna" value="18 990,00" />
          <ReceiptRow label="Antal" value="1" />
          <ReceiptDivider />
          <ReceiptRow label="Total" value="18 990,00" bold />
          <ReceiptRow label="Betalt" value="Kontokort" />
          <ReceiptDivider />
          <ReceiptRow label="MOMS%" value="25,0%" />
          <ReceiptRow label="BRUTTO" value="18 990,00" />
          <ReceiptRow label="MOMS" value="3 798,00" />
          <ReceiptRow label="NETTO" value="15 192,00" />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <div style={{ background: '#F1F5F9', padding: '12px 24px', borderRadius: '12px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A' }}>Välkomna åter!</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <svg width="220" height="56" viewBox="0 0 220 56" fill="none">
              <rect x="10" y="8" width="200" height="40" fill="#E2E8F0" rx="4" />
              <text x="30" y="34" fontFamily="Roboto" fontSize="12" fill="#64748B">#3900058431790348238409428</text>
            </svg>
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5F5', display: 'inline-block' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1A7498', display: 'inline-block' }} />
        </div>

        <Link
          to="/properties/inventories/big-chill/receipt-offers"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#F8FAFC',
            borderRadius: '16px',
            padding: '16px',
            textDecoration: 'none',
            color: '#1A7498',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
          }}
        >
          Se erbjudanden
        </Link>
      </div>
    </div>
  )
}

function ReceiptRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', fontWeight: bold ? 600 : 500 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function ReceiptDivider() {
  return <div style={{ height: '1px', background: '#E2E8F0', margin: '8px 0' }} />
}

export default InventoryReceipt
