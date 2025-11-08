function Notifications() {
  const notifications = [
    { 
      title: 'Nytt erbjudande', 
      description: 'Du har ett nytt erbjudande på hemförsäkring',
      time: '2 min sedan',
      read: false,
      icon: '🎁'
    },
    { 
      title: 'Faktura mottagen', 
      description: 'Ny faktura från Telia',
      time: '1 timme sedan',
      read: false,
      icon: '📄'
    },
    { 
      title: 'Betalning bekräftad', 
      description: 'Din betalning har gått igenom',
      time: '2 timmar sedan',
      read: true,
      icon: '✅'
    },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-text">Notiser</h1>
        
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div 
              key={index} 
              className={`bg-white border rounded-lg p-4 shadow-card ${
                notification.read ? 'border-gray-200' : 'border-primary border-l-4'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{notification.icon}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center flex-1">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      )}
                      <h2 className={`font-semibold text-text ${!notification.read ? 'font-bold' : ''}`}>
                        {notification.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 empty-state mx-auto">
          <span className="text-5xl block mb-2">🔔</span>
          <p className="text-gray-600 body">Inga fler notiser</p>
        </div>
      </div>
    </div>
  )
}

export default Notifications

