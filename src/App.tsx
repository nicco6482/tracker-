import { useState, useEffect } from 'react'
import { useExpenses } from './hooks/useExpenses'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { Expense, View, CurrencyCode } from './types'
import Navbar from './components/Layout/Navbar'
import Dashboard from './components/Dashboard/Dashboard'
import ExpenseList from './components/Expenses/ExpenseList'
import ExpenseModal from './components/UI/ExpenseModal'
import DeleteConfirm from './components/UI/DeleteConfirm'
import ChatBot from './components/ChatBot/ChatBot'
import OfflineIndicator from './components/OfflineIndicator'
import SettingsModal from './components/UI/SettingsModal'

export default function App() {
  const { expenses, addExpense, editExpense, deleteExpense } = useExpenses()
  const isOnline = useOnlineStatus()
  const [view, setView] = useState<View>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>('EUR')
  const [apiKey, setApiKey] = useState<string>('')
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const savedApiKey = localStorage.getItem('groq-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    } else {
      setShowApiKeyPrompt(true)
    }
  }, [])

  const openAddModal = () => {
    setEditingExpense(null)
    setModalOpen(true)
  }

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingExpense(null)
  }

  const handleModalSubmit = (data: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      editExpense(editingExpense.id, data)
    } else {
      addExpense(data)
    }
    closeModal()
  }

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteExpense(deletingId)
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <OfflineIndicator />
      <Navbar
        view={view}
        setView={setView}
        currency={currency}
        setCurrency={setCurrency}
        onAddExpense={openAddModal}
        onSettings={() => setShowSettings(true)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' ? (
          <Dashboard
            expenses={expenses}
            currency={currency}
            onAddExpense={openAddModal}
          />
        ) : (
          <ExpenseList
            expenses={expenses}
            currency={currency}
            onEdit={openEditModal}
            onDelete={(id) => setDeletingId(id)}
            onAdd={openAddModal}
          />
        )}
      </main>

      {modalOpen && (
        <ExpenseModal
          expense={editingExpense}
          defaultCurrency={currency}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}

      {deletingId && (
        <DeleteConfirm
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingId(null)}
        />
      )}

      {showApiKeyPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Configurar API de Groq (Gratis)</h2>
            <p className="text-gray-600 mb-4">
              Para usar el chatbot necesitas una clave API de Groq. 
              <strong> ¡Es gratis!</strong>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {' '}Obtén una aquí
              </a>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-900">
              ✓ Totalmente gratis<br/>
              ✓ Incluye LLaMA 3.3 70B (muy potente)<br/>
              ✓ 50 solicitudes por minuto
            </div>
            <input
              type="password"
              placeholder="gsk_..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setApiKey(e.target.value)}
              value={apiKey}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && apiKey.trim()) {
                  localStorage.setItem('groq-api-key', apiKey)
                  setShowApiKeyPrompt(false)
                }
              }}
            />
            <button
              onClick={() => {
                if (apiKey.trim()) {
                  localStorage.setItem('groq-api-key', apiKey)
                  setShowApiKeyPrompt(false)
                }
              }}
              disabled={!apiKey.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={() => setShowApiKeyPrompt(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded mt-2 transition-colors"
            >
              Usar App sin Chat
            </button>
          </div>
        </div>
      )}

      {apiKey && isOnline && (
        <ChatBot
          apiKey={apiKey}
          onExpenseCreated={(expenseData) => {
            addExpense(expenseData)
          }}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />
    </div>
  )
}
