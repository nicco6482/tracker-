import { Filters, CATEGORIES, PAYMENT_METHODS } from '../../types'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function FilterBar({ filters, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value })

  const hasActive = filters.search || filters.category || filters.paymentMethod || filters.dateFrom || filters.dateTo
  const activeCount = [filters.category, filters.paymentMethod, filters.dateFrom, filters.dateTo].filter(Boolean).length

  const clear = () => onChange({ search: '', category: '', paymentMethod: '', dateFrom: '', dateTo: '' })

  const inputBase = 'w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 bg-white placeholder-slate-400 transition-shadow'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Main search row */}
      <div className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar gasto..."
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className={`${inputBase} pl-10`}
          />
        </div>

        <button
          onClick={() => setExpanded(v => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
            expanded || activeCount > 0
              ? 'bg-violet-50 border-violet-200 text-violet-700'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:block">Filtros</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {hasActive && (
          <button
            onClick={clear}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium border border-red-100"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:block">Limpiar</span>
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="border-t border-slate-100 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Categoría</label>
            <select
              value={filters.category}
              onChange={e => set('category', e.target.value)}
              className={inputBase}
            >
              <option value="">Todas</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Método de pago</label>
            <select
              value={filters.paymentMethod}
              onChange={e => set('paymentMethod', e.target.value)}
              className={inputBase}
            >
              <option value="">Todos</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Desde</label>
            <input type="date" value={filters.dateFrom} onChange={e => set('dateFrom', e.target.value)} className={inputBase} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Hasta</label>
            <input type="date" value={filters.dateTo} onChange={e => set('dateTo', e.target.value)} className={inputBase} />
          </div>
        </div>
      )}
    </div>
  )
}
