import { useState } from 'react'
import { DocumentIcon, MailIcon, CartIcon, BellIcon, UsersIcon } from '../components/Icons'

const notificationData = [
  {
    category: 'Ekonomi',
    icon: DocumentIcon,
    title: 'Du har en ny faktura att betala',
    description: 'Fakturan är från Telenor och har förfallodatum 2021-03-24.',
    time: '25 min',
  },
  {
    category: 'Brevlåda',
    icon: MailIcon,
    title: 'Jonas Karlsson',
    description: 'Kan du titta på de dokumenten jag skickade till dig? Och glöm inte att vi...',
    time: '1 tim',
  },
  {
    category: 'Marknad',
    icon: CartIcon,
    title: 'Du har ett nytt erbjudande',
    description: 'Smeg 50’s style - navy blue',
    time: '1,5 tim',
  },
  {
    category: 'Ekonomi',
    icon: DocumentIcon,
    title: 'Du har fått ersättning för dina annonsplatser',
    description: 'När du tillåter företag att annonsera till dig får du ersättning som hamnar på ditt ersättningskonto',
    time: '1,5 tim',
  },
  {
    category: 'Ekonomi',
    icon: DocumentIcon,
    title: 'Din lön har kommit',
    description: 'Nu kan du ta del av din lönespecifikation',
    time: '2 tim',
  },
  {
    category: 'Nätverk',
    icon: UsersIcon,
    title: 'Peter Johansson vill bli en del av ditt nätverk',
    description: 'Kollega',
    time: '2 tim',
  },
  {
    category: 'Ekonomi',
    icon: DocumentIcon,
    title: 'Du har en obetald faktura som snart kommer att förfalla',
    description: 'Fakturan är från Telenor och har förfallodatum 2021-03-29.',
    time: '3 tim',
  },
  {
    category: 'Ekonomi',
    icon: DocumentIcon,
    title: 'Du har en obetald faktura som snart kommer att förfalla',
    description: 'Fakturan är från Telenor och har förfallodatum 2021-03-29.',
    time: '3 tim',
  },
]

function Notifications() {
  const [notifications, setNotifications] = useState(notificationData)

  const handleClear = () => {
    setNotifications([])
  }

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
          zIndex: 3,
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 16px 0 16px' }}>
          <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>Senaste händelser</span>
          {notifications.length > 0 && (
            <button
              type='button'
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#1A7498',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
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
          gap: '16px',
        }}
      >
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <BellIcon width={48} height={48} color='#CBD5F5' />
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A', opacity: 0.7 }}>Inga notiser just nu</span>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const IconComponent = notification.icon
            return (
              <div
                key={`${notification.title}-${index}`}
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
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#DEEDF4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent width={22} height={22} color='#1A7498' />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#1A7498' }}>{notification.category}</span>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#94A3B8' }}>{notification.time}</span>
                  </div>
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>{notification.title}</span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{notification.description}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Notifications

