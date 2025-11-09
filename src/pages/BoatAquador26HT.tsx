import { useNavigate } from 'react-router-dom'

function BoatAquador26HT() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties/boats')
    }
  }

  const overview = [
    { label: 'Dimensioner', value: '4,2 x 2,5 x 1,5 meter' },
    { label: 'Vikt', value: '800kg' },
    { label: 'Motor', value: 'Yamaha 80hk' },
    { label: 'Tankstorlek', value: '70 liter' },
    { label: 'Djupgående', value: '0,8 meter' },
    { label: 'Batterier', value: '2 x 100Ah 12V' },
    { label: 'Navigering', value: 'GPS' },
    { label: 'Skrovnummer', value: '648-21' },
    { label: 'Plats', value: 'Stockholm' },
    { label: 'Hemhamn', value: 'Brunnsvikens Marina' },
  ]

  const inspections = [{ date: '2020-03-18', status: 'Godkänd' }]

  const history = [
    { label: 'Service', count: 4 },
    { label: 'Utanför Service', count: 11 },
  ]

  const documents = [
    { label: 'Köpehandlingar' },
    { label: 'Ägarbyte' },
  ]

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
          background: '#FFFFFF',
          boxShadow: '0px 2px 10px rgba(15, 67, 104, 0.08)',
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
          Aquador 26HT
        </h2>
      </div>

      <div style={{ padding: '112px 16px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}>Översikt</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {overview.map((row) => (
              <DataRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '16px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>Estimerat värde</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                defaultValue="Ex. 450 000kr"
                style={{
                  border: '1px solid #D8DEE6',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  color: '#2A2A2A',
                  width: '160px',
                }}
              />
              <button
                type="button"
                style={{
                  background: 'linear-gradient(135deg, #1A7498 0%, #2EB8B0 100%)',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '12px 18px',
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

        <SectionCard title="Båtlån" action="Handelsbanken båtlån — Ränta: 4,2%" />
        <SectionCard title="Försäkring" action="IF Båtförsäkring Max" />

        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}>Besiktningar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inspections.map((inspection) => (
              <div key={inspection.date} style={listItemStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={labelStrong}>Ingarö båtverkstad</span>
                  <span style={valueStyle}>{inspection.date}</span>
                  <span style={{ ...linkStyle, marginTop: '4px' }}>{inspection.status}</span>
                </div>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            ))}
            <div style={listItemStyle}>
              <span style={labelStrong}>Hämta ny besiktning</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1V11M1 6H11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}>Reparationshistorik</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map((entry) => (
              <div key={entry.label} style={listItemStyle}>
                <span style={labelStrong}>{entry.label}</span>
                <span style={{ ...valueStyle, color: '#1A7498' }}>{entry.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}>Övrigt</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map((doc) => (
              <div key={doc.label} style={listItemStyle}>
                <span style={labelStrong}>{doc.label}</span>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
  fontWeight: 600,
  fontSize: '16px',
  color: '#2A2A2A',
}

const listItemStyle: React.CSSProperties = {
  background: '#F8FAFC',
  borderRadius: '12px',
  padding: '14px 18px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const labelStrong: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  fontSize: '15px',
  color: '#2A2A2A',
}

const valueStyle: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  color: '#2A2A2A',
}

const linkStyle: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '13px',
  color: '#1A7498',
}

function SectionCard({ title, action }: { title: string; action: string }) {
  const [primary, secondary] = action.split(' — ')
  return (
    <section style={cardStyle}>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <div style={{ ...listItemStyle, background: '#FFFFFF', boxShadow: '0px 4px 12px rgba(20, 45, 120, 0.08)' }}>
        <span style={labelStrong}>{primary}</span>
        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A7498' }}>{secondary ?? ''}</span>
      </div>
    </section>
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

export default BoatAquador26HT
