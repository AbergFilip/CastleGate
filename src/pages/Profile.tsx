import { Link } from 'react-router-dom'

function Profile() {
  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mr-4">
            <span className="text-4xl text-white">👤</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Min profil</h1>
            <p className="text-gray-600">filip_aberg</p>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            to="/documents"
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-card block"
          >
            <h2 className="font-semibold mb-2 text-text">Dokument i livet</h2>
            <p className="text-sm text-gray-600">Hantera dina dokument</p>
          </Link>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
            <h2 className="font-semibold mb-2 text-text">Personlig information</h2>
            <p className="text-sm text-gray-600">Hantera dina personuppgifter</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
            <h2 className="font-semibold mb-2 text-text">Säkerhet</h2>
            <p className="text-sm text-gray-600">Lösenord och tvåfaktorsautentisering</p>
          </div>

          <Link 
            to="/properties"
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-card block"
          >
            <h2 className="font-semibold mb-2 text-text">Mina egendomar</h2>
            <p className="text-sm text-gray-600">Fordon, fastigheter och mer</p>
          </Link>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
            <h2 className="font-semibold mb-2 text-text">Relationer</h2>
            <p className="text-sm text-gray-600">Hantera ditt nätverk</p>
          </div>

          <Link 
            to="/settings" 
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-card"
          >
            <div className="flex items-center">
              <span className="text-xl mr-3">⚙️</span>
              <span className="font-semibold text-text">Inställningar</span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile

