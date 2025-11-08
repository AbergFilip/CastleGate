import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

function Accounts() {
  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Bakgrund #1 - SVG-based two layer structure */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '240px',
            top: '0px',
            left: '0px',
            right: '0px',
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 554 336" 
            preserveAspectRatio="xMidYMin slice"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
          >
            <defs>
              <filter id="filter0_d_accounts" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_accounts" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
              <linearGradient id="paint1_linear_accounts" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
            </defs>
            {/* Bottom layer - rectangle - extended to fill */}
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_accounts)"/>
            {/* Top layer - path with shadow - extended to fill edges */}
            <g filter="url(#filter0_d_accounts)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_accounts)"/>
            </g>
          </svg>
          {/* Header with back arrow */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '88px',
              top: '0px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              zIndex: 3
            }}
          >
            <Link to="/" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h2 
              style={{ 
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '29px',
                textAlign: 'center',
                color: '#FFFFFF',
                margin: 0
              }}
            >
              Konton
            </h2>
          </div>

          {/* Top counter - Totalt på konton */}
          <div 
            style={{
              position: 'absolute',
              width: '343px',
              maxWidth: 'calc(100% - 32px)',
              height: '103px',
              left: '16px',
              top: '113px',
            background: 'linear-gradient(324.07deg, #1C938C 16.2%, #23A49C 64.28%, #2EB8B0 88.1%)',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '16px',
            gap: '8px'
          }}
        >
          <div
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '22px',
              color: '#FFFFFF'
            }}
          >
            Totalt på konton
          </div>
          <div
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '34px',
              lineHeight: '41px',
              color: '#FFFFFF'
            }}
          >
            134 085
          </div>
        </div>
        </div>

        {/* Content area - white background with white cards */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '240px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#FFFFFF',
            padding: '16px',
            paddingBottom: '100px', // Space for navbar
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          {/* Rectangle 148 - White background inside */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              margin: '0 auto',
              background: '#FFFFFF',
              boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.07)',
              borderRadius: '16px',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
          {/* Koppla ny bank - first item after Totalt på konton */}
          <Link
            to="/connect-bank"
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '55px',
              marginTop: '16px',
              marginBottom: '20px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '8px',
              display: 'flex' as const,
              flexDirection: 'row' as const,
              justifyContent: 'space-between' as const,
              alignItems: 'center' as const,
              padding: '16px',
              boxSizing: 'border-box',
              textDecoration: 'none'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Koppla ny bank</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
            </svg>
          </Link>

          {/* Handelsbanken section */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '0px', marginBottom: '12px' }}>
            <h3 
              style={{
                width: '152px',
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: 0
              }}
            >
              Handelsbanken
            </h3>
            <button style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M11 1V17M1 9H21" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M11 1L1 9L11 17M11 1L21 9L11 17" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Handelsbanken accounts */}
          {[
            { name: 'Privatkonto', amount: '29 340', path: '/accounts/privatkonto' },
            { name: 'Barnkonto', amount: '5 600' },
          ].map((account, index) => {
            const commonStyle: CSSProperties = {
              width: '100%',
              maxWidth: '343px',
              height: '55px',
              marginTop: '8px',
              marginBottom: '8px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              textDecoration: 'none',
              color: '#2A2A2A',
            }

            const content = (
              <>
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{account.name}</span>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{account.amount}</span>
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                    <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </>
            )

            if (account.path) {
              return (
                <Link
                  key={`handelsbanken-${index}`}
                  to={account.path}
                  style={{ ...commonStyle, cursor: 'pointer' }}
                >
                  {content}
                </Link>
              )
            }

            return (
              <div
                key={`handelsbanken-${index}`}
                style={commonStyle}
              >
                {content}
              </div>
            )
          })}

          {/* Aktier och fonder */}
          <h3
            style={{
              width: '100%',
              marginTop: '30px',
              marginBottom: '12px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '26px',
              color: '#2A2A2A'
            }}
          >
            Aktier och fonder
          </h3>
          <Link
            to="/accounts/stocks"
            style={{
              width: '100%',
              maxWidth: '343px',
              minHeight: '72px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              textDecoration: 'none',
              color: '#2A2A2A',
              gap: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1C938C' }}>Totalt innehav</span>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A' }}>230 954</span>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '13px', color: '#1C938C' }}>Sedan start 242%</span>
            </div>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#1C938C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>

          <Link
            to="/accounts/assets"
            style={{
              width: '100%',
              maxWidth: '343px',
              minHeight: '72px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              textDecoration: 'none',
              color: '#2A2A2A',
              gap: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1C938C' }}>Totala tillgångar</span>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A' }}>8 750 000</span>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '13px', color: '#1C938C' }}>Marknadsvärde</span>
            </div>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#1C938C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>

          {/* Hämta nytt konto - Handelsbanken */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '55px',
              marginTop: '8px',
              marginBottom: '20px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Hämta nytt konto</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
            </svg>
          </div>

          {/* Danske Bank section */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '30px', marginBottom: '12px' }}>
            <h3 
              style={{
                width: '127px',
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: 0
              }}
            >
              Danske Bank
            </h3>
            <button style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M11 1V17M1 9H21" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M11 1L1 9L11 17M11 1L21 9L11 17" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Danske Bank accounts */}
          {[
            { name: 'Gemensamt konto', amount: '5 395' },
            { name: 'Sparkonto', amount: '14 037' },
          ].map((account, index) => (
            <div
              key={`danske-${index}`}
              style={{
                width: '100%',
                maxWidth: '343px',
                height: '55px',
                marginTop: '8px',
                marginBottom: '8px',
                background: '#FFFFFF',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{account.name}</span>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{account.amount}</span>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          ))}

          {/* Hämta nytt konto - Danske Bank */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '55px',
              marginTop: '8px',
              marginBottom: '20px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Hämta nytt konto</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
            </svg>
          </div>

          {/* Ersättning Castlegate */}
          <h3 
            style={{
              width: '100%',
              marginTop: '30px',
              marginBottom: '12px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '26px',
              color: '#2A2A2A'
            }}
          >
            Ersättning Castlegate
          </h3>

          {/* Account card for Ersättning Castlegate */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '55px',
              marginTop: '8px',
              marginBottom: '20px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Ersättningskonto</span>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>9 291</span>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Min lön */}
          <h3 
            style={{
              width: '100%',
              marginTop: '30px',
              marginBottom: '12px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '26px',
              color: '#2A2A2A'
            }}
          >
            Min lön
          </h3>

          {/* Lönebesked */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '55px',
              marginTop: '8px',
              marginBottom: '20px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Lönebesked</span>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Ekonomi och budget */}
          <h3 
            style={{
              width: '100%',
              marginTop: '30px',
              marginBottom: '16px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '26px',
              color: '#2A2A2A'
            }}
          >
            Ekonomi och budget
          </h3>

          {/* Utgifter / sparande / inkomst */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '43px',
              marginTop: '0px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
              Utgifter 18 490
            </span>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
              Sparande 3 949
            </span>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
              Inkomst 22 439
            </span>
          </div>

          {/* Köputmärkelser */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '30px', marginBottom: '12px' }}>
            <h3 
              style={{
                width: '159px',
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: 0
              }}
            >
              Köputmärkelser
            </h3>
            <button style={{ width: '20px', height: '20px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#2A2A2A" strokeWidth="2"/>
                <path d="M10 6V10M10 14H10.01" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Utmärkelser - shield badges */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '91px',
              marginTop: '8px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '24px',
              overflowX: 'scroll'
            }}
          >
            {/* Shield badges - Nivå 1-3 active, 4-5 inactive */}
            {[
              { level: 1, active: true, hasCheck: true, fillOpacity: 0 },
              { level: 2, active: true, hasCheck: true, fillOpacity: 0.3 },
              { level: 3, active: true, hasCheck: true, fillOpacity: 0.6, bold: true },
              { level: 4, active: false, hasCheck: false, fillOpacity: 0 },
              { level: 5, active: false, hasCheck: false, fillOpacity: 0 },
            ].map((badge, index) => (
              <div key={index} style={{ width: '60px', height: '91px', position: 'relative', flexShrink: 0 }}>
                {/* Shield shape */}
                <svg width="60" height="65" viewBox="0 0 60 65" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path d="M30 0L0 15L0 35C0 50 15 60 30 65C45 60 60 50 60 35L60 15L30 0Z" 
                    fill={badge.active ? '#146D7B' : 'none'} 
                    stroke={badge.active ? '#146D7B' : '#ACACAC'} 
                    strokeWidth="2"
                    fillOpacity={badge.fillOpacity}
                  />
                  {badge.hasCheck && (
                    <>
                      {/* Vit cirkel i övre högra hörnet */}
                      <circle cx="52" cy="8" r="5" fill="#FFFFFF"/>
                      {/* Teal bockmarkering */}
                      <path d="M49.5 8L51 9.5L54.5 6" stroke="#146D7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </>
                  )}
                </svg>
                <span style={{ 
                  position: 'absolute', 
                  width: '39px', 
                  height: '18px', 
                  left: '11px', 
                  top: '73px', 
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', 
                  fontWeight: badge.bold ? 700 : 400, 
                  fontSize: '14px', 
                  lineHeight: '125%', 
                  textAlign: 'center', 
                  color: badge.active ? '#2A2A2A' : '#ACACAC' 
                }}>
                  Nivå {badge.level}
                </span>
              </div>
            ))}
          </div>

          {/* Mitt kreditbetyg */}
          <h3 
            style={{
              width: '100%',
              marginTop: '30px',
              marginBottom: '12px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '26px',
              color: '#2A2A2A'
            }}
          >
            Mitt kreditbetyg
          </h3>

          {/* Account card for Mitt kreditbetyg */}
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              height: '55px',
              marginTop: '8px',
              marginBottom: '8px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Skaffa Kreddy</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="3" width="12" height="12" rx="2" stroke="#2A2A2A" strokeWidth="2"/>
              <path d="M8 6L12 10L8 14" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accounts

