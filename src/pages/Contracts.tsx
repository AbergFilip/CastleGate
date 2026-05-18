import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocuments, createDocument, deleteDocument } from '../lib/documents'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

function Contracts() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [documents, setDocuments] = useState<Record<string, any[]>>({
    work_agreements: [],
    licenses: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentSubcategory, setCurrentSubcategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '' })

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const allDocuments = await getDocuments({ category: 'contracts' })
      
      // Gruppera dokument efter subcategory
      const grouped: Record<string, any[]> = {
        work_agreements: [],
        licenses: [],
      }

      allDocuments.forEach((doc: any) => {
        if (doc.subcategory && grouped[doc.subcategory]) {
          grouped[doc.subcategory].push(doc)
        }
      })

      setDocuments(grouped)
    } catch (err) {
      console.error('Error loading documents:', err)
      setError(err.message || 'Kunde inte ladda dokument')
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

  const handleDocumentClick = (document: any) => {
    if (document.file_url) {
      window.open(document.file_url, '_blank')
    }
  }

  const handleAddDocument = (subcategory: string) => {
    setCurrentSubcategory(subcategory)
    setFormData({ title: '', description: '' })
    setShowAddModal(true)
  }

  const handleSubmitDocument = async () => {
    if (!formData.title.trim() || !currentSubcategory) return

    try {
      await createDocument({
        category: 'contracts',
        subcategory: currentSubcategory,
        title: formData.title,
        description: formData.description || undefined,
      })
      loadDocuments()
      setShowAddModal(false)
      setFormData({ title: '', description: '' })
    } catch (err) {
      showToast('Kunde inte skapa dokument: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleDeleteDocument = async (documentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort detta dokument?')) return

    try {
      await deleteDocument(documentId)
      loadDocuments()
    } catch (err) {
      showToast('Kunde inte ta bort dokument: ' + (err.message || 'Okänt fel'), 'error')
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
            <filter id="filter0_d_contracts" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_contracts" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
            <linearGradient id="paint1_linear_contracts" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_contracts)" />
          <g filter="url(#filter0_d_contracts)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_contracts)" />
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
            Avtal och licenser
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
            Laddar dokument...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <>
            <Section
              title="Arbete och avtal"
              items={documents.work_agreements}
              onItemClick={handleDocumentClick}
              onItemDelete={handleDeleteDocument}
              onAdd={() => handleAddDocument('work_agreements')}
            />
            <Section
              title="Licenser"
              items={documents.licenses}
              onItemClick={handleDocumentClick}
              onItemDelete={handleDeleteDocument}
              onAdd={() => handleAddDocument('licenses')}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormData({ title: '', description: '' })
        }}
        title={`Lägg till ${currentSubcategory === 'work_agreements' ? 'arbetsavtal' : 'licens'}`}
      >
        <FormField
          label="Titel"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
          placeholder="Ange titel"
          required
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
              setFormData({ title: '', description: '' })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitDocument}
            disabled={!formData.title.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function Section({
  title,
  items,
  onItemClick,
  onItemDelete,
  onAdd,
}: {
  title: string
  items: any[]
  onItemClick?: (item: any) => void
  onItemDelete?: (id: string, e: React.MouseEvent) => void
  onAdd?: () => void
}) {
  return (
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
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
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
              cursor: onItemClick ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px', color: '#2A2A2A' }}>
              {item.title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {onItemDelete && (
                <button
                  onClick={(e) => onItemDelete(item.id, e)}
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
              )}
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ))}
        {onAdd && (
          <div
            onClick={onAdd}
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
              Lägg till nytt dokument
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </section>
  )
}

export default Contracts
