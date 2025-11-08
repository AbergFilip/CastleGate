function Settings() {
  const settings = [
    { emoji: '🔔', title: 'Notifikationer', description: 'Hantera notifikationer' },
    { emoji: '🔒', title: 'Säkerhet', description: 'Lösenord och säkerhet' },
    { emoji: 'ℹ️', title: 'Om appen', description: 'Version och information' },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-text">Inställningar</h1>
        
        <div className="space-y-4">
          {settings.map((setting, index) => {
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{setting.emoji}</span>
                  <div className="flex-1">
                    <h2 className="font-semibold text-text">{setting.title}</h2>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <span className="text-gray-400">›</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Castlegate B2C v1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Settings

