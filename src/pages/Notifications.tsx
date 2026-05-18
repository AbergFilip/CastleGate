import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DocumentIcon, MailIcon, CartIcon, BellIcon, UsersIcon, XIcon } from '../components/Icons'
import {
  getNotifications,
  clearAllNotifications,
  markNotificationAsRead,
  deleteNotification,
  type Notification,
} from '../lib/notifications'
import { useToast } from '../components/Toast'
import { Skeleton } from '../components/Skeleton'

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Nu'
  if (diffMins < 60) return `${diffMins} min`
  if (diffHours < 24) return `${diffHours} tim`
  if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? 'ar' : ''}`
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function getDayBucket(dateString: string): 'idag' | 'igar' | 'denna_vecka' | 'tidigare' {
  const date = new Date(dateString)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const dayMs = 86_400_000
  const ts = date.getTime()
  if (ts >= startOfToday) return 'idag'
  if (ts >= startOfToday - dayMs) return 'igar'
  if (ts >= startOfToday - 6 * dayMs) return 'denna_vecka'
  return 'tidigare'
}

const BUCKET_LABEL: Record<ReturnType<typeof getDayBucket>, string> = {
  idag: 'Idag',
  igar: 'Igår',
  denna_vecka: 'Denna vecka',
  tidigare: 'Tidigare',
}

const BUCKET_ORDER: ReturnType<typeof getDayBucket>[] = ['idag', 'igar', 'denna_vecka', 'tidigare']

function getIconForCategory(category: string) {
  switch (category) {
    case 'Ekonomi':
      return DocumentIcon
    case 'Brevlåda':
      return MailIcon
    case 'Marknad':
      return CartIcon
    case 'Nätverk':
      return UsersIcon
    default:
      return BellIcon
  }
}

function getRouteForCategory(category: string): string | null {
  switch (category) {
    case 'Ekonomi': return '/home'
    case 'Brevlåda': return '/mailbox'
    case 'Marknad': return '/marketplace'
    case 'Nätverk': return '/network'
    case 'Egendomar': return '/properties'
    default: return null
  }
}

function getMessageFromError(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message
  if (typeof err === 'string' && err) return err
  return fallback
}

function Notifications() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void loadNotifications()
  }, [])

  async function loadNotifications() {
    try {
      setLoading(true)
      setError(null)
      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Error loading notifications:', err)
      setError(getMessageFromError(err, 'Kunde inte ladda notifikationer'))
    } finally {
      setLoading(false)
    }
  }

  async function handleClear() {
    if (notifications.length === 0) return
    if (!confirm('Är du säker på att du vill rensa alla notifikationer?')) return
    try {
      await clearAllNotifications()
      setNotifications([])
    } catch (err) {
      showToast('Kunde inte rensa notifikationer: ' + getMessageFromError(err, 'Okänt fel'), 'error')
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await markNotificationAsRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNotification(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      showToast('Kunde inte ta bort notifikation: ' + getMessageFromError(err, 'Okänt fel'), 'error')
    }
  }

  function handleCardActivate(notification: Notification) {
    if (!notification.read) void handleMarkAsRead(notification.id)
    const route = getRouteForCategory(notification.category)
    if (route) navigate(route)
  }

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const grouped = useMemo(() => {
    const groups: Record<ReturnType<typeof getDayBucket>, Notification[]> = {
      idag: [], igar: [], denna_vecka: [], tidigare: [],
    }
    for (const notification of notifications) {
      groups[getDayBucket(notification.created_at)].push(notification)
    }
    return groups
  }, [notifications])

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width='100%'
          height='100%'
          viewBox='0 0 554 336'
          preserveAspectRatio='xMidYMin slice'
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id='filter0_d_notifications' x='-50' y='-50' width='654' height='436' filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
              <feOffset dx='-2' dy='-2' />
              <feGaussianBlur stdDeviation='10' />
              <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0' />
              <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
            </filter>
            <linearGradient id='paint0_linear_notifications' x1='193.714' y1='62.3333' x2='398.505' y2='322.66' gradientUnits='userSpaceOnUse'>
              <stop stopColor='#1A7498' />
              <stop offset='0.510382' stopColor='#1A7498' />
              <stop offset='1' stopColor='#1A7498' />
            </linearGradient>
            <linearGradient id='paint1_linear_notifications' x1='105.219' y1='61.4667' x2='288.087' y2='379.015' gradientUnits='userSpaceOnUse'>
              <stop stopColor='#1A7498' />
              <stop offset='0.510382' stopColor='#1A7498' />
              <stop offset='1' stopColor='#1A7498' />
            </linearGradient>
          </defs>
          <rect x='0' y='0' width='554' height='336' fill='url(#paint0_linear_notifications)' />
          <g filter='url(#filter0_d_notifications)'>
            <path d='M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z' fill='url(#paint1_linear_notifications)' />
          </g>
        </svg>

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
            zIndex: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '24px',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              Notiscenter
            </h2>
            {unreadCount > 0 && (
              <span
                aria-label={`${unreadCount} olästa`}
                style={{
                  background: '#FFFFFF',
                  color: '#1A7498',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  borderRadius: '999px',
                  padding: '2px 10px',
                  lineHeight: 1.4,
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 6,
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 16px 0 16px' }}>
          <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>
            Senaste händelser
          </span>
          {notifications.length > 0 && (
            <button
              type='button'
              onClick={handleClear}
              className='tap-target'
              style={{
                background: 'transparent',
                border: 'none',
                color: '#1A7498',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
              }}
            >
              Rensa alla
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '232px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Skeleton width='80px' height='13px' style={{ marginBottom: '4px' }} />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <Skeleton width='60px' height='13px' style={{ marginTop: '8px', marginBottom: '4px' }} />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#d32f2f', display: 'block', marginBottom: '12px' }}>
              {error}
            </span>
            <button
              type='button'
              onClick={() => void loadNotifications()}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid #1A7498',
                background: '#1A7498',
                color: '#FFFFFF',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Försök igen
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              aria-hidden
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <BellIcon width={36} height={36} color='#1A7498' />
            </div>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '17px', color: '#2A2A2A' }}>
              Allt är lugnt
            </span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#64748B', maxWidth: '260px' }}>
              Här dyker nya händelser upp – från ekonomi, brevlåda, marknad och ditt nätverk.
            </span>
          </div>
        ) : (
          BUCKET_ORDER.map((bucket) => {
            const items = grouped[bucket]
            if (items.length === 0) return null
            return (
              <section key={bucket} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    padding: '0 4px',
                  }}
                >
                  {BUCKET_LABEL[bucket]}
                </div>
                {items.map((notification) => {
                  const IconComponent = getIconForCategory(notification.category)
                  const isInteractive = !notification.read || getRouteForCategory(notification.category) !== null
                  return (
                    <div
                      key={notification.id}
                      role={isInteractive ? 'button' : undefined}
                      tabIndex={isInteractive ? 0 : undefined}
                      onClick={() => handleCardActivate(notification)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          handleCardActivate(notification)
                        }
                      }}
                      style={{
                        background: notification.read ? '#FFFFFF' : '#F0F9FF',
                        borderRadius: '16px',
                        boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                        padding: '16px',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'flex-start',
                        cursor: isInteractive ? 'pointer' : 'default',
                        position: 'relative',
                        outline: 'none',
                      }}
                    >
                      {!notification.read && (
                        <span
                          aria-hidden
                          style={{
                            position: 'absolute', top: '14px', right: '52px',
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: '#1A7498',
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          background: '#DEEDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent width={22} height={22} color='#1A7498' />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#1A7498' }}>
                            {notification.category}
                          </span>
                          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#94A3B8', flexShrink: 0 }}>
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>
                          {notification.title}
                        </span>
                        {notification.description && (
                          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                            {notification.description}
                          </span>
                        )}
                      </div>
                      <button
                        type='button'
                        onClick={(event) => {
                          event.stopPropagation()
                          void handleDelete(notification.id)
                        }}
                        aria-label='Ta bort notifikation'
                        className='tap-target'
                        style={{
                          background: 'transparent', border: 'none',
                          padding: '8px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: '36px', minHeight: '36px',
                          borderRadius: '8px',
                          color: '#94A3B8',
                          flexShrink: 0,
                        }}
                      >
                        <XIcon width={16} height={16} color='#94A3B8' />
                      </button>
                    </div>
                  )
                })}
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}

function NotificationSkeleton() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
        padding: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
      }}
    >
      <Skeleton width='44px' height='44px' borderRadius='12px' />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width='40%' height='12px' />
        <Skeleton width='80%' height='14px' />
        <Skeleton width='60%' height='12px' />
      </div>
    </div>
  )
}

export default Notifications
