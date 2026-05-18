import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getUserProfile, getMutualFriends, createUserConnection, blockUser, unblockUser, type UserProfile } from '../lib/network'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

function UserProfile() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [mutualFriends, setMutualFriends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingRequest, setSendingRequest] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blocking, setBlocking] = useState(false)
  const [hasTriedLoading, setHasTriedLoading] = useState(false)
  const loadingRef = useRef(false)

  useEffect(() => {
    // Reset när userId ändras
    setHasTriedLoading(false)
    setError(null)
    setProfile(null)
    loadingRef.current = false
    
    if (userId && !loadingRef.current) {
      setHasTriedLoading(true)
      loadingRef.current = true
      loadProfile()
    }
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadProfile = async () => {
    if (!userId || loadingRef.current) return // Förhindra flera samtidiga förfrågningar

    try {
      loadingRef.current = true
      setLoading(true)
      setError(null)
      const [profileData, mutual] = await Promise.all([
        getUserProfile(userId).catch(err => {
          // Om användaren inte hittas, kasta fel direkt
          throw err
        }),
        getMutualFriends(userId).catch(() => []) // Ignorera fel för mutual friends
      ])
      setProfile(profileData)
      setMutualFriends(mutual)
    } catch (err) {
      // Om användaren inte hittas eller är blockerad, visa ett tydligt meddelande
      if (err.message?.includes('hittades inte') || err.message?.includes('404')) {
        setError('Användaren hittades inte eller har tagits bort')
        // Navigera tillbaka till Network efter 2 sekunder om användaren inte finns
        setTimeout(() => {
          navigate('/network')
        }, 2000)
      } else if (err.message?.includes('403') || err.message?.includes('behörighet')) {
        setError('Du har inte behörighet att se denna profil')
        // Navigera tillbaka till Network efter 2 sekunder om ingen behörighet
        setTimeout(() => {
          navigate('/network')
        }, 2000)
      } else {
        setError(err.message || 'Kunde inte ladda profil')
      }
      setProfile(null)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }

  const handleSendRequest = async () => {
    if (!userId || !profile) return

    try {
      setSendingRequest(true)
      await createUserConnection(userId)
      await loadProfile() // Reload för att uppdatera status
      showToast('Förfrågan skickad!', 'success')
    } catch (err) {
      showToast('Kunde inte skicka förfrågan: ' + (err.message || 'Okänt fel'), 'error')
    } finally {
      setSendingRequest(false)
    }
  }

  const handleBlock = async () => {
    if (!userId) return
    if (!confirm('Är du säker på att du vill blockera denna användare? Du kommer inte kunna se varandras profiler eller skicka meddelanden.')) return

    try {
      setBlocking(true)
      await blockUser(userId)
      setIsBlocked(true)
      showToast('Användare blockerad', 'success')
      navigate('/network')
    } catch (err) {
      showToast('Kunde inte blockera användare: ' + (err.message || 'Okänt fel'), 'error')
    } finally {
      setBlocking(false)
    }
  }

  const handleUnblock = async () => {
    if (!userId) return

    try {
      setBlocking(true)
      await unblockUser(userId)
      setIsBlocked(false)
      await loadProfile()
      showToast('Användare avblockerad', 'success')
    } catch (err) {
      showToast('Kunde inte avblockera användare: ' + (err.message || 'Okänt fel'), 'error')
    } finally {
      setBlocking(false)
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#2A2A2A', opacity: 0.6 }}>
          Laddar profil...
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '16px' }}>
        <Link to="/network" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#1A7498', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tillbaka till Nätverk
        </Link>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#d32f2f',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
          marginTop: '20px'
        }}>
          <h2 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '20px', marginBottom: '8px' }}>
            {error?.includes('behörighet') ? 'Ingen behörighet' : 'Profil hittades inte'}
          </h2>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', opacity: 0.7 }}>
            {error || 'Användaren finns inte längre eller har tagits bort'}
          </p>
        </div>
      </div>
    )
  }

  const isOwnProfile = userId === user?.id

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_userprofile" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_userprofile" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_userprofile" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_userprofile)" />
          <g filter="url(#filter0_d_userprofile)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_userprofile)" />
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
            zIndex: 3,
          }}
        >
          <Link to="/network" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h2
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '29px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Profil
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '220px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Profilheader */}
        <div
          style={{
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: profile.avatar_url ? 'transparent' : '#DEEDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name || 'Profil'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '48px' }}>👤</span>
            )}
          </div>
          <h1
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#2A2A2A',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {profile.name || 'Okänd användare'}
          </h1>
          {profile.bio && (
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#2A2A2A',
                opacity: 0.7,
                textAlign: 'center',
                margin: 0,
              }}
            >
              {profile.bio}
            </p>
          )}
          
          {/* Profilstatistik */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            {profile.friends_count !== undefined && (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#1A7498',
                    margin: 0,
                  }}
                >
                  {profile.friends_count}
                </div>
                <div
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#2A2A2A',
                    opacity: 0.6,
                    margin: 0,
                  }}
                >
                  {profile.friends_count === 1 ? 'Vän' : 'Vänner'}
                </div>
              </div>
            )}
            {mutualFriends.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#1A7498',
                    margin: 0,
                  }}
                >
                  {mutualFriends.length}
                </div>
                <div
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#2A2A2A',
                    opacity: 0.6,
                    margin: 0,
                  }}
                >
                  {mutualFriends.length === 1 ? 'Gemensam vän' : 'Gemensamma vänner'}
                </div>
              </div>
            )}
            {profile.created_at && (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#1A7498',
                    margin: 0,
                  }}
                >
                  {new Date(profile.created_at).getFullYear()}
                </div>
                <div
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#2A2A2A',
                    opacity: 0.6,
                    margin: 0,
                  }}
                >
                  Medlem sedan
                </div>
              </div>
            )}
          </div>
          {profile.email && (
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#1A7498',
                margin: 0,
              }}
            >
              {profile.email}
            </p>
          )}

          {/* Action buttons */}
          {!isOwnProfile && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {profile.can_send_request && profile.connection_status === null && !isBlocked && (
                <button
                  onClick={handleSendRequest}
                  disabled={sendingRequest}
                  style={{
                    background: '#1A7498',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: sendingRequest ? 'not-allowed' : 'pointer',
                    opacity: sendingRequest ? 0.6 : 1,
                  }}
                >
                  {sendingRequest ? 'Skickar...' : 'Lägg till'}
                </button>
              )}
              {profile.connection_status === 'pending' && !isBlocked && (
                <span
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    background: '#FFF3E0',
                    color: '#F57C00',
                  }}
                >
                  Förfrågan skickad
                </span>
              )}
              {profile.is_friend && !isBlocked && (
                <span
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    background: '#E8F5E9',
                    color: '#2E7D32',
                  }}
                >
                  Vänner
                </span>
              )}
              {!isBlocked && (
                <button
                  onClick={handleBlock}
                  disabled={blocking}
                  style={{
                    background: 'transparent',
                    color: '#d32f2f',
                    border: '1px solid #d32f2f',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: blocking ? 'not-allowed' : 'pointer',
                    opacity: blocking ? 0.6 : 1,
                  }}
                >
                  {blocking ? 'Blockerar...' : 'Blockera'}
                </button>
              )}
              {isBlocked && (
                <button
                  onClick={handleUnblock}
                  disabled={blocking}
                  style={{
                    background: '#1A7498',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: blocking ? 'not-allowed' : 'pointer',
                    opacity: blocking ? 0.6 : 1,
                  }}
                >
                  {blocking ? 'Avblockerar...' : 'Avblockera'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Gemensamma vänner */}
        {mutualFriends.length > 0 && (
          <div>
            <h3
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                color: '#2A2A2A',
                margin: '0 0 16px 0',
              }}
            >
              Gemensamma vänner ({mutualFriends.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mutualFriends.map((friend) => (
                <Link
                  key={friend.id}
                  to={`/user/${friend.id}`}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: '#DEEDF4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {friend.avatar_url ? (
                      <img src={friend.avatar_url} alt={friend.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    ) : (
                      <span style={{ fontSize: '24px' }}>👤</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#2A2A2A',
                        margin: 0,
                      }}
                    >
                      {friend.name || 'Okänd användare'}
                    </h4>
                  </div>
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                    <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile


