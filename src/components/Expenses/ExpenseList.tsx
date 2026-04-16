import { useState, useMemo } from 'react'
import { Expense, Filters, CurrencyCode, CATEGORY_BADGE, CATEGORY_EMOJI, CATEGORY_COLORS } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/dates'
import { Edit2, Trash2, Plus, ChevronUp, ChevronDown, ShoppingBag, ArrowUpDown } from 'lucide-react'
import FilterBar from './FilterBar'

interface Props {
  expenses: Expense[]
  currency: CurrencyCode
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

type SortField = 'date' | 'amount' | 'category' | 'description'
type SortDir = 'asc' | 'desc'

const emptyFilters: Filters = { search: '', category: '', paymentMethod: '', dateFrom: '', dateTo: '' }

export default function ExpenseList({ expenses, currency, onEdit, onDelete, onAdd }: Props) {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase()
    let result = expenses.filter(e => {
      if (q && !e.description.toLowerCase().includes(q)) return false
      if (filters.category && e.category !== filters.category) return false
      if (filters.paymentMethod && e.paymentMethod !== filters.paymentMethod) return false
      if (filters.dateFrom && e.date < filters.dateFrom) return false
      if (filters.dateTo && e.date > filters.dateTo) return false
      return true
    })
    return [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'date')        cmp = a.date.localeCompare(b.date)
      else if (sortField === 'amount') cmp = a.amount - b.amount
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category)
      else if (sortField === 'description') cmp = a.description.localeCompare(b.description)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [expenses, filters, sortField, sortDir])

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-violet-500" />
      : <ChevronDown className="w-3 h-3 text-violet-500" />
  }

  function Th({ field, label, right }: { field: SortField; label: string; right?: boolean }) {
    return (
      <th className={`text-xs font-semibold text-slate-400 px-4 py-3.5 ${right ? 'text-right' : 'text-left'}`}>
        <button
          onClick={() => handleSort(field)}
          className={`flex items-center gap-1.5 hover:text-slate-700 transition-colors font-semibold ${right ? 'ml-auto' : ''}`}
        >
          {label}
          <SortIcon field={field} />
        </button>
      </th>
    )
  }

  return (
    <div className="animate-page space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis gastos</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {filtered.length} gasto{filtered.length !== 1 ? 's' : ''}
            {filtered.length > 0 && (
              <> · <span className="text-slate-600 font-semibold">{formatCurrency(total, currency)}</span></>
            )}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-violet-200"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:block">Añadir gasto</span>
        </button>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-500">Sin gastos</p>
              <p className="text-xs text-slate-400 mt-1">
                {expenses.length === 0
                  ? 'Añade tu primer gasto con el botón de arriba'
                  : 'Ningún gasto coincide con los filtros'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <Th field="date"        label="Fecha" />
                    <Th field="description" label="Descripción" />
                    <Th field="category"    label="Categoría" />
                    <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3.5 hidden lg:table-cell">
                      Método
                    </th>
                    <Th field="amount" label="Importe" right />
                    <th className="w-20 px-4 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(expense => (
                    <tr
                      key={expense.id}
                      className="hover:bg-violet-50/30 transition-colors group"
                    >
                      <td className="px-4 py-3.5 text-sm text-slate-400 whitespace-nowrap font-medium">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-8 rounded-full shrink-0"
                            style={{ background: CATEGORY_COLORS[expense.category] ?? '#e2e8f0' }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                              {expense.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_BADGE[expense.category] ?? 'bg-slate-100 text-slate-600'}`}
                        >
                          <span>{CATEGORY_EMOJI[expense.category] ?? '📦'}</span>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-400 hidden lg:table-cell">
                        {expense.paymentMethod}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {formatCurrency(expense.amount, expense.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(expense)}
                            className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(expense.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-50">
              {filtered.map(expense => (
                <div key={expense.id} className="flex items-center gap-3 p-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${CATEGORY_BADGE[expense.category] ?? 'bg-slate-100'}`}
                  >
                    {CATEGORY_EMOJI[expense.category] ?? '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{expense.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{expense.category} · {formatDate(expense.date)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatCurrency(expense.amount, expense.currency)}
                    </p>
                    <div className="flex justify-end gap-2 mt-1.5">
                      <button onClick={() => onEdit(expense)} className="text-slate-400 hover:text-violet-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(expense.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
