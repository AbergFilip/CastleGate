import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const KAMPANJER = [
  {
    id: 'rabatt',
    title: '300:- RABATT',
    subtitle: 'Vid köp för minst 600:-',
    expanded: true,
    terms: 'Gäller vid ett köptillfälle när du handlar mobilskal, hörlurar, högtalare, och andra tillbehör på Telia C4 Shopping. Gäller ej Apples orginaltillbehör. Kan ej kombineras med andra erbjudanden. Kan ej användas vid köp av presentkort eller via telia.se. Vid köp med denna kupong gäller endast bytesrätt. Kan ej lösas in mot kontanter.',
  },
  {
    id: 'cloud',
    title: 'Gratis Telia Cloud',
    subtitle: 'Alltid oändlig lagring med nya abonnemang',
  },
  {
    id: 'fotboll',
    title: 'All fotboll på ett ställe...',
    subtitle: 'TV-paket 499:-/mån i 3 mån',
  },
]

function AbonnemangKvitto() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>('rabatt')

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      {/* Header vit */}
      <div
        style={{
          background: '#FFFFFF',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/abonnemang/telia/12gb')}
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0, color: '#212121' }}>
          Telia kvitto
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" style={{ background: 'transparent', border: 'none', padding: 4, cursor: 'pointer' }} aria-label="Ring">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
          </button>
          <button type="button" style={{ background: 'transparent', border: 'none', padding: 4, cursor: 'pointer' }} aria-label="Meddelande">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', maxWidth: '400px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Kvitto-kort */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '20px',
            marginBottom: '20px',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '13px',
            color: '#424242',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 600, color: '#212121' }}>Telia AB</div>
          <div style={{ marginBottom: '8px' }}>Org nr: 556103-4242</div>
          <div style={{ marginBottom: '16px' }}>Tfn: 020-...</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Nr</span>
            <span>Kassa</span>
            <span>Tid</span>
          </div>
          <div style={{ borderTop: '1px solid #E0E0E0', paddingTop: '12px', marginBottom: '12px' }}>
            Abonnemang startavgift — 369,00
          </div>
          <div style={{ marginBottom: '4px' }}>Antal: 1</div>
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>Totalt: 369,00</div>
          <div style={{ marginBottom: '4px' }}>Betalt Kontokort: 369,00</div>
          <div style={{ borderTop: '1px solid #E0E0E0', paddingTop: '12px', marginTop: '12px', fontSize: '12px', color: '#757575' }}>
            MOMS 25,0% · BRUTTO 369,00 · MOMS 92,25 · NETTO 276,75
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>Välkommer åter!</div>
          <div style={{ textAlign: 'center', marginTop: '12px', letterSpacing: '2px', fontSize: '11px' }}>|||| |||| |||| ||||</div>
        </div>

        {/* Kampanjkort */}
        {KAMPANJER.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setExpandedId(expandedId === k.id ? null : k.id)}
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '16px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: '#6900A2', borderRadius: '8px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '4px' }}>
                  {k.title}
                </div>
                <div style={{ fontSize: '13px', color: '#616161' }}>{k.subtitle}</div>
                {'terms' in k && expandedId === k.id && (
                  <div style={{ marginTop: '12px', fontSize: '11px', color: '#757575', lineHeight: 1.5 }}>{(k as { terms: string }).terms}</div>
                )}
                {'terms' in k && expandedId === k.id && (
                  <div style={{ marginTop: '12px', width: '80px', height: '80px', background: '#E0E0E0', borderRadius: '8px' }} />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AbonnemangKvitto
