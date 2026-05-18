import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRequests, createRequest, deleteRequest, type Request } from '../lib/requests'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

function Requests() {
  const { showToast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  })

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRequests()
      setRequests(data)
    } catch (err) {
      console.error('Error loading requests:', err)
      setError(err.message || 'Kunde inte ladda förfrågningar')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      showToast('Titel krävs', 'error')
      return
    }

    try {
      await createRequest(formData)
      setShowCreateModal(false)
      setFormData({ title: '', description: '', category: '' })
      loadRequests()
    } catch (err) {
      showToast('Kunde inte skapa förfrågan: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna förfrågan?')) return

    try {
      await deleteRequest(id)
      loadRequests()
    } catch (err) {
      showToast('Kunde inte ta bort förfrågan: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE')
  }

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '120px' }}>
      <div className="flex flex-col px-4 py-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="text-2xl font-bold text-text">Förfrågningar</h1>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar förfrågningar...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-text mb-1">{request.title}</h2>
                    {request.description && (
                      <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        request.status === 'Aktiv' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {request.status}
                      </span>
                      <span className="text-gray-600">{request.responses_count} svar</span>
                      <span className="text-gray-500">{formatDate(request.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(request.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: '#d32f2f',
                      fontSize: '18px',
                    }}
                    aria-label="Ta bort"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          className="mt-6 w-full bg-primary text-white rounded-lg py-3 font-semibold"
          onClick={() => setShowCreateModal(true)}
        >
          Skapa ny förfrågan
        </button>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setFormData({ title: '', description: '', category: '' })
        }}
        title="Skapa ny förfrågan"
      >
        <FormField
          label="Titel"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
          placeholder="T.ex. Söker hemförsäkring"
          required
        />
        <FormField
          label="Beskrivning"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder="Beskriv vad du söker efter"
        />
        <FormField
          label="Kategori"
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
          placeholder="T.ex. Försäkring, Elavtal, Bolån"
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateModal(false)
              setFormData({ title: '', description: '', category: '' })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!formData.title.trim()}
          >
            Skapa
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Requests
