function Requests() {
  const requests = [
    { 
      title: 'Söker hemförsäkring', 
      description: 'Behöver försäkring för min lägenhet',
      status: 'Aktiv',
      responses: 3,
      date: '2024-11-01'
    },
    { 
      title: 'Behöver elavtal', 
      description: 'Söker bästa priset för el',
      status: 'Avslutad',
      responses: 5,
      date: '2024-10-25'
    },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-text">Förfrågningar</h1>
        
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-text mb-1">{request.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded ${
                      request.status === 'Aktiv' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {request.status}
                    </span>
                    <span className="text-gray-600">{request.responses} svar</span>
                    <span className="text-gray-500">{request.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full bg-primary text-white rounded-lg py-3 font-semibold">
          Skapa ny förfrågan
        </button>
      </div>
    </div>
  )
}

export default Requests

