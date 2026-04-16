import { View, CurrencyCode, CURRENCIES } from '../../types'
import { usePWAInstall } from '../../hooks/usePWAInstall'
import { LayoutDashboard, List, Plus, Wallet, Download, Settings } from 'lucide-react'

interface NavbarProps {
  view: View
  setView: (view: View) => void
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  onAddExpense: () => void
  onSettings: () => void
}

export default function Navbar({ view, setView, currency, setCurrency, onAddExpense, onSettings }: NavbarProps) {
  const { canInstall, install } = usePWAInstall()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 py-3 gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
              <Wallet className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-bold text-slate-900 text-[15px]">Mis Gastos</p>
              <p className="text-[11px] text-slate-400 font-medium">tracker personal</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-xl p-1">
            {([
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'expenses',  label: 'Gastos',    icon: List },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  view === id
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as CurrencyCode)}
              className="text-sm border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer font-medium"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>

            {canInstall && (
              <button
                onClick={install}
                title="Instalar app"
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:block">Instalar</span>
              </button>
            )}

            <button
              onClick={onSettings}
              title="Ajustes"
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onAddExpense}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-violet-200"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:block">Añadir</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}
