import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIceContacts, createIceContact, updateIceContact, deleteIceContact } from '../lib/documents'
import { Modal, FormField, FormTextarea, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

function InCaseOfEmergency() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getIceContacts()
      setContacts(data)
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError(err instanceof Error ? err.message : 'Kunde inte ladda kontakter')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/documents')
    }
  }

  const handleEdit = (contact: any) => {
    setEditingId(contact.id)
    setFormData({
      name: contact.name || '',
      relation: contact.relation || '',
      phone: contact.phone || '',
      email: contact.email || '',
      address: contact.address || '',
      notes: contact.notes || '',
    })
    setShowAddModal(true)
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      name: '',
      relation: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return

    try {
      if (editingId) {
        await updateIceContact(editingId, {
          name: formData.name,
          relation: formData.relation || undefined,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          address: formData.address || undefined,
          notes: formData.notes || undefined,
        })
      } else {
        await createIceContact({
          name: formData.name,
          relation: formData.relation || undefined,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          address: formData.address || undefined,
          notes: formData.notes || undefined,
        })
      }
      loadContacts()
      setShowAddModal(false)
      setEditingId(null)
      setFormData({
        name: '',
        relation: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      })
    } catch (err) {
      showToast(`Kunde inte ${editingId ? 'uppdatera' : 'skapa'} kontakt: ` + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (contactId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna kontakt?')) return

    try {
      await deleteIceContact(contactId)
      loadContacts()
    } catch (err) {
      showToast('Kunde inte ta bort kontakt: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '200px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_ice" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_ice" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
            <linearGradient id="paint1_linear_ice" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_ice)" />
          <g filter="url(#filter0_d_ice)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_ice)" />
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
            In Case of Emergency
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '208px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar kontakter...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3
              style={{
                margin: 0,
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: '#2A2A2A',
              }}
            >
              Ansvarig person
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contacts.map((contact) => (
                <div
                  key={contact.id}
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
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>
                      {contact.name}
                    </span>
                    {contact.relation && (
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.75 }}>
                        {contact.relation}
                      </span>
                    )}
                    {contact.phone && (
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>
                        📞 {contact.phone}
                      </span>
                    )}
                    {contact.email && (
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>
                        ✉️ {contact.email}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => handleEdit(contact)}
                      disabled={editingId === contact.id}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '4px',
                        cursor: editingId === contact.id ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      aria-label="Redigera"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M11.1083 3.44167L3.33333 11.2167V13.75H5.86667L13.6417 5.97501L11.1083 3.44167Z"
                          stroke="#1C3C9B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.525 5.05834L12.45 3"
                          stroke="#1C3C9B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
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
                      <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              ))}
              <div
                onClick={handleAdd}
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
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px', color: '#1C3C9B' }}>
                  Lägg till en person
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1V11M1 6H11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </section>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingId(null)
          setFormData({
            name: '',
            relation: '',
            phone: '',
            email: '',
            address: '',
            notes: '',
          })
        }}
        title={editingId ? 'Redigera kontakt' : 'Lägg till kontakt'}
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
          placeholder="t.ex. Fru, Make, Barn"
        />
        <FormField
          label="Telefon"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          placeholder="Ange telefonnummer"
          type="tel"
        />
        <FormField
          label="E-post"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="Ange e-postadress"
          type="email"
        />
        <FormField
          label="Adress"
          value={formData.address}
          onChange={(value) => setFormData({ ...formData, address: value })}
          placeholder="Ange adress"
        />
        <FormTextarea
          label="Anteckningar"
          value={formData.notes}
          onChange={(value) => setFormData({ ...formData, notes: value })}
          placeholder="Lägg till anteckningar (valfritt)"
          rows={3}
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false)
              setEditingId(null)
              setFormData({
                name: '',
                relation: '',
                phone: '',
                email: '',
                address: '',
                notes: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
          >
            {editingId ? 'Uppdatera' : 'Spara'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default InCaseOfEmergency
