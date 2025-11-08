import { Link } from 'react-router-dom'

function Offers() {
  const offers = [
    { 
      title: 'Hemförsäkring', 
      description: 'Få 10% rabatt på din hemförsäkring med vårt exklusiva erbjudande',
      badge: 'Rabatt',
      price: 'Från 299 kr/mån',
      type: 'Försäkring'
    },
    { 
      title: 'Elavtal', 
      description: 'Spara på ditt elavtal med vårt exklusiva erbjudande',
      badge: 'Nytt',
      price: 'Från 0.89 kr/kWh',
      type: 'Elavtal'
    },
    { 
      title: 'Bolån', 
      description: 'Ansök om nytt bolån med förmånlig ränta',
      badge: 'Populärt',
      price: 'Från 4.2% ränta',
      type: 'Bolån'
    },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">Mina erbjudanden</h1>
          <Link to="/marketplace" className="text-primary text-sm font-semibold">
            Marknadsplats
          </Link>
        </div>
        
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-text mb-1">{offer.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                  <p className="text-sm font-semibold text-primary">{offer.price}</p>
                </div>
                <span className="bg-primary text-white text-xs px-2 py-1 rounded ml-2">
                  {offer.badge}
                </span>
              </div>
              <button className="w-full bg-primary text-white rounded-lg py-2 font-semibold mt-3">
                Se erbjudande
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 empty-state mx-auto">
          <span className="text-5xl block mb-2">📭</span>
          <p className="text-gray-600 body">Inga fler erbjudanden för tillfället</p>
        </div>
      </div>
    </div>
  )
}

export default Offers

