import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { unlinkBankID } from '../lib/bankid'

function Settings() {
  const { user, updatePassword, bankIDStatus, refreshBankIDStatus } = useAuth()
  const [showSecurity, setShowSecurity] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const settings = [
    { 
      emoji: '🔔', 
      title: 'Notifikationer', 
      description: 'Hantera notifikationer',
      onClick: () => {} // TODO: Implementera notifikationsinställningar
    },
    { 
      emoji: '🔒', 
      title: 'Säkerhet', 
      description: 'Lösenord och säkerhet',
      onClick: () => setShowSecurity(!showSecurity)
    },
    { 
      emoji: 'ℹ️', 
      title: 'Om appen', 
      description: 'Version och information',
      onClick: () => {} // TODO: Implementera om-appen
    },
  ]

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!newPassword || !confirmPassword) {
      setError('Vänligen fyll i alla fält')
      return
    }

    if (newPassword.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken långt')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    setLoading(true)

    const { error } = await updatePassword(newPassword)

    if (error) {
      setError(error.message || 'Ett fel uppstod. Försök igen.')
      setLoading(false)
    } else {
      setSuccess('Lösenordet har uppdaterats framgångsrikt!')
      setNewPassword('')
      setConfirmPassword('')
      setLoading(false)
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    }
  }

  const handleUnlinkBankID = async () => {
    if (!window.confirm('Är du säker på att du vill ta bort BankID-kopplingen?')) {
      return
    }

    setUnlinking(true)
    setError(null)

    try {
      await unlinkBankID()
      await refreshBankIDStatus()
      setSuccess('BankID-kopplingen har tagits bort')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Kunde inte ta bort BankID-kopplingen')
    } finally {
      setUnlinking(false)
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-text">Inställningar</h1>
        
        <div className="space-y-4">
          {settings.map((setting, index) => {
            return (
              <div key={index}>
                <div 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-card cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={setting.onClick}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{setting.emoji}</span>
                    <div className="flex-1">
                      <h2 className="font-semibold text-text">{setting.title}</h2>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <span className="text-gray-400">{showSecurity && setting.title === 'Säkerhet' ? '▼' : '›'}</span>
                  </div>
                </div>

                {showSecurity && setting.title === 'Säkerhet' && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-lg p-6 shadow-card">
                    <h3 className="text-lg font-semibold text-text mb-4">Ändra lösenord</h3>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {success}
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-text mb-2">
                          Nytt lösenord
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minst 8 tecken"
                          required
                          minLength={8}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Använd minst 8 tecken med bokstäver och siffror
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-text mb-2">
                          Bekräfta nytt lösenord
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Upprepa lösenordet"
                          required
                          minLength={8}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full h-12 rounded-lg font-semibold text-white transition-opacity ${
                            loading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90'
                          }`}
                        >
                          {loading ? 'Uppdaterar...' : 'Uppdatera lösenord'}
                        </button>
                      </div>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-text">E-postadress</p>
                            <p className="text-sm text-gray-600">{user?.email || 'Ingen e-post'}</p>
                          </div>
                          <span className="text-xs text-gray-400">Verifierad</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-text">BankID</p>
                            <p className="text-sm text-gray-600">
                              {bankIDStatus?.linked
                                ? bankIDStatus.personalNumber
                                  ? `Kopplad (${bankIDStatus.personalNumber.substring(0, 8)}XXXX)`
                                  : 'Kopplad'
                                : 'Inte kopplad'}
                            </p>
                          </div>
                          {bankIDStatus?.linked ? (
                            <button
                              type="button"
                              onClick={handleUnlinkBankID}
                              disabled={unlinking}
                              className="text-xs text-red-600 cursor-pointer hover:underline disabled:opacity-50"
                            >
                              {unlinking ? 'Tar bort...' : 'Ta bort'}
                            </button>
                          ) : (
                            <Link
                              to="/bankid-auth"
                              className="text-xs text-blue-600 cursor-pointer hover:underline"
                            >
                              Koppla
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

