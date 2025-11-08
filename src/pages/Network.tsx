function Network() {
  const connections = [
    { 
      name: 'Anna Andersson', 
      relation: 'Vän',
      status: 'Aktiv',
      avatar: '👤'
    },
    { 
      name: 'Erik Svensson', 
      relation: 'Familj',
      status: 'Aktiv',
      avatar: '👤'
    },
    { 
      name: 'Maria Johansson', 
      relation: 'Kollega',
      status: 'Aktiv',
      avatar: '👤'
    },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-text">Nätverk</h1>
        
        <div className="space-y-4">
          {connections.map((connection, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">{connection.avatar}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-text mb-1">{connection.name}</h2>
                  <p className="text-sm text-gray-600">{connection.relation}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {connection.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full bg-primary text-white rounded-lg py-3 font-semibold">
          Lägg till relation
        </button>
      </div>
    </div>
  )
}

export default Network

