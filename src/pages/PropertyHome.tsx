import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RefreshIcon, PlusIcon, ChevronDownIcon, ArrowRightIcon } from '../components/Icons'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'
import { getProperties, createProperty, updateProperty, deleteProperty, formatPropertyValue, searchAddress, type Property, type AddressSearchResult } from '../lib/properties'
import { formatDate } from '../lib/utils'

// Standardbild när ingen bild är tillagd (svensk lägenhetsbyggnad)
const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'


function PropertyHome() {
  const { showToast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSearchResult[]>([])
  const [showAddressDropdown, setShowAddressDropdown] = useState(false)
  const [addressSearching, setAddressSearching] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postal_code: '',
    property_type: '',
    size_sqm: '',
    rooms: '',
    floor: '',
    purchase_date: '',
    purchase_price: '',
    current_value: '',
    valuation_date: '',
    valuation_source: '',
    description: '',
    image_url: '',
  })

  useEffect(() => {
    loadProperties()
  }, [])

  // Debounced adresssökning via Lantmäteriet (endast när Lägg till hem-modalen är öppen)
  useEffect(() => {
    if (!showAddModal) {
      setAddressSuggestions([])
      setShowAddressDropdown(false)
      return
    }
    const q = formData.address.trim()
    if (q.length < 3) {
      setAddressSuggestions([])
      setShowAddressDropdown(false)
      return
    }
    const t = setTimeout(async () => {
      setAddressSearching(true)
      try {
        const results = await searchAddress(q, 12)
        setAddressSuggestions(results)
        setShowAddressDropdown(results.length > 0)
      } finally {
        setAddressSearching(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [showAddModal, formData.address])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const data = await getProperties()
      setProperties(data)
      // Om det finns hem, välj det första som standard
      if (data.length > 0 && !selectedProperty) {
        setSelectedProperty(data[0])
      }
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setFormData({
      address: '',
      city: '',
      postal_code: '',
      property_type: '',
      size_sqm: '',
      rooms: '',
      floor: '',
      purchase_date: '',
      purchase_price: '',
      current_value: '',
      valuation_date: '',
      valuation_source: '',
      description: '',
      image_url: '',
    })
    setShowAddModal(true)
  }

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property)
    setFormData({
      address: property.address || '',
      city: property.city || '',
      postal_code: property.postal_code || '',
      property_type: property.property_type || '',
      size_sqm: property.size_sqm?.toString() || '',
      rooms: property.rooms?.toString() || '',
      floor: property.floor || '',
      purchase_date: property.purchase_date || '',
      purchase_price: property.purchase_price?.toString() || '',
      current_value: property.current_value?.toString() || '',
      valuation_date: property.valuation_date || '',
      valuation_source: property.valuation_source || '',
      description: property.description || '',
      image_url: (property.images && property.images[0]) || '',
    })
    setShowEditModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.address.trim()) {
      showToast('Adress krävs', 'error')
      return
    }

    try {
      const imageUrl = formData.image_url?.trim()
      const images = imageUrl ? [imageUrl] : [DEFAULT_PROPERTY_IMAGE]

      const propertyData: any = {
        type: 'home',
        address: formData.address.trim(),
        city: formData.city || undefined,
        postal_code: formData.postal_code || undefined,
        property_type: formData.property_type || undefined,
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : undefined,
        rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
        floor: formData.floor || undefined,
        purchase_date: formData.purchase_date || undefined,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
        current_value: formData.current_value ? parseFloat(formData.current_value) : undefined,
        valuation_date: formData.valuation_date || undefined,
        valuation_source: formData.valuation_source || undefined,
        description: formData.description || undefined,
        images,
      }

      if (selectedProperty && showEditModal) {
        await updateProperty(selectedProperty.id, propertyData)
      } else {
        await createProperty(propertyData)
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedProperty(null)
      await loadProperties()
    } catch (error) {
      showToast('Kunde inte spara fastighet: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (property: Property) => {
    if (!confirm(`Är du säker på att du vill ta bort ${property.address}?`)) return

    try {
      await deleteProperty(property.id)
      if (selectedProperty?.id === property.id) {
        setSelectedProperty(null)
      }
      setShowEditModal(false)
      await loadProperties()
    } catch (error) {
      showToast('Kunde inte ta bort fastighet: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  // Om inga hem finns, visa tomt tillstånd med knapp för att lägga till
  if (loading) {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#2A2A2A', opacity: 0.6 }}>
          Laddar hem...
        </div>
      </div>
    )
  }

  // Om inga hem finns
  if (properties.length === 0) {
    return (
      <>
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
        {/* Header */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '260px',
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
              <filter id="filter0_d_propertyhome" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_propertyhome" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1A7498"/>
                <stop offset="0.510382" stopColor="#1A7498"/>
                <stop offset="1" stopColor="#1A7498"/>
              </linearGradient>
              <linearGradient id="paint1_linear_propertyhome" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1A7498"/>
                <stop offset="0.510382" stopColor="#1A7498"/>
                <stop offset="1" stopColor="#1A7498"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_propertyhome)"/>
            <g filter="url(#filter0_d_propertyhome)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_propertyhome)"/>
            </g>
          </svg>

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
              zIndex: 2
            }}
          >
            <Link to="/properties" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
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
              Hem
            </h2>
          </div>
        </div>

        {/* Content area */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '260px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#FFFFFF',
            padding: '16px',
            paddingBottom: '100px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 'calc(100% - 32px)' }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px', color: '#2A2A2A', marginBottom: '24px', opacity: 0.6 }}>
              Du har inga hem registrerade ännu.
            </p>
            <Link
              to="/connect-properties"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1A7498',
                color: '#FFFFFF',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '16px',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                position: 'relative',
                zIndex: 10,
                textDecoration: 'none',
              }}
            >
              <span style={{ display: 'inline-flex', marginRight: '8px', verticalAlign: 'middle' }}><PlusIcon width={20} height={20} color="#FFFFFF" /></span>
              Lägg till hem
            </Link>
            <p style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleAddClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1A7498',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Lägg till manuellt
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Lägg till hem"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', position: 'relative' }}>
          <label style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A' }}>
            Adress * <span style={{ color: '#d32f2f' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            onFocus={() => addressSuggestions.length > 0 && setShowAddressDropdown(true)}
            onBlur={() => setTimeout(() => setShowAddressDropdown(false), 200)}
            placeholder="Skriv minst 3 tecken, t.ex. Storgatan 1 Stockholm"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #E5E5E5',
              borderRadius: '12px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px',
              color: '#2A2A2A',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {addressSearching && (
            <span style={{ position: 'absolute', right: '16px', top: '42px', fontSize: '12px', color: '#666' }}>
              Söker...
            </span>
          )}
          {showAddressDropdown && addressSuggestions.length > 0 && (
            <ul
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                margin: 0,
                padding: 0,
                listStyle: 'none',
                background: '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 10,
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {addressSuggestions.map((r, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      address: r.label,
                      city: r.city || '',
                      postal_code: r.postal_code || '',
                    })
                    setShowAddressDropdown(false)
                    setAddressSuggestions([])
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    color: '#2A2A2A',
                    borderBottom: i < addressSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {r.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <FormField
          label="Stad"
          value={formData.city}
          onChange={(value) => setFormData({ ...formData, city: value })}
          placeholder="T.ex. Stockholm (fylls i automatiskt vid adressval)"
        />
        <FormField
          label="Postnummer"
          value={formData.postal_code}
          onChange={(value) => setFormData({ ...formData, postal_code: value })}
          placeholder="T.ex. 123 45 (fylls i automatiskt vid adressval)"
        />
        <FormField
          label="Bostadstyp"
          value={formData.property_type}
          onChange={(value) => setFormData({ ...formData, property_type: value })}
          placeholder="T.ex. Villa, Lägenhet, Radhus"
        />
        <FormField
          label="Storlek (kvm)"
          value={formData.size_sqm}
          onChange={(value) => setFormData({ ...formData, size_sqm: value })}
          type="number"
          placeholder="T.ex. 75"
        />
        <FormField
          label="Antal rum"
          value={formData.rooms}
          onChange={(value) => setFormData({ ...formData, rooms: value })}
          type="number"
          placeholder="T.ex. 3"
        />
        <FormField
          label="Våningsplan"
          value={formData.floor}
          onChange={(value) => setFormData({ ...formData, floor: value })}
          placeholder="T.ex. 3"
        />
        <FormField
          label="Köpeskilling (kr)"
          value={formData.purchase_price}
          onChange={(value) => setFormData({ ...formData, purchase_price: value })}
          type="number"
          placeholder="T.ex. 3000000"
        />
        <FormField
          label="Köpt datum"
          value={formData.purchase_date}
          onChange={(value) => setFormData({ ...formData, purchase_date: value })}
          type="date"
        />
        <FormField
          label="Nuvarande värde (kr)"
          value={formData.current_value}
          onChange={(value) => setFormData({ ...formData, current_value: value })}
          type="number"
          placeholder="T.ex. 3500000"
        />
        <FormField
          label="Värderingsdatum"
          value={formData.valuation_date}
          onChange={(value) => setFormData({ ...formData, valuation_date: value })}
          type="date"
        />
        <FormField
          label="Värderingskälla"
          value={formData.valuation_source}
          onChange={(value) => setFormData({ ...formData, valuation_source: value })}
          placeholder="T.ex. Hemnet, Mäklare"
        />
        <FormField
          label="Bild på bostaden (URL)"
          value={formData.image_url}
          onChange={(value) => setFormData({ ...formData, image_url: value })}
          placeholder="https://... (valfritt)"
        />
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
          >
            Avbryt
          </Button>
          <Button
            onClick={handleSubmit}
          >
            Spara
          </Button>
        </div>
      </Modal>
      </>
    )
  }

  // Om det finns hem men inget är valt, välj det första
  const displayProperty = selectedProperty || properties[0]

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Bakgrund #1 - SVG-based two layer structure */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '260px',
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
              <filter id="filter0_d_propertyhome" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_propertyhome" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1A7498"/>
                <stop offset="0.510382" stopColor="#1A7498"/>
                <stop offset="1" stopColor="#1A7498"/>
              </linearGradient>
              <linearGradient id="paint1_linear_propertyhome" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1A7498"/>
                <stop offset="0.510382" stopColor="#1A7498"/>
                <stop offset="1" stopColor="#1A7498"/>
              </linearGradient>
            </defs>
            {/* Bottom layer - rectangle - extended to fill */}
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_propertyhome)"/>
            {/* Top layer - path with shadow - extended to fill edges */}
            <g filter="url(#filter0_d_propertyhome)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_propertyhome)"/>
            </g>
          </svg>

          {/* Header content */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '0px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '16px',
              boxSizing: 'border-box',
              zIndex: 2
            }}
          >
            {/* Header bar: back button absolute-left, title flex-centered */}
            <div style={{ position: 'relative', width: '100%', height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Link to="/properties" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
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
                Hem
              </h2>
            </div>
            {properties.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {properties.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop)}
                    style={{
                      background: selectedProperty?.id === prop.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    {prop.address}
                  </button>
                ))}
                <Link
                  to="/connect-properties"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px dashed rgba(255, 255, 255, 0.5)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  + Lägg till
                </Link>
              </div>
            )}
            {displayProperty && (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '16px' }}>
                  <span 
                    style={{
                      fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '22px',
                      color: '#FFFFFF'
                    }}
                  >
                    Värdering
                  </span>
                  {displayProperty.valuation_source && (
                    <span 
                      style={{
                        fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#FFFFFF',
                        opacity: 0.7
                      }}
                    >
                      [{displayProperty.valuation_source}]
                    </span>
                  )}
                </div>
                <div 
                  style={{
                    fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '34px',
                    lineHeight: '41px',
                    color: '#FFFFFF',
                    marginTop: '4px'
                  }}
                >
                  {displayProperty.current_value ? formatPropertyValue(displayProperty.current_value) : 'Ej angivet'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content area - white background */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '260px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#FFFFFF',
            padding: '16px',
            paddingBottom: '100px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            zIndex: 2
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              margin: '0 auto',
              background: '#FFFFFF',
              boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.07)',
              borderRadius: '16px',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            {/* Property header */}
            {displayProperty && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 
                    style={{
                      fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                      fontWeight: 700,
                      fontSize: '22px',
                      lineHeight: '26px',
                      color: '#2A2A2A',
                      margin: 0,
                      flex: 1
                    }}
                  >
                    {displayProperty.address}
                    {displayProperty.city && `, ${displayProperty.city}`}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditClick(displayProperty)}
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
                    {properties.length > 1 && (
                      <button
                        onClick={() => handleDelete(displayProperty)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #d32f2f',
                          color: '#d32f2f',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 500,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Ta bort
                      </button>
                    )}
                  </div>
                </div>
                {displayProperty.images && displayProperty.images.length > 0 ? (
                  <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                    <img 
                      src={displayProperty.images[0]} 
                      alt={displayProperty.address}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                    <img 
                      src={DEFAULT_PROPERTY_IMAGE} 
                      alt={displayProperty.address}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x200/E0E0E0/666666?text=Hus' }}
                    />
                  </div>
                )}
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', marginBottom: '32px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1A7498' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #D9D9D9' }}></div>
            </div>

            {/* Detaljerad information */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '0px', marginBottom: '12px' }}>
              <h3 
                style={{
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  lineHeight: '26px',
                  color: '#2A2A2A',
                  margin: 0
                }}
              >
                Detaljerad information
              </h3>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <ChevronDownIcon width={24} height={24} color="#2A2A2A" />
              </button>
            </div>
            {displayProperty && [
              { label: 'Bostadstyp', value: displayProperty.property_type || 'Ej angivet' },
              { label: 'Storlek', value: displayProperty.size_sqm ? `${displayProperty.size_sqm} kvm` : 'Ej angivet' },
              { label: 'Våningsplan', value: displayProperty.floor || 'Ej angivet' },
              { label: 'Rum', value: displayProperty.rooms ? `${displayProperty.rooms} rum` : 'Ej angivet' },
              { label: 'Köpeskilling', value: displayProperty.purchase_price ? formatPropertyValue(displayProperty.purchase_price) : 'Ej angivet' },
              { label: 'Köpt datum', value: displayProperty.purchase_date ? formatDate(displayProperty.purchase_date) : 'Ej angivet' },
            ].filter(item => item.value !== 'Ej angivet' || item.label === 'Bostadstyp').map((item, index, array) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 2 ? '1px solid #EEEEEE' : 'none',
                  marginBottom: index < 2 ? '8px' : '20px'
                }}
              >
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{item.label}</span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{item.value}</span>
              </div>
            ))}

            {/* Värderingsguiden */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Värderingsguiden
            </h3>
            <button
              onClick={() => displayProperty && handleEditClick(displayProperty)}
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginBottom: '20px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
                {displayProperty?.current_value ? 'Uppdatera bostadsvärde' : 'Lägg till bostadsvärde'}
              </span>
              <RefreshIcon width={24} height={24} color="#2A2A2A" />
            </button>

            {/* Försäkringar */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Försäkringar
            </h3>
            <Link
              to="/properties/insurances"
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Hemförsäkring</span>
              <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
            </Link>

            {/* Elförbrukning */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Elförbrukning
            </h3>
            <div style={{ padding: '16px', background: '#F5F5F5', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.6, margin: 0 }}>
                Elförbrukning-funktionalitet kommer snart
              </p>
            </div>

            <Link
              to="/properties/inventories"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                textDecoration: 'none',
                color: '#2A2A2A',
                borderBottom: '1px solid #EEEEEE',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Visa alla inventarier</span>
              <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
            </Link>


            <div
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginTop: '20px',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Elavtal (Elon)</span>
              <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
            </div>

            {/* Lån */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Lån
            </h3>
            <div style={{ padding: '16px', background: '#F5F5F5', borderRadius: '8px', marginBottom: '12px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.6, margin: 0, textAlign: 'center' }}>
                Lån-funktionalitet kommer snart
              </p>
            </div>
            <div
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginTop: '12px',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Jämför bostadslån</span>
              <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
            </div>

            {/* Dokument */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Dokument
            </h3>
            {displayProperty?.documents && displayProperty.documents.length > 0 ? (
              displayProperty.documents.map((doc: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < displayProperty.documents!.length - 1 ? '1px solid #EEEEEE' : 'none',
                    marginBottom: index < displayProperty.documents!.length - 1 ? '8px' : '20px'
                  }}
                >
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
                    {doc.name || doc.type || 'Dokument'}
                  </span>
                  <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', background: '#F5F5F5', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.6, margin: 0 }}>
                  Inga dokument ännu
                </p>
              </div>
            )}
            <button
              onClick={() => displayProperty && handleEditClick(displayProperty)}
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginTop: displayProperty?.documents && displayProperty.documents.length > 0 ? '12px' : '0',
                marginBottom: '20px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Lägg till nytt dokument</span>
              <PlusIcon width={24} height={24} color="#1A7498" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Property Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Redigera hem"
      >
        <FormField
          label="Adress *"
          value={formData.address}
          onChange={(value) => setFormData({ ...formData, address: value })}
          placeholder="T.ex. Storgatan 1"
          required
        />
        <FormField
          label="Stad"
          value={formData.city}
          onChange={(value) => setFormData({ ...formData, city: value })}
          placeholder="T.ex. Stockholm"
        />
        <FormField
          label="Postnummer"
          value={formData.postal_code}
          onChange={(value) => setFormData({ ...formData, postal_code: value })}
          placeholder="T.ex. 123 45"
        />
        <FormField
          label="Bostadstyp"
          value={formData.property_type}
          onChange={(value) => setFormData({ ...formData, property_type: value })}
          placeholder="T.ex. Villa, Lägenhet, Radhus"
        />
        <FormField
          label="Storlek (kvm)"
          value={formData.size_sqm}
          onChange={(value) => setFormData({ ...formData, size_sqm: value })}
          type="number"
          placeholder="T.ex. 75"
        />
        <FormField
          label="Antal rum"
          value={formData.rooms}
          onChange={(value) => setFormData({ ...formData, rooms: value })}
          type="number"
          placeholder="T.ex. 3"
        />
        <FormField
          label="Våningsplan"
          value={formData.floor}
          onChange={(value) => setFormData({ ...formData, floor: value })}
          placeholder="T.ex. 3"
        />
        <FormField
          label="Köpeskilling (kr)"
          value={formData.purchase_price}
          onChange={(value) => setFormData({ ...formData, purchase_price: value })}
          type="number"
          placeholder="T.ex. 3000000"
        />
        <FormField
          label="Köpt datum"
          value={formData.purchase_date}
          onChange={(value) => setFormData({ ...formData, purchase_date: value })}
          type="date"
        />
        <FormField
          label="Nuvarande värde (kr)"
          value={formData.current_value}
          onChange={(value) => setFormData({ ...formData, current_value: value })}
          type="number"
          placeholder="T.ex. 3500000"
        />
        <FormField
          label="Värderingsdatum"
          value={formData.valuation_date}
          onChange={(value) => setFormData({ ...formData, valuation_date: value })}
          type="date"
        />
        <FormField
          label="Värderingskälla"
          value={formData.valuation_source}
          onChange={(value) => setFormData({ ...formData, valuation_source: value })}
          placeholder="T.ex. Hemnet, Mäklare"
        />
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => selectedProperty && handleDelete(selectedProperty)}
            style={{
              background: 'transparent',
              border: '1px solid #d32f2f',
              color: '#d32f2f',
              padding: '10px 16px',
              borderRadius: '8px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Ta bort bostad
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Avbryt
            </Button>
            <Button
              onClick={handleSubmit}
            >
              Spara
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PropertyHome



