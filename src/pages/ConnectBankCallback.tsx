import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { syncBankAccountsFromTink } from '../lib/accounts'
import { syncGoCardlessAccounts } from '../lib/gocardless'

function getAllCallbackParams(): URLSearchParams {
  const fromQuery = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const fromHash = typeof window !== 'undefined' && window.location.hash
    ? new URLSearchParams(window.location.hash.replace(/^#/, ''))
    : new URLSearchParams()
  const merged = new URLSearchParams(fromQuery)
  fromHash.forEach((value, key) => merged.set(key, value))
  return merged
}

/**
 * Callback-sida efter Tink Link eller GoCardless-flödet.
 * GoCardless: omdirigerar med ?ref=<requisition_id>
 * Tink: omdirigerar med ?credentials_id=...&account_verification_report_id=...
 */
function ConnectBankCallback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('')
  const [receivedUrl, setReceivedUrl] = useState<string>('')
  const [debugInfo, setDebugInfo] = useState<{ keys: string[]; preview: string } | null>(null)
  const [errorDetail, setErrorDetail] = useState<{ statusCode?: number; body?: string } | null>(null)
  const syncDone = useRef(false)

  useEffect(() => {
    const params = getAllCallbackParams()
    const error = params.get('error')
    const errorDescription = params.get('error_description') || params.get('errorDescription')

    if (typeof window !== 'undefined') setReceivedUrl(window.location.href)

    if (error || errorDescription) {
      setStatus('error')
      setMessage(errorDescription || error || 'Något gick fel vid bankanslutningen.')
      return
    }

    // GoCardless: ref parameter or stored requisition_id
    const gcRef = params.get('ref')
    const gcRequisitionId = gcRef || sessionStorage.getItem('gc_requisition_id')

    if (gcRequisitionId && !params.get('credentials_id') && !params.get('account_verification_report_id')) {
      if (syncDone.current) {
        setStatus('success')
        setMessage('Banken är ansluten via GoCardless. Gå till Konton för att se dina konton.')
        return
      }
      syncDone.current = true
      sessionStorage.removeItem('gc_requisition_id')
      setStatus('loading')
      setMessage('Hämtar konton från GoCardless...')
      syncGoCardlessAccounts(gcRequisitionId)
        .then((result) => {
          if (result.ok) {
            setStatus('success')
            const n = result.created ?? 0
            if (n > 0) {
              setMessage(`${n} konto har lagts till via GoCardless. Gå till Konton för att se dem.`)
            } else {
              setMessage(result.message || 'Inga konton hittades. Kontrollera att du godkände åtkomst hos banken.')
            }
          } else {
            setStatus('error')
            setMessage(result.message || 'Kunde inte hämta konton från GoCardless.')
          }
        })
        .catch((err) => {
          setStatus('error')
          setMessage(err?.message || 'Kunde inte synka konton från GoCardless.')
          setErrorDetail({ statusCode: 0, body: err?.message || String(err) })
        })
      return
    }

    // Tink: credentials_id or account_verification_report_id
    const credentialsId = params.get('credentials_id') || params.get('credentialsId')
    const accountVerificationReportId =
      params.get('account_verification_report_id') || params.get('accountVerificationReportId')

    if (credentialsId || accountVerificationReportId) {
      if (syncDone.current) {
        setStatus('success')
        setMessage('Banken är ansluten. Gå till Konton för att se dina konton.')
        return
      }
      syncDone.current = true
      setStatus('loading')
      setMessage('Hämtar konton från banken...')
      setErrorDetail(null)
      syncBankAccountsFromTink({
        credentials_id: credentialsId,
        account_verification_report_id: accountVerificationReportId,
      })
        .then((result) => {
          if (result.ok) {
            setStatus('success')
            const n = result.created ?? 0
            const total = result.total ?? 0
            if (n > 0) {
              setMessage(`${n} konto har lagts till. Gå till Konton för att se dem.`)
            } else if (total > 0) {
              setMessage(`Tink returnerade ${total} konto men de kunde inte sparas. Gå till Konton och lägg till manuellt om det behövs.`)
            } else {
              setMessage('Banken är ansluten. Inga konton hittades i rapporten.')
              if (result.debugReportKeys?.length || result.debugPreview) {
                setDebugInfo({
                  keys: result.debugReportKeys ?? [],
                  preview: result.debugPreview ?? '',
                })
              }
            }
          } else {
            setStatus('error')
            setMessage(result.message || 'Kunde inte hämta konton från banken.')
            setErrorDetail(result.errorDetail ?? null)
          }
        })
        .catch((err) => {
          setStatus('error')
          setMessage(err?.message || 'Kunde inte synka bankkonton.')
          setErrorDetail({ statusCode: 0, body: err?.message || String(err) })
        })
      return
    }

    setStatus('error')
    setMessage('Ingen callback-data mottagen. Kontrollera att redirect URI matchar denna app.')
    setErrorDetail(null)
  }, [searchParams])

  return (
    <div
      className="page-container"
      style={{
        background: '#FFFFFF',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '400px', textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid #E6E6E6',
                borderTop: '4px solid #146D7B',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}
            />
            <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', color: '#4F4F4F', fontSize: '16px' }}>
              Verifierar anslutning...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#E8F5F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#146D7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>
              Bank ansluten
            </h2>
            <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', color: '#4F4F4F', fontSize: '16px', marginBottom: '24px' }}>
              {message}
            </p>
            {debugInfo && (debugInfo.keys.length > 0 || debugInfo.preview) && (
              <div
                style={{
                  textAlign: 'left',
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}
              >
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Rapportens nycklar: {debugInfo.keys.join(', ') || '—'}</div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{debugInfo.preview || '—'}</pre>
              </div>
            )}
            <Link
              to="/accounts"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#146D7B',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none'
              }}
            >
              Gå till Konton
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>
              Kunde inte ansluta
            </h2>
            <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', color: '#4F4F4F', fontSize: '16px', marginBottom: '12px' }}>
              {message}
            </p>
            {errorDetail && (errorDetail.statusCode !== undefined || errorDetail.body) && (
              <div
                style={{
                  textAlign: 'left',
                  background: '#f8f4f4',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  maxHeight: '180px',
                  overflow: 'auto',
                  border: '1px solid #e0d0d0',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '6px' }}>Teknisk info (för felsökning)</div>
                {errorDetail.statusCode !== undefined && errorDetail.statusCode !== 0 && (
                  <div>HTTP-status: {errorDetail.statusCode}</div>
                )}
                {errorDetail.body && (
                  <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {errorDetail.body}
                  </pre>
                )}
                <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#666' }}>
                  Mer logg finns i backend: <strong>backend/logs/castlegate.log</strong> (öppna filen i Cursor).
                </p>
              </div>
            )}
            {receivedUrl && (
              <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666', wordBreak: 'break-all', marginBottom: '24px', textAlign: 'left' }}>
                URL vid ankomst: {receivedUrl}
              </p>
            )}
            <Link
              to="/connect-bank"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#146D7B',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none'
              }}
            >
              Försök igen
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default ConnectBankCallback
