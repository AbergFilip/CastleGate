import { useNavigate, useParams } from 'react-router-dom'

function DeklarationDetail() {
  const navigate = useNavigate()
  const { year } = useParams<{ year: string }>()
  const yearLabel = year ? `Inkomstår ${year}` : 'Inkomstår'

  const formStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '11px',
    color: '#212121',
    lineHeight: 1.35,
  }

  const row = (label: string, value?: string, sign?: '+') => (
    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px', ...formStyle }}>
      <span style={{ flex: '1 1 auto', marginRight: '8px' }}>{label}</span>
      {value != null && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', minWidth: '70px', justifyContent: 'flex-end' }}>
          {sign && <span>{sign}</span>}
          <span style={{ fontWeight: 500 }}>{value}</span>
        </span>
      )}
    </div>
  )

  const sub = (letter: string, label: string, value?: string) => (
    <div key={letter} style={{ marginLeft: '12px', marginBottom: '2px', ...formStyle }}>
      <span style={{ fontWeight: 600 }}>{letter}.</span> {label}
      {value != null && <span style={{ float: 'right', fontWeight: 500 }}>{value}</span>}
    </div>
  )

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      {/* Vit header */}
      <div
        style={{
          position: 'relative',
          background: '#FFFFFF',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/skatter')}
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0, color: '#212121', textAlign: 'center' }}>
          {yearLabel}
        </h1>
      </div>

      {/* INK2S-formulär */}
      <div
        style={{
          margin: '0 auto 80px',
          maxWidth: '480px',
          background: '#FFFFFF',
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          padding: '20px 16px 24px',
          ...formStyle,
        }}
      >
        {/* Skatteverket + titel */}
        <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '1px solid #212121', paddingBottom: '12px' }}>
          <div style={{ fontSize: '10px', color: '#757575', marginBottom: '4px' }}>Skatteverket</div>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>Skattemässiga justeringar INK2S</div>
          <div style={{ fontWeight: 600, fontSize: '12px', marginTop: '2px' }}>Inkomstdeklaration 2</div>
        </div>

        {/* Fr.o.m. / T.o.m. / Org.nr / Datum / Räkenskapsår */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', marginBottom: '16px', fontSize: '10px' }}>
          <span>Fr.o.m. ________ T.o.m. ________</span>
          <span>Organisationsnummer ________</span>
          <span>Datum när blanketten fylls ________</span>
          <span>Räkenskapsår ________</span>
        </div>

        {/* Tvåkolumns-innehåll; en kolumn på smal skärm */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '20px 24px',
          }}
          >
          {/* Vänster kolumn 4.1–4.9 */}
          <div>
            {row('4.1 Årets resultat, vinst', '400 000', '+')}
            {row('4.2 Årets resultat, förlust')}
            <div style={{ marginBottom: '6px' }}>4.3 Bokförda kostnader som inte ska dras av</div>
            {sub('a', 'Skatt på årets resultat')}
            {sub('b', 'Nedskrivning av finansiella tillgångar')}
            {sub('c', 'Andra bokförda kostnader')}
            <div style={{ marginTop: '6px', marginBottom: '4px' }}>4.4 Kostnader som ska dras av men som inte ingår i det redovisade resultatet</div>
            {sub('a', 'Lämnade koncernbidrag')}
            {sub('b', 'Andra ej bokförda kostnader')}
            <div style={{ marginTop: '6px', marginBottom: '4px' }}>4.5 Bokförda intäkter som inte ska tas upp</div>
            {sub('a', 'Ackordsvinster')}
            {sub('b', 'Utdelning')}
            {sub('c', 'Andra bokförda intäkter')}
            <div style={{ marginTop: '6px', marginBottom: '4px' }}>4.6 Intäkter som ska tas upp men som inte ingår i det redovisade resultatet</div>
            {sub('a', 'Beräknad schablonintäkt på kvarvarande periodiseringsfonder...')}
            {sub('b', 'Beräknad schablonintäkt på fondandelar...')}
            {sub('c', 'Mottagna koncernbidrag')}
            {sub('d', 'Intäkt negativt justerad anskaffningsutgift')}
            {sub('e', 'Andra ej bokförda intäkter')}
            <div style={{ marginTop: '6px', marginBottom: '4px' }}>4.7 Avyttring av delägarrätter</div>
            {['a. Bokförd vinst', 'b. Bokförd förlust', 'c. Uppskov med kapitalvinst enligt blankett N4', 'd. Återfört uppskov...', 'e. Kapitalvinst för beskattningsåret', 'f. Kapitalförlust som ska dras av'].map((t) => (
              <div key={t} style={{ marginLeft: '12px', marginBottom: '2px' }}>{t}</div>
            ))}
            <div style={{ marginTop: '6px', marginBottom: '4px' }}>4.8 Andel i handelsbolag (Inkl. avyttring)</div>
            {['a. Bokförd intäkt/vinst', 'b. Skattemässigt överskott enligt N3B', 'c. Bokförd kostnad/förlust', 'd. Skattemässigt underskott enligt N3B'].map((t) => (
              <div key={t} style={{ marginLeft: '12px', marginBottom: '2px' }}>{t}</div>
            ))}
            <div style={{ marginTop: '6px' }}>4.9 Skattemässig justering av bokfört resultat för avskrivning på byggnader och annan fast egendom samt vid restvärdesavskrivning på maskiner och inventarier</div>
          </div>

          {/* Höger kolumn 4.10–4.22 */}
          <div>
            <div style={{ marginBottom: '4px' }}>4.10 Skattemässig korrigering av bokfört resultat vid avyttring av näringsfastighet och näringsbostadsrätt</div>
            <div style={{ marginBottom: '4px' }}>4.11 Skogs-/substansminskningsavdrag (specificeras på blankett NB)</div>
            <div style={{ marginBottom: '4px' }}>4.12 Återföringar vid avyttring av fastighet...</div>
            <div style={{ marginBottom: '4px' }}>4.13 Andra skattemässiga justeringar av resultatet</div>
            <div style={{ marginTop: '8px', marginBottom: '4px' }}>4.14 Underskott</div>
            {sub('a', 'Outnyttjat underskott från föregående år', '300 000')}
            {sub('b', 'Reduktion av outnyttjat underskott med hänsyn till beloppsspärr, ackord eller konkurs')}
            {sub('c', 'Reduktion av outnyttjat underskott med hänsyn till koncernbidragsspärr...', '30 000')}
            {row('4.15 Överskott (flyttas till p. 1.1 på sid. 1) (+) =', '130 000', '+')}
            {row('4.16 Underskott (flyttas till p. 1.2 på sid. 1) (-) =')}
            <div style={{ marginTop: '12px', marginBottom: '4px' }}>Övriga uppgifter</div>
            <div style={{ marginBottom: '2px' }}>4.17 Årets begärda och tidigare års medgivna värdeminskningsavdrag... byggnader</div>
            <div style={{ marginBottom: '2px' }}>4.18 ... markanläggningar</div>
            <div style={{ marginBottom: '2px' }}>4.19 Vid restvärdesavskrivning: Återförda belopp...</div>
            <div style={{ marginBottom: '2px' }}>4.20 Lån från aktieägare (fysisk person)...</div>
            <div style={{ marginBottom: '2px' }}>4.21 Pensionskostnader (som ingår i p. 3.8)</div>
            {row('4.22 Koncern-, fusionsspärrat underskott m.m. (Frivillig uppgift)', '30 000')}
          </div>
        </div>

        {/* Upplysningar om årsredovisningen */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E0E0E0' }}>
          <div style={{ fontWeight: 600, marginBottom: '10px' }}>Upplysningar om årsredovisningen</div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '6px' }}>1. Uppdragstagare (t.ex. redovisningskonsult) har biträtt vid upprättandet av årsredovisningen</div>
            <span style={{ marginRight: '16px' }}>☐ Ja</span>
            <span>☐ Nej</span>
          </div>
          <div>
            <div style={{ marginBottom: '6px' }}>2. Årsredovisningen har varit föremål för revision</div>
            <span style={{ marginRight: '16px' }}>☐ Ja</span>
            <span>☐ Nej</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '20px', fontSize: '10px', color: '#757575' }}>
          SKV 2002 28 sv web 02
        </div>
      </div>
    </div>
  )
}

export default DeklarationDetail
