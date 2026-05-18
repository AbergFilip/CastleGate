import { useState, useEffect } from 'react'
import { useToast } from '../components/Toast'
import { useNavigate, Link } from 'react-router-dom'
import { getInventories, createInventory, deleteInventory } from '../lib/properties'
import { Modal, FormField, Button } from '../components/Modal'

function Inventories() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'vitvaror' | 'losore'>('vitvaror')
  const [inventories, setInventories] = useState<Record<string, any[]>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    description: '',
    serial_number: '',
    location: '',
  })

  useEffect(() => {
    loadInventories()
  }, [activeTab])

  const loadInventories = async () => {
    try {
      setLoading(true)
      setError(null)
      const type = activeTab === 'vitvaror' ? 'appliance' : 'belonging'
      const allInventories = await getInventories({ type })
      
      // Gruppera inventarier efter kategori
      const grouped: Record<string, any[]> = {}
      const cats: string[] = []

      allInventories.forEach((item: any) => {
        if (!grouped[item.category]) {
          grouped[item.category] = []
          cats.push(item.category)
        }
        grouped[item.category].push(item)
      })

      setInventories(grouped)
      setCategories(cats.sort())
    } catch (err) {
      console.error('Error loading inventories:', err)
      setError(err instanceof Error ? err.message : 'Kunde inte ladda inventarier')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties')
    }
  }

  const handleAddItem = (category: string) => {
    setCurrentCategory(category)
    setFormData({
      name: '',
      brand: '',
      model: '',
      description: '',
      serial_number: '',
      location: '',
    })
    setShowAddModal(true)
  }

  const handleSubmitItem = async () => {
    if (!formData.name.trim() || !currentCategory) return

    try {
      await createInventory({
        type: activeTab === 'vitvaror' ? 'appliance' : 'belonging',
        category: currentCategory,
        name: formData.name,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        description: formData.description || undefined,
        serial_number: formData.serial_number || undefined,
        location: formData.location || undefined,
      })
      loadInventories()
      setShowAddModal(false)
      setFormData({
        name: '',
        brand: '',
        model: '',
        description: '',
        serial_number: '',
        location: '',
      })
    } catch (err) {
      showToast('Kunde inte skapa inventarie: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort detta inventarie?')) return

    try {
      await deleteInventory(itemId)
      loadInventories()
    } catch (err) {
      showToast('Kunde inte ta bort inventarie: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      // Skapa en tom inventarie för att skapa kategorin
      await createInventory({
        type: activeTab === 'vitvaror' ? 'appliance' : 'belonging',
        category: newCategoryName.trim(),
        name: 'Ny kategori',
      })
      setShowCategoryModal(false)
      setNewCategoryName('')
      loadInventories()
    } catch (err) {
      showToast('Kunde inte skapa kategori: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_inventories" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_inventories" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_inventories" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_inventories)" />
          <g filter="url(#filter0_d_inventories)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_inventories)" />
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
          <button
            type="button"
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              zIndex: 5,
            }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
            Inventarier
          </h2>
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
            padding: '16px 20px',
            boxSizing: 'border-box',
            gap: '12px',
          }}
        >
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#2A2A2A', opacity: 0.6 }}>Sök bland tillhörigheter</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="#1A7498" strokeWidth="2" />
            <path d="M14 14L18 18" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Vit bakgrund för innehållet */}
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
          paddingBottom: '16px',
        }}
      >
        {/* Navigationsbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '40px',
            paddingBottom: '16px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0px',
              background: 'transparent',
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
            }}
          >
            {[
              { key: 'vitvaror', label: 'Vitvaror' },
              { key: 'losore', label: 'Lösöre' },
            ].map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as 'vitvaror' | 'losore')}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #1A7498' : '2px solid transparent',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#2A2A2A',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar inventarier...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <section key={category} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#2A2A2A',
                  }}
                >
                  {category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {inventories[category]?.map((item) => {
                    const content = (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.name === 'Big Chill kylskåp' || item.name.toLowerCase().includes('big chill')) {
                            navigate('/properties/inventories/big-chill')
                          }
                        }}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                          padding: '14px 18px',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 500,
                            fontSize: '15px',
                            color: '#2A2A2A',
                          }}
                        >
                          {item.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={(e) => handleDeleteItem(item.id, e)}
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
                          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    )
                    return content
                  })}
                  <div
                    onClick={() => handleAddItem(category)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      border: '2px dashed #E3ECFF',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
                        color: '#1A7498',
                      }}
                    >
                      Lägg till ny
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </section>
            ))}
            <div
              onClick={() => setShowCategoryModal(true)}
              style={{
                width: '100%',
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
                cursor: 'pointer',
                border: '2px dashed #E3ECFF',
              }}
            >
              <span
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#1A7498',
                }}
              >
                Skapa ny kategori
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1V11M1 6H11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </>
        )}
      </div>
      </div>

      {/* Modal för att lägga till inventarie */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormData({
            name: '',
            brand: '',
            model: '',
            description: '',
            serial_number: '',
            location: '',
          })
        }}
        title={`Lägg till inventarie - ${currentCategory || ''}`}
      >
        <FormField
          label="Namn"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Ange namn"
          required
        />
        <FormField
          label="Märke"
          value={formData.brand}
          onChange={(value) => setFormData({ ...formData, brand: value })}
          placeholder="Ange märke (valfritt)"
        />
        <FormField
          label="Modell"
          value={formData.model}
          onChange={(value) => setFormData({ ...formData, model: value })}
          placeholder="Ange modell (valfritt)"
        />
        <FormField
          label="Serienummer"
          value={formData.serial_number}
          onChange={(value) => setFormData({ ...formData, serial_number: value })}
          placeholder="Ange serienummer (valfritt)"
        />
        <FormField
          label="Plats"
          value={formData.location}
          onChange={(value) => setFormData({ ...formData, location: value })}
          placeholder="Var i hemmet (valfritt)"
        />
        <FormField
          label="Beskrivning"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder="Ange beskrivning (valfritt)"
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false)
              setFormData({
                name: '',
                brand: '',
                model: '',
                description: '',
                serial_number: '',
                location: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitItem}
            disabled={!formData.name.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>

      {/* Modal för att skapa ny kategori */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false)
          setNewCategoryName('')
        }}
        title="Skapa ny kategori"
      >
        <FormField
          label="Kategorinamn"
          value={newCategoryName}
          onChange={(value) => setNewCategoryName(value)}
          placeholder="Ange kategorinamn"
          required
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCategoryModal(false)
              setNewCategoryName('')
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim()}
          >
            Skapa
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Inventories
