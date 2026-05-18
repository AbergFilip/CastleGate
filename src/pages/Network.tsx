import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  getNetworkConnections, 
  createNetworkConnection, 
  updateNetworkConnection, 
  deleteNetworkConnection,
  getUserConnections,
  searchUsers,
  createUserConnection,
  updateUserConnection,
  deleteUserConnection,
  getRecommendedUsers,
  getFriendLists,
  createFriendList,
  updateFriendList,
  deleteFriendList,
  getFriendListMembers,
  addMemberToList,
  removeMemberFromList,
  type UserConnection,
  type FriendList,
  type FriendListMember
} from '../lib/network'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

function Network() {
  const { showToast } = useToast()
  const [userConnections, setUserConnections] = useState<UserConnection[]>([])
  const [networkConnections, setNetworkConnections] = useState<any[]>([])
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [editingConnection, setEditingConnection] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'contacts' | 'lists'>('users')
  const [friendLists, setFriendLists] = useState<FriendList[]>([])
  const [selectedList, setSelectedList] = useState<FriendList | null>(null)
  const [listMembers, setListMembers] = useState<FriendListMember[]>([])
  const [showListModal, setShowListModal] = useState(false)
  const [showListMembersModal, setShowListMembersModal] = useState(false)
  const [listFormData, setListFormData] = useState({
    name: '',
    description: '',
    color: '#1A7498',
    icon: '👥',
  })
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [searchFilter, setSearchFilter] = useState<string>('all')
  const [searchSort, setSearchSort] = useState<string>('relevance')
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    status: 'Aktiv',
    avatar: '👤',
  })

  useEffect(() => {
    loadConnections()
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        handleSearch()
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const [pendingRequests, setPendingRequests] = useState<UserConnection[]>([])

  const loadConnections = async () => {
    try {
      setLoading(true)
      setError(null)
      const [userConn, networkConn, pending, recommended, lists] = await Promise.all([
        getUserConnections({ status: 'accepted' }),
        getNetworkConnections(),
        getUserConnections({ status: 'pending' }),
        getRecommendedUsers(),
        getFriendLists().catch(() => []) // Fallback om tabellen inte finns ännu
      ])
      setUserConnections(userConn)
      setNetworkConnections(networkConn)
      setPendingRequests(pending)
      setRecommendedUsers(recommended)
      setFriendLists(lists)
    } catch (err) {
      console.error('Error loading connections:', err)
      setError(err.message || 'Kunde inte ladda nätverk')
    } finally {
      setLoading(false)
    }
  }

  const loadListMembers = async (listId: string) => {
    try {
      const members = await getFriendListMembers(listId)
      setListMembers(members)
    } catch (err) {
      console.error('Error loading list members:', err)
      showToast('Kunde inte ladda medlemmar: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleCreateList = async () => {
    if (!listFormData.name.trim()) {
      showToast('Listnamn krävs', 'error')
      return
    }

    try {
      const newList = await createFriendList(
        listFormData.name,
        listFormData.description || undefined,
        listFormData.color,
        listFormData.icon
      )
      setFriendLists([...friendLists, newList])
      setShowListModal(false)
      setListFormData({ name: '', description: '', color: '#1A7498', icon: '👥' })
    } catch (err) {
      showToast('Kunde inte skapa lista: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleUpdateList = async (list: FriendList) => {
    try {
      const updated = await updateFriendList(
        list.id,
        listFormData.name || list.name,
        listFormData.description || list.description,
        listFormData.color || list.color,
        listFormData.icon || list.icon
      )
      setFriendLists(friendLists.map(l => l.id === list.id ? updated : l))
      setShowListModal(false)
      setListFormData({ name: '', description: '', color: '#1A7498', icon: '👥' })
    } catch (err) {
      showToast('Kunde inte uppdatera lista: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna lista?')) return

    try {
      await deleteFriendList(listId)
      setFriendLists(friendLists.filter(l => l.id !== listId))
      if (selectedList?.id === listId) {
        setSelectedList(null)
        setListMembers([])
      }
    } catch (err) {
      showToast('Kunde inte ta bort lista: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleAddMemberToList = async (listId: string, connectionId: string) => {
    try {
      await addMemberToList(listId, connectionId)
      await loadListMembers(listId)
      loadConnections() // Uppdatera listor för att visa uppdaterat medlemsantal
    } catch (err) {
      showToast('Kunde inte lägga till medlem: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleRemoveMemberFromList = async (listId: string, connectionId: string) => {
    try {
      await removeMemberFromList(listId, connectionId)
      await loadListMembers(listId)
      loadConnections()
    } catch (err) {
      showToast('Kunde inte ta bort medlem: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const filter = searchFilter === 'all' ? undefined : searchFilter
      const results = await searchUsers(searchQuery, filter, searchSort)
      setSearchResults(results)
    } catch (err) {
      console.error('Error searching users:', err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddUser = async (userId: string) => {
    setSelectedUser(searchResults.find(u => u.id === userId))
    setRequestMessage('')
    setShowSearchModal(false)
    // Visa modal för meddelande istället
  }

  const handleSendRequest = async () => {
    if (!selectedUser) return

    try {
      await createUserConnection(selectedUser.id, undefined, undefined, requestMessage)
      setSelectedUser(null)
      setRequestMessage('')
      setSearchQuery('')
      setSearchResults([])
      loadConnections()
      showToast('Förfrågan skickad!', 'success')
    } catch (err) {
      showToast('Kunde inte skicka förfrågan: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleAddContactClick = () => {
    setFormData({
      name: '',
      relation: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      status: 'Aktiv',
      avatar: '👤',
    })
    setEditingConnection(null)
    setShowAddModal(true)
  }

  const handleEditClick = (connection: any) => {
    setFormData({
      name: connection.name || '',
      relation: connection.relation || '',
      phone: connection.phone || '',
      email: connection.email || '',
      address: connection.address || '',
      notes: connection.notes || '',
      status: connection.status || 'Aktiv',
      avatar: connection.avatar || '👤',
    })
    setEditingConnection(connection)
    setShowAddModal(true)
  }

  const handleSubmitContact = async () => {
    if (!formData.name.trim()) {
      showToast('Namn krävs', 'error')
      return
    }

    try {
      if (editingConnection) {
        await updateNetworkConnection(editingConnection.id, formData)
      } else {
        await createNetworkConnection(formData)
      }
      setShowAddModal(false)
      loadConnections()
    } catch (err) {
      showToast('Kunde inte spara kontakt: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (id: string, type: 'user' | 'contact', e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort denna relation?')) return

    try {
      if (type === 'user') {
        await deleteUserConnection(id)
      } else {
        await deleteNetworkConnection(id)
      }
      loadConnections()
    } catch (err) {
      showToast('Kunde inte ta bort relation: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

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
            <filter id="filter0_d_network" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_network" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_network" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_network)" />
          <g filter="url(#filter0_d_network)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_network)" />
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
          <Link to="/home" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
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
            Nätverk
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
          gap: '16px',
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0px',
            background: 'transparent',
            marginBottom: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('users')}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === 'users' ? '2px solid #1A7498' : '2px solid transparent',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: activeTab === 'users' ? 600 : 500,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#2A2A2A',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Användare
            {pendingRequests.length > 0 && (
              <span
                style={{
                  marginLeft: '8px',
                  background: '#FF5722',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === 'contacts' ? '2px solid #1A7498' : '2px solid transparent',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: activeTab === 'contacts' ? 600 : 500,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#2A2A2A',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Kontakter
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === 'lists' ? '2px solid #1A7498' : '2px solid transparent',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: activeTab === 'lists' ? 600 : 500,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#2A2A2A',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Vänlistor
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar nätverk...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <>
                {/* Pending förfrågningar */}
                {pendingRequests.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        color: '#2A2A2A',
                        margin: '0 0 16px 0',
                      }}
                    >
                      Väntande förfrågningar ({pendingRequests.length})
                    </h3>
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
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
                          marginBottom: '12px',
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
                          <span style={{ fontSize: '24px' }}>👤</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontFamily: 'Roboto, sans-serif',
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#2A2A2A',
                              margin: 0,
                              marginBottom: '4px',
                            }}
                          >
                            {request.connected_user?.name || request.connected_user?.email || 'Okänd användare'}
                          </h3>
                          <p
                            style={{
                              fontFamily: 'Roboto, sans-serif',
                              fontWeight: 400,
                              fontSize: '14px',
                              color: '#2A2A2A',
                              opacity: 0.6,
                              margin: 0,
                            }}
                          >
                            {request.is_sender ? 'Du skickade en förfrågan' : 'Vill lägga till dig'}
                          </p>
                          {request.message && (
                            <p
                              style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 400,
                                fontSize: '13px',
                                color: '#2A2A2A',
                                opacity: 0.8,
                                margin: '4px 0 0 0',
                                fontStyle: 'italic',
                              }}
                            >
                              "{request.message}"
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {!request.is_sender && (
                            <>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  try {
                                    await updateUserConnection(request.id, 'accepted')
                                    await loadConnections()
                                  } catch (err) {
                                    showToast('Kunde inte acceptera förfrågan: ' + (err.message || 'Okänt fel'), 'error')
                                  }
                                }}
                                style={{
                                  background: '#1A7498',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                }}
                              >
                                Acceptera
                              </button>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  try {
                                    await updateUserConnection(request.id, 'blocked')
                                    await loadConnections()
                                  } catch (err) {
                                    showToast('Kunde inte avvisa förfrågan: ' + (err.message || 'Okänt fel'), 'error')
                                  }
                                }}
                                style={{
                                  background: 'transparent',
                                  color: '#d32f2f',
                                  border: '1px solid #d32f2f',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                }}
                              >
                                Avvisa
                              </button>
                            </>
                          )}
                          {request.is_sender && (
                            <>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  if (!confirm('Är du säker på att du vill ta bort denna förfrågan?')) return
                                  try {
                                    await deleteUserConnection(request.id)
                                    await loadConnections()
                                    // Förhindra navigation - stanna på Network-sidan
                                  } catch (err) {
                                    showToast('Kunde inte ta bort förfrågan: ' + (err.message || 'Okänt fel'), 'error')
                                  }
                                }}
                                style={{
                                  background: 'transparent',
                                  color: '#d32f2f',
                                  border: '1px solid #d32f2f',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                }}
                              >
                                Ta bort
                              </button>
                              <span
                                style={{
                                  fontFamily: 'Roboto, sans-serif',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  background: '#FFF3E0',
                                  color: '#F57C00',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                }}
                              >
                                Väntar på svar
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rekommenderade användare */}
                {recommendedUsers.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        color: '#2A2A2A',
                        margin: '0 0 16px 0',
                      }}
                    >
                      Rekommenderade användare
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recommendedUsers.map((user) => (
                        <Link
                          key={user.id}
                          to={`/user/${user.id}`}
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
                              overflow: 'hidden',
                            }}
                          >
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                            ) : (
                              <span style={{ fontSize: '24px' }}>👤</span>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3
                              style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 600,
                                fontSize: '16px',
                                color: '#2A2A2A',
                                margin: 0,
                              }}
                            >
                              {user.name || 'Okänd användare'}
                            </h3>
                          </div>
                          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accepterade användare */}
                {userConnections.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        color: '#2A2A2A',
                        margin: '0 0 16px 0',
                      }}
                    >
                      Användare ({userConnections.length})
                    </h3>
                    {userConnections.map((connection) => (
                  <Link
                    key={connection.id}
                    to={`/user/${connection.connected_user?.id || connection.connected_user_id}`}
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
                      <span style={{ fontSize: '24px' }}>👤</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 600,
                          fontSize: '16px',
                          color: '#2A2A2A',
                          margin: 0,
                          marginBottom: '4px',
                        }}
                      >
                        {connection.connected_user?.name || connection.connected_user?.email || 'Okänd användare'}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#2A2A2A',
                          opacity: 0.6,
                          margin: 0,
                        }}
                      >
                        {connection.relation || 'Ingen relation'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={(e) => handleDelete(connection.id, 'user', e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        aria-label="Ta bort"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4 4L12 12M4 12L12 4"
                            stroke="#d32f2f"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <span
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: '#E8F5E9',
                          color: '#2E7D32',
                          padding: '4px 12px',
                          borderRadius: '12px',
                        }}
                      >
                        {connection.status === 'accepted' ? 'Aktiv' : connection.status}
                      </span>
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </Link>
                ))}
                  </div>
                )}

                {userConnections.length === 0 && pendingRequests.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
                    Inga användare ännu. Lägg till någon för att komma igång!
                  </div>
                )}

                <button
                  onClick={() => setShowSearchModal(true)}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                    padding: '16px',
                    border: '2px dashed #E3ECFF',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#1A7498',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3V13M3 8H13" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Lägg till användare
                </button>
              </>
            )}
            {activeTab === 'contacts' && (
              <>
                {networkConnections.map((connection) => (
                  <div
                    key={connection.id}
                    onClick={() => handleEditClick(connection)}
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
                      cursor: 'pointer',
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
                      <span style={{ fontSize: '24px' }}>{connection.avatar || '👤'}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 600,
                          fontSize: '16px',
                          color: '#2A2A2A',
                          margin: 0,
                          marginBottom: '4px',
                        }}
                      >
                        {connection.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#2A2A2A',
                          opacity: 0.6,
                          margin: 0,
                        }}
                      >
                        {connection.relation || 'Ingen relation'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={(e) => handleDelete(connection.id, 'contact', e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        aria-label="Ta bort"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4 4L12 12M4 12L12 4"
                            stroke="#d32f2f"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <span
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: connection.status === 'Aktiv' ? '#E8F5E9' : '#FFEBEE',
                          color: connection.status === 'Aktiv' ? '#2E7D32' : '#C62828',
                          padding: '4px 12px',
                          borderRadius: '12px',
                        }}
                      >
                        {connection.status || 'Aktiv'}
                      </span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddContactClick}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                    padding: '16px',
                    border: '2px dashed #E3ECFF',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#1A7498',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3V13M3 8H13" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Lägg till kontakt
                </button>
              </>
            )}
            {activeTab === 'lists' && (
              <>
                {/* Vänlistor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {friendLists.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
                      <p>Du har inga vänlistor ännu.</p>
                      <p style={{ fontSize: '14px', marginTop: '8px' }}>Skapa en lista för att organisera dina vänner.</p>
                    </div>
                  ) : (
                    friendLists.map((list) => (
                      <div
                        key={list.id}
                        onClick={() => {
                          setSelectedList(list)
                          setShowListMembersModal(true)
                          loadListMembers(list.id)
                        }}
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
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: list.color || '#1A7498',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                          }}
                        >
                          {list.icon || '👥'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontFamily: 'Roboto, sans-serif',
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#2A2A2A',
                              margin: 0,
                              marginBottom: '4px',
                            }}
                          >
                            {list.name}
                          </h3>
                          {list.description && (
                            <p
                              style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                color: '#2A2A2A',
                                opacity: 0.6,
                                margin: 0,
                              }}
                            >
                              {list.description}
                            </p>
                          )}
                          <p
                            style={{
                              fontFamily: 'Roboto, sans-serif',
                              fontWeight: 400,
                              fontSize: '12px',
                              color: '#2A2A2A',
                              opacity: 0.5,
                              margin: '4px 0 0 0',
                            }}
                          >
                            {list.member_count || 0} medlemmar
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              setListFormData({
                                name: list.name,
                                description: list.description || '',
                                color: list.color || '#1A7498',
                                icon: list.icon || '👥',
                              })
                              setEditingConnection(list)
                              setShowListModal(true)
                            }}
                            style={{
                              background: 'transparent',
                              border: '1px solid #1A7498',
                              color: '#1A7498',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontFamily: 'Roboto, sans-serif',
                              fontWeight: 500,
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            Redigera
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              await handleDeleteList(list.id)
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            aria-label="Ta bort"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M4 4L12 12M4 12L12 4"
                                stroke="#d32f2f"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  <button
                    onClick={() => {
                      setListFormData({ name: '', description: '', color: '#1A7498', icon: '👥' })
                      setEditingConnection(null)
                      setShowListModal(true)
                    }}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                      padding: '16px',
                      border: '2px dashed #E3ECFF',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#1A7498',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Skapa ny vänlista
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modal för att söka och lägga till användare */}
      <Modal
        isOpen={showSearchModal}
        onClose={() => {
          setShowSearchModal(false)
          setSearchQuery('')
          setSearchResults([])
        }}
        title="Lägg till användare"
      >
        <FormField
          label="Sök efter användare"
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
          placeholder="Sök på namn eller e-post"
          ariaLabel="Sök efter användare"
        />
        
        {/* Filter och sortering */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 500, color: '#2A2A2A' }}>
              Filter
            </label>
            <select
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value)
                if (searchQuery.trim()) {
                  setTimeout(() => handleSearch(), 100)
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px',
                background: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <option value="all">Alla användare</option>
              <option value="friends">Vänner</option>
              <option value="friends_of_friends">Vänner av vänner</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 500, color: '#2A2A2A' }}>
              Sortera
            </label>
            <select
              value={searchSort}
              onChange={(e) => {
                setSearchSort(e.target.value)
                if (searchQuery.trim()) {
                  setTimeout(() => handleSearch(), 100)
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px',
                background: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <option value="relevance">Relevans</option>
              <option value="name">Namn (A-Ö)</option>
            </select>
          </div>
        </div>
        {isSearching && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#2A2A2A', opacity: 0.6 }}>
            Söker...
          </div>
        )}
        {searchResults.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => handleAddUser(user.id)}
                style={{
                  padding: '12px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#DEEDF4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>👤</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
                    {user.name || user.email}
                    {user.is_friend && (
                      <span style={{ marginLeft: '8px', fontSize: '12px', color: '#2E7D32', fontWeight: 500 }}>
                        • Vän
                      </span>
                    )}
                  </div>
                  {user.name && (
                    <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: '#2A2A2A', opacity: 0.6 }}>
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#2A2A2A', opacity: 0.6 }}>
            Inga användare hittades
          </div>
        )}
      </Modal>

      {/* Modal för att skicka förfrågan med meddelande */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null)
          setRequestMessage('')
        }}
        title={`Skicka förfrågan till ${selectedUser?.name || selectedUser?.email || 'användare'}`}
      >
        <div style={{ marginTop: '16px' }}>
          <label style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 500, color: '#2A2A2A', display: 'block', marginBottom: '8px' }}>
            Meddelande (valfritt)
          </label>
          <textarea
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Lägg till ett personligt meddelande..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedUser(null)
              setRequestMessage('')
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSendRequest}
          >
            Skicka förfrågan
          </Button>
        </div>
      </Modal>

      {/* Modal för att lägga till/redigera kontakt */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingConnection(null)
        }}
        title={editingConnection ? 'Redigera kontakt' : 'Lägg till kontakt'}
      >
        <FormField
          label="Namn"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Ange namn"
          required
        />
        <FormField
          label="Relation"
          value={formData.relation}
          onChange={(value) => setFormData({ ...formData, relation: value })}
          placeholder="T.ex. Vän, Familj, Kollega"
        />
        <FormField
          label="Telefon"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          placeholder="Ange telefonnummer (valfritt)"
        />
        <FormField
          label="E-post"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="Ange e-postadress (valfritt)"
        />
        <FormField
          label="Adress"
          value={formData.address}
          onChange={(value) => setFormData({ ...formData, address: value })}
          placeholder="Ange adress (valfritt)"
        />
        <FormField
          label="Anteckningar"
          value={formData.notes}
          onChange={(value) => setFormData({ ...formData, notes: value })}
          placeholder="Ange anteckningar (valfritt)"
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false)
              setEditingConnection(null)
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitContact}
            disabled={!formData.name.trim()}
          >
            {editingConnection ? 'Uppdatera' : 'Spara'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Network
