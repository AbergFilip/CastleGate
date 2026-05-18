import { useCallback, useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import {
  initiateBankIDAuth,
  collectBankIDAuth,
  generateQRCode,
  cancelBankIDAuth,
} from '../lib/bankid'

const DEFAULT_TIMEOUT_MS = 4 * 60 * 1000
const DEFAULT_POLL_MS = 2000

export type BankIdQrStartCallbacks = {
  onComplete: () => void | Promise<void>
  onFail: (message: string) => void
}

/**
 * Gemensamt BankID QR-flöde: initiera, uppdatera QR, poll:a collect, timeout, avbryt.
 * Sätt VITE_SKIP_BANKID=true för att hoppa direkt till onComplete (lokal demo).
 */
export function useBankIdQrFlow(options?: { timeoutMs?: number; pollIntervalMs?: number }) {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const pollIntervalMs = options?.pollIntervalMs ?? DEFAULT_POLL_MS

  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null)
  const [hint, setHint] = useState('')

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const qrRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef(false)
  const orderRefRef = useRef<string | null>(null)

  const clearIntervals = useCallback(() => {
    activeRef.current = false
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    if (qrRef.current) {
      clearInterval(qrRef.current)
      qrRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  /** Avbryt timers och försök avsluta order på servern */
  const reset = useCallback(() => {
    clearIntervals()
    const ref = orderRefRef.current
    orderRefRef.current = null
    if (ref) {
      void cancelBankIDAuth(ref)
    }
    setQrImageUrl(null)
    setHint('')
  }, [clearIntervals])

  useEffect(() => () => reset(), [reset])

  const start = useCallback(
    ({ onComplete, onFail }: BankIdQrStartCallbacks) => {
      reset()
      setHint('Startar BankID...')
      setQrImageUrl(null)

      if (import.meta.env.VITE_SKIP_BANKID === 'true') {
        void (async () => {
          try {
            await onComplete()
          } catch (e) {
            onFail(e instanceof Error ? e.message : 'Något gick fel.')
          }
        })()
        return
      }

      void (async () => {
        try {
          const response = await initiateBankIDAuth()
          orderRefRef.current = response.orderRef
          activeRef.current = true
          setHint('Öppna BankID-appen och skanna QR-koden')

          const updateQr = async () => {
            try {
              const qrString = await generateQRCode(response.orderRef)
              const dataUrl = await QRCode.toDataURL(qrString, {
                width: 200,
                margin: 2,
                color: { dark: '#000000', light: '#FFFFFF' },
              })
              setQrImageUrl(dataUrl)
            } catch {
              /* retry */
            }
          }
          setTimeout(updateQr, 300)
          qrRef.current = setInterval(updateQr, 1000)

          timeoutRef.current = setTimeout(() => {
            if (!activeRef.current) return
            clearIntervals()
            const ref = orderRefRef.current
            orderRefRef.current = null
            if (ref) void cancelBankIDAuth(ref)
            setQrImageUrl(null)
            onFail('Tiden för BankID gick ut. Försök igen.')
          }, timeoutMs)

          pollRef.current = setInterval(async () => {
            if (!activeRef.current) return
            try {
              const result = await collectBankIDAuth(response.orderRef)
              if (result.status === 'complete') {
                clearIntervals()
                orderRefRef.current = null
                setQrImageUrl(null)
                setHint('Identifiering klar!')
                await onComplete()
              } else if (result.status === 'failed') {
                clearIntervals()
                const ref = orderRefRef.current
                orderRefRef.current = null
                if (ref) void cancelBankIDAuth(ref)
                setQrImageUrl(null)
                onFail('BankID-identifiering misslyckades. Försök igen.')
              } else if (result.hintCode === 'userSign') {
                setHint('Skriv in din säkerhetskod i BankID-appen')
              } else if (result.hintCode === 'outstandingTransaction') {
                setHint('Öppna BankID-appen och skanna QR-koden')
              }
            } catch {
              /* transient */
            }
          }, pollIntervalMs)
        } catch (e: unknown) {
          onFail(e instanceof Error ? e.message : 'Kunde inte starta BankID.')
        }
      })()
    },
    [clearIntervals, reset, timeoutMs, pollIntervalMs]
  )

  return { qrImageUrl, hint, setHint, start, reset }
}
