import { useState } from 'react'
import { Wallet, Plus, X } from 'lucide-react'
import { useWallet } from '../../hooks/useWallet'
import { Expense } from '../../types'
import { getCurrencyInfo } from '../../utils/currency'

interface WalletWidgetProps {
  expenses: Expense[]
  currency: string
  onAddBalance?: (amount: number) => void
}

export default function WalletWidget({
  expenses,
  currency,
  onAddBalance,
}: WalletWidgetProps) {
  const { wallet, addBalance, setBalance } = useWallet()
  const [showAddModal, setShowAddModal] = useState(false)
  const [inputAmount, setInputAmount] = useState('')

  // Total gastos
  const totalExpenses = expenses
    .filter(e => e.currency === currency)
    .reduce((sum, e) => sum + e.amount, 0)

  const currencyInfo = getCurrencyInfo(currency as any)
  const currencySymbol = currencyInfo.symbol
  const displayBalance = wallet.balance

  const handleAddBalance = () => {
    const amount = parseFloat(inputAmount)
    if (amount > 0) {
      addBalance(amount)
      onAddBalance?.(amount)
      setInputAmount('')
      setShowAddModal(false)
    }
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Wallet size={24} />
            </div>
            <h3 className="text-lg font-semibold">Mi Cartera</h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-400 p-2 rounded-lg transition-colors"
            title="Agregar dinero"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Saldo disponible */}
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">
              Saldo Disponible
            </p>
            <p className="text-4xl font-bold">
              {currencySymbol} {displayBalance.toFixed(2)}
            </p>
          </div>

          {/* Gastos */}
          <div className="bg-blue-500 bg-opacity-40 rounded-lg p-4">
            <p className="text-blue-100 text-sm font-medium mb-1">
              Total Gastado
            </p>
            <p className="text-2xl font-bold">
              {currencySymbol} {totalExpenses.toFixed(2)}
            </p>
          </div>

          {/* Total (saldo + gastos) */}
          <div className="border-t border-blue-400 pt-4">
            <p className="text-blue-100 text-sm font-medium mb-1">
              Dinero Total
            </p>
            <p className="text-2xl font-bold">
              {currencySymbol} {(displayBalance + totalExpenses).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-blue-100 mb-2">
            <span>Gastado</span>
            <span>Disponible</span>
          </div>
          <div className="w-full bg-blue-500 rounded-full h-2 overflow-hidden">
            {displayBalance + totalExpenses > 0 && (
              <div
                className="bg-red-400 h-full transition-all duration-300"
                style={{
                  width: `${(totalExpenses / (displayBalance + totalExpenses)) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar dinero */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Agregar Dinero</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad ({currency})
              </label>
              <input
                type="number"
                value={inputAmount}
                onChange={e => setInputAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyPress={e => e.key === 'Enter' && handleAddBalance()}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddBalance}
                disabled={!inputAmount || parseFloat(inputAmount) <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded transition-colors"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
