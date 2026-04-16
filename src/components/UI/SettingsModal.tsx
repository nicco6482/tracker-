import { useState } from 'react'
import { Settings, X, Eye, EyeOff, Trash2 } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
  onApiKeyChange: (newKey: string) => void
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
}: SettingsModalProps) {
  const [inputKey, setInputKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (inputKey.trim()) {
      onApiKeyChange(inputKey)
      localStorage.setItem('groq-api-key', inputKey)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClear = () => {
    if (window.confirm('¿Limpiar TODOS los datos guardados (gastos, cartera, etc)?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleReset = () => {
    if (window.confirm('¿Reestablecer la API Key a la anterior?')) {
      setInputKey(apiKey)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Settings size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold">Ajustes</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* API Key Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔑 API Key de Groq
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Obtén una gratis en{' '}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                console.groq.com/keys
              </a>
            </p>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Status */}
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
              <p className="text-green-700 text-sm font-semibold">✓ API Key guardada correctamente</p>
            </div>
          )}

          {inputKey !== apiKey && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-blue-700 text-xs">
                ℹ️ Tienes cambios sin guardar
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={handleSave}
            disabled={!inputKey.trim() || inputKey === apiKey}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded transition-colors"
          >
            💾 Guardar API Key
          </button>

          {inputKey !== apiKey && (
            <button
              onClick={handleReset}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded transition-colors"
            >
              ↶ Descartar cambios
            </button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">⚠️ Zona de Peligro</h3>
          <button
            onClick={handleClear}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2 rounded border border-red-200 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Limpiar todos los datos
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Esto eliminará gastos, cartera, billetera y todos los datos guardados. No se puede deshacer.
          </p>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
          <p>
            <strong>📱 Datos locales:</strong> Todo se guarda en tu dispositivo, nunca en servidores.
          </p>
        </div>
      </div>
    </div>
  )
}
