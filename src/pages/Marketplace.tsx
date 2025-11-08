import { Link } from 'react-router-dom'

function Marketplace() {
  const categories = [
    { title: 'Alla', active: true },
    { title: 'Försäkringar', active: false },
    { title: 'Elavtal', active: false },
    { title: 'Bolån', active: false },
    { title: 'Tjänster', active: false },
  ]

  const offers = [
    { 
      title: 'Hemförsäkring', 
      description: 'Få 10% rabatt på din hemförsäkring med vårt exklusiva erbjudande',
      badge: 'Rabatt',
      price: 'Från 299 kr/mån',
      category: 'Försäkringar'
    },
    { 
      title: 'Elavtal', 
      description: 'Spara på ditt elavtal med vårt exklusiva erbjudande',
      badge: 'Nytt',
      price: 'Från 0.89 kr/kWh',
      category: 'Elavtal'
    },
    { 
      title: 'Bolån', 
      description: 'Ansök om nytt bolån med förmånlig ränta',
      badge: 'Populärt',
      price: 'Från 4.2% ränta',
      category: 'Bolån'
    },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">Marknadsplats</h1>
          <button className="text-primary text-sm font-semibold">Filter</button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  category.active 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Offers */}
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-text mb-1">{offer.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
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

        {/* Requests section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Förfrågningar</h2>
            <Link to="/requests" className="text-primary text-sm font-semibold">
              Se alla
            </Link>
          </div>
          <Link 
            to="/create-request"
            className="block bg-white border border-gray-200 rounded-lg p-4 shadow-card text-center"
          >
            <span className="text-2xl block mb-2">➕</span>
            <span className="font-semibold text-text">Skapa förfrågan</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Marketplace

