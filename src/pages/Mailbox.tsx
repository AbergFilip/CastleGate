import { useState } from 'react'
import { MailIcon, SendIcon, PlusIcon } from '../components/Icons'

const messages = [
  {
    name: 'Fredrik Svensson',
    avatarColor: '#F97316',
    initials: 'F',
    description: 'Kan du titta på de här dokumenten?',
    date: '25 jan',
    type: 'person',
  },
  {
    name: 'Telenor',
    avatarColor: '#2563EB',
    initials: 'T',
    description: 'Du har en ny faktura för ditt mobilabonnemang.',
    date: '25 jan',
    type: 'company',
  },
  {
    name: 'Erik Petterson',
    avatarColor: '#0EA5E9',
    initials: 'E',
    description: 'Innehåll förhandsvisning: Lorem ipsum dolor sit amet consectetur.',
    date: '25 jan',
    type: 'person',
  },
  {
    name: 'Mia Petterson',
    avatarColor: '#22C55E',
    initials: 'M',
    description: 'Innehåll förhandsvisning: Lorem ipsum dolor sit amet consectetur.',
    date: '25 jan',
    type: 'person',
  },
  {
    name: 'Christer Lindström',
    avatarColor: '#6366F1',
    initials: 'C',
    description: 'Innehåll förhandsvisning: Lorem ipsum dolor sit amet consectetur.',
    date: '25 jan',
    type: 'person',
  },
  {
    name: 'Peter Johansson',
    avatarColor: '#F97316',
    initials: 'P',
    description: 'Innehåll förhandsvisning: Lorem ipsum dolor sit amet consectetur.',
    date: '25 jan',
    type: 'person',
  },
]

function Mailbox() {
  const [search, setSearch] = useState('')

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
        </div>

        <div
          style={{
            position: 'absolute',
            width: '343px',
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
            padding: '16px 20px',
            boxSizing: 'border-box',
            gap: '12px',
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Sök innehåll och avsändare'
            style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A' }}
          />
          <SendIcon width={20} height={20} color='#1A7498' />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '172px',
          left: 0,
          width: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 3,
          paddingBottom: '32px',
          paddingTop: '96px',
        }}
      >
        <section style={{ padding: '32px 16px 0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>Annonsplats</span>
            <button type='button' style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <SendIcon width={18} height={18} color='#94A3B8' />
            </button>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ width: '60px', height: '80px', background: '#E2E8F0', borderRadius: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>Nya Smeg SCVA115A 2021 Vinky</span>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#475569' }}>Rostfritt stål och klassisk italiensk estetik.</span>
            </div>
          </div>
        </section>

        <section style={{ padding: '24px 16px 0 16px' }}>
          <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>Alla inkorgar</span>
        </section>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '420px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages
          .filter((message) =>
            message.name.toLowerCase().includes(search.toLowerCase()) ||
            message.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((message, index) => (
            <div
              key={`${message.name}-${index}`}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Avatar name={message.name} color={message.avatarColor} initials={message.initials} type={message.type} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>{message.name}</span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#94A3B8' }}>{message.date}</span>
                </div>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{message.description}</span>
              </div>
            </div>
          ))}
      </div>

      <button
        type='button'
        style={{
          position: 'fixed',
          right: '32px',
          bottom: '120px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #1A7498 0%, #2EB8B0 100%)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 12px 30px rgba(26, 116, 152, 0.3)',
          cursor: 'pointer',
          zIndex: 60,
        }}
        aria-label='Nytt meddelande'
      >
        <PlusIcon width={24} height={24} color='#FFFFFF' />
      </button>
    </div>
  )
}

function Avatar({ name, color, initials, type }: { name: string; color: string; initials: string; type: 'person' | 'company' }) {
  if (type === 'company' && name === 'Telenor') {
    return (
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      }}
    >
      {initials}
    </div>
  )
}

export default Mailbox

