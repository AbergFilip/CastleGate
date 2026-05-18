import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOffers, updateOffer, deleteOffer, type Offer } from '../lib/offers'

function Offers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOffers()
      setOffers(data)
    } catch (err) {
      console.error('Error loading offers:', err)
      setError(err.message || 'Kunde inte ladda erbjudanden')
    } finally {
      setLoading(false)
    }
  }

  const handleViewOffer = async (id: string) => {
    try {
      await updateOffer(id, { viewed: true })
      setOffers(prev => prev.map(o => o.id === id ? { ...o, viewed: true } : o))
    } catch (err) {
      console.error('Error updating offer:', err)
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">Mina erbjudanden</h1>
          <Link to="/marketplace" className="text-primary text-sm font-semibold">
            Marknadsplats
          </Link>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar erbjudanden...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-text mb-1">{offer.title}</h2>
                      {offer.description && (
                        <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                      )}
                      {offer.price && (
                        <p className="text-sm font-semibold text-primary">{offer.price}</p>
                      )}
                    </div>
                    {offer.badge && (
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded ml-2">
                        {offer.badge}
                      </span>
                    )}
                  </div>
                  <button 
                    className="w-full bg-primary text-white rounded-lg py-2 font-semibold mt-3"
                    onClick={() => {
                      handleViewOffer(offer.id)
                      if (offer.link_url) {
                        window.open(offer.link_url, '_blank')
                      }
                    }}
                  >
                    Se erbjudande
                  </button>
                </div>
              ))}
            </div>

            {offers.length === 0 && (
              <div className="mt-6 empty-state mx-auto">
                <span className="text-5xl block mb-2">📭</span>
                <p className="text-gray-600 body">Inga fler erbjudanden för tillfället</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Offers
