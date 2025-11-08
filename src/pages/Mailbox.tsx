import { Link } from 'react-router-dom'

function Mailbox() {
  const messages = [
    { 
      title: 'Faktura från Telia', 
      date: '2024-11-01',
      read: false,
      type: 'Faktura',
      icon: '📄'
    },
    { 
      title: 'Betalningsbekräftelse', 
      date: '2024-10-30',
      read: true,
      type: 'Bekräftelse',
      icon: '✅'
    },
    { 
      title: 'Nytt erbjudande', 
      date: '2024-10-28',
      read: true,
      type: 'Erbjudande',
      icon: '🎁'
    },
  ]

  const inboxes = [
    { name: 'Privat', count: 3 },
    { name: 'Arbete', count: 0 },
    { name: 'Övrigt', count: 1 },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">Min brevlåda</h1>
          <button className="text-primary text-sm font-semibold">Hantera inkorgar</button>
        </div>

        {/* Inboxes */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {inboxes.map((inbox, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  index === 0 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {inbox.name} {inbox.count > 0 && `(${inbox.count})`}
              </button>
            ))}
          </div>
        </div>
        
        {/* Messages */}
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`bg-white border rounded-lg p-4 shadow-card ${
                message.read ? 'border-gray-200' : 'border-primary border-l-4'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{message.icon}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center flex-1">
                      {!message.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      )}
                      <h2 className={`font-semibold text-text ${!message.read ? 'font-bold' : ''}`}>
                        {message.title}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {message.type}
                    </span>
                    <span className="text-sm text-gray-500">{message.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-6 space-y-3">
          <button className="w-full bg-primary text-white rounded-lg py-3 font-semibold">
            Nytt meddelande
          </button>
          <Link 
            to="/settings"
            className="block w-full bg-white border border-gray-200 rounded-lg py-3 font-semibold text-center text-text shadow-card"
          >
            Inställningar
          </Link>
        </div>

        {/* Empty state (if no messages) */}
        {messages.length === 0 && (
          <div className="mt-6 bg-gray-100 rounded-lg p-8 text-center">
            <span className="text-5xl block mb-2">✉️</span>
            <p className="text-gray-600">Inga fler meddelanden</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Mailbox

