import { useEffect, useMemo, useState } from 'react'
import { SendIcon, XIcon, MailIcon } from '../components/Icons'
import { getMessages, markMessageAsRead, deleteMessage, type Message } from '../lib/messages'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { Skeleton } from '../components/Skeleton'

const AVATAR_COLORS = ['#F97316', '#2563EB', '#0EA5E9', '#22C55E', '#6366F1', '#8B5CF6', '#EC4899']

function getColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return 'Idag'
  if (diffDays === 1) return 'Igår'
  if (diffDays < 7) return `${diffDays} dagar sen`
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleString('sv-SE', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function getMessageFromError(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message
  if (typeof err === 'string' && err) return err
  return fallback
}

function Mailbox() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [openMessage, setOpenMessage] = useState<Message | null>(null)

  useEffect(() => {
    void loadMessages()
  }, [])

  async function loadMessages() {
    try {
      setLoading(true)
      setError(null)
      const data = await getMessages()
      const received = data.filter((msg) => msg.recipient_id === user?.id)
      setMessages(received)
    } catch (err) {
      console.error('Error loading messages:', err)
      setError(getMessageFromError(err, 'Kunde inte ladda meddelanden'))
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await markMessageAsRead(id)
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Är du säker på att du vill ta bort detta meddelande?')) return
    try {
      await deleteMessage(id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (openMessage?.id === id) setOpenMessage(null)
    } catch (err) {
      showToast('Kunde inte ta bort meddelande: ' + getMessageFromError(err, 'Okänt fel'), 'error')
    }
  }

  function handleOpen(message: Message) {
    setOpenMessage(message)
    if (!message.read) void handleMarkAsRead(message.id)
  }

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return messages
    return messages.filter(
      (m) =>
        m.sender_name.toLowerCase().includes(query) ||
        (m.subject || '').toLowerCase().includes(query) ||
        m.content.toLowerCase().includes(query),
    )
  }, [messages, search])

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages])

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
            <filter id='filter0_d_mailbox' x='-50' y='-50' width='654' height='436' filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
              <feOffset dx='-2' dy='-2' />
              <feGaussianBlur stdDeviation='10' />
              <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0' />
              <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
            </filter>
            <linearGradient id='paint0_linear_mailbox' x1='193.714' y1='62.3333' x2='398.505' y2='322.66' gradientUnits='userSpaceOnUse'>
              <stop stopColor='#1A7498' />
              <stop offset='0.510382' stopColor='#1A7498' />
              <stop offset='1' stopColor='#1A7498' />
            </linearGradient>
            <linearGradient id='paint1_linear_mailbox' x1='105.219' y1='61.4667' x2='288.087' y2='379.015' gradientUnits='userSpaceOnUse'>
              <stop stopColor='#1A7498' />
              <stop offset='0.510382' stopColor='#1A7498' />
              <stop offset='1' stopColor='#1A7498' />
            </linearGradient>
          </defs>
          <rect x='0' y='0' width='554' height='336' fill='url(#paint0_linear_mailbox)' />
          <g filter='url(#filter0_d_mailbox)'>
            <path d='M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z' fill='url(#paint1_linear_mailbox)' />
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
              Brevlåda
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

        <div
          style={{
            position: 'absolute',
            width: '100%',
            maxWidth: 'calc(100% - 32px)',
            left: '16px',
            top: '104px',
            background: '#FFFFFF',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
            borderRadius: '100px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            boxSizing: 'border-box',
            gap: '12px',
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Sök innehåll och avsändare'
            aria-label='Sök innehåll och avsändare'
            style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A' }}
          />
          <SendIcon width={20} height={20} color='#1A7498' />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '180px',
          left: 0,
          width: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 6,
          paddingTop: '24px',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 16px 0 16px' }}>
          <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>
            Inkorg
          </span>
          {messages.length > 0 && (
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#64748B' }}>
              {messages.length} meddelande{messages.length === 1 ? '' : 'n'}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '236px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {loading ? (
          <>
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#d32f2f', display: 'block', marginBottom: '12px' }}>
              {error}
            </span>
            <button
              type='button'
              onClick={() => void loadMessages()}
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
        ) : filteredMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              aria-hidden
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <MailIcon width={36} height={36} color='#1A7498' />
            </div>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '17px', color: '#2A2A2A' }}>
              {messages.length === 0 ? 'Inga meddelanden' : 'Inga träffar'}
            </span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#64748B', maxWidth: '260px' }}>
              {messages.length === 0
                ? 'Här samlas meddelanden från företag och personer i ditt nätverk.'
                : 'Prova ett annat sökord eller töm sökfältet.'}
            </span>
          </div>
        ) : (
          filteredMessages.map((message) => {
            const initials = message.sender_name.substring(0, 2).toUpperCase()
            const color = getColorFromName(message.sender_name)
            return (
              <div
                key={message.id}
                role='button'
                tabIndex={0}
                onClick={() => handleOpen(message)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleOpen(message)
                  }
                }}
                style={{
                  background: message.read ? '#FFFFFF' : '#F0F9FF',
                  borderRadius: '16px',
                  boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  position: 'relative',
                  outline: 'none',
                }}
              >
                {!message.read && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute', top: '14px', right: '52px',
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#1A7498',
                    }}
                  />
                )}
                <Avatar
                  name={message.sender_name}
                  color={color}
                  initials={initials}
                  type={message.sender_type as 'person' | 'company'}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#2A2A2A',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {message.sender_name}
                    </span>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#94A3B8', flexShrink: 0 }}>
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  {message.subject && (
                    <span
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#2A2A2A',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {message.subject}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '13px',
                      color: '#475569',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {message.content}
                  </span>
                </div>
                <button
                  type='button'
                  onClick={(event) => {
                    event.stopPropagation()
                    void handleDelete(message.id)
                  }}
                  aria-label='Ta bort meddelande'
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
          })
        )}
      </div>

      {openMessage && (
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='mailbox-message-title'
          onClick={() => setOpenMessage(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15, 23, 33, 0.78)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: 0,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%', maxWidth: 430,
              background: '#FFFFFF',
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: 20,
              display: 'flex', flexDirection: 'column', gap: 14,
              maxHeight: '80vh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <Avatar
                  name={openMessage.sender_name}
                  color={getColorFromName(openMessage.sender_name)}
                  initials={openMessage.sender_name.substring(0, 2).toUpperCase()}
                  type={openMessage.sender_type as 'person' | 'company'}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                      fontWeight: 700,
                      fontSize: 16, color: '#2A2A2A',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {openMessage.sender_name}
                  </div>
                  <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#64748B' }}>
                    {formatFullDate(openMessage.created_at)}
                  </div>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setOpenMessage(null)}
                aria-label='Stäng'
                className='tap-target'
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid #E5E5E5', background: '#F7FBFA',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <XIcon width={16} height={16} color='#2A2A2A' />
              </button>
            </div>
            {openMessage.subject && (
              <div
                id='mailbox-message-title'
                style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: 18, color: '#2A2A2A' }}
              >
                {openMessage.subject}
              </div>
            )}
            <div
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: 14,
                lineHeight: 1.6,
                color: '#2A2A2A',
                whiteSpace: 'pre-wrap',
              }}
            >
              {openMessage.content}
            </div>
            <button
              type='button'
              onClick={() => void handleDelete(openMessage.id)}
              style={{
                marginTop: 4,
                padding: '12px',
                borderRadius: 12,
                border: '1px solid #E5E5E5',
                background: '#FFFFFF',
                color: '#B91C1C',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Ta bort meddelande
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MessageSkeleton() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
        padding: '16px',
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
      }}
    >
      <Skeleton width='44px' height='44px' borderRadius='12px' />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width='40%' height='14px' />
        <Skeleton width='80%' height='13px' />
        <Skeleton width='60%' height='12px' />
      </div>
    </div>
  )
}

function Avatar({ name, color, initials, type }: { name: string; color: string; initials: string; type: 'person' | 'company' }) {
  if (type === 'company' && name === 'Telenor') {
    return (
      <div
        style={{
          width: '44px', height: '44px', borderRadius: '12px', background: '#E0F2FE',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        <img src='https://upload.wikimedia.org/wikipedia/commons/6/68/Telenor_2018_logo.svg' alt='Telenor' style={{ width: '28px' }} />
      </div>
    )
  }

  return (
    <div
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '14px',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

export default Mailbox
