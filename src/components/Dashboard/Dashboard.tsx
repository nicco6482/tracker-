import { useMemo } from 'react'
import { getDaysInMonth, getDate } from 'date-fns'
import { Expense, CurrencyCode, CATEGORY_BADGE, CATEGORY_EMOJI, CATEGORY_COLORS } from '../../types'
import { isThisMonth, isThisYear, formatDate } from '../../utils/dates'
import { formatCurrency } from '../../utils/currency'
import CategoryPieChart from './CategoryPieChart'
import TrendAreaChart from './TrendBarChart'
import CategoryBarChart from './CategoryBarChart'
import WalletWidget from '../Wallet/WalletWidget'
import { TrendingUp, Zap, Hash, Plus, PiggyBank, ArrowUpRight } from 'lucide-react'

interface Props {
  expenses: Expense[]
  currency: CurrencyCode
  onAddExpense: () => void
}

export default function Dashboard({ expenses, currency, onAddExpense }: Props) {
  const now = new Date()
  const dayOfMonth   = getDate(now)
  const daysInMonth  = getDaysInMonth(now)
  const monthProgress = Math.round((dayOfMonth / daysInMonth) * 100)

  const monthExpenses = useMemo(() => expenses.filter(e => isThisMonth(e.date)), [expenses])
  const yearExpenses  = useMemo(() => expenses.filter(e => isThisYear(e.date)),  [expenses])

  const totalMonth = useMemo(() => monthExpenses.reduce((s, e) => s + e.amount, 0), [monthExpenses])
  const totalYear  = useMemo(() => yearExpenses.reduce((s, e) => s + e.amount, 0),  [yearExpenses])
  const avgMonth   = monthExpenses.length > 0 ? totalMonth / monthExpenses.length : 0
  const biggestMonth = monthExpenses.length > 0 ? Math.max(...monthExpenses.map(e => e.amount)) : 0

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}
    monthExpenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + e.amount })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value)
  }, [monthExpenses])

  const topCategory = categoryData[0]
  const recent = expenses.slice(0, 6)

  // ── EMPTY STATE ─────────────────────────────────────────────────
  if (expenses.length === 0) {
    return (
      <div className="animate-page flex flex-col items-center justify-center min-h-[65vh] gap-6 text-center px-4">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <PiggyBank className="w-16 h-16 text-violet-400" strokeWidth={1.2} />
          </div>
          <button
            onClick={onAddExpense}
            className="absolute -bottom-2 -right-2 w-11 h-11 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200 hover:bg-violet-700 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sin gastos todavía</h2>
          <p className="text-slate-400 text-sm mt-1.5 max-w-xs leading-relaxed">
            Añade tu primer gasto y empieza a ver tus estadísticas en tiempo real.
          </p>
        </div>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-7 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Añadir primer gasto
        </button>
      </div>
    )
  }

  // ── MAIN DASHBOARD ──────────────────────────────────────────────
  return (
    <div className="animate-page space-y-5">

      {/* ── WALLET WIDGET ─────────────────────────────────────── */}
      <WalletWidget expenses={expenses} currency={currency} />

      {/* ── HERO CARD ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-violet-600 via-violet-600 to-purple-700 rounded-3xl p-7 text-white relative overflow-hidden shadow-xl shadow-violet-200">
        {/* Decorative blobs */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-16 -bottom-8 w-28 h-28 rounded-full bg-purple-800/30 pointer-events-none" />
        <div className="absolute -left-6 bottom-0 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <p className="text-violet-200 text-sm font-medium mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Total gastado este mes
          </p>
          <p className="text-5xl sm:text-6xl font-bold tracking-tight mb-3">
            {formatCurrency(totalMonth, currency)}
          </p>

          {topCategory && (
            <p className="text-violet-200 text-sm mb-5">
              {monthExpenses.length} gastos &nbsp;·&nbsp;
              más en <span className="text-white font-semibold">{topCategory.name}</span>
              &nbsp;({formatCurrency(topCategory.value, currency)})
            </p>
          )}

          {/* Month progress bar */}
          <div>
            <div className="flex justify-between text-xs text-violet-300 mb-1.5 font-medium">
              <span>Progreso del mes</span>
              <span>Día {dayOfMonth} de {daysInMonth}</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-white rounded-full transition-all duration-1000"
                style={{ width: `${monthProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MINI STATS ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Este año',
            value: formatCurrency(totalYear, currency),
            sub: `${yearExpenses.length} gastos`,
            icon: <TrendingUp className="w-4 h-4" />,
            color: 'text-blue-600 bg-blue-50',
          },
          {
            label: 'Promedio',
            value: formatCurrency(avgMonth, currency),
            sub: 'por gasto este mes',
            icon: <Zap className="w-4 h-4" />,
            color: 'text-pink-600 bg-pink-50',
          },
          {
            label: 'Mayor gasto',
            value: biggestMonth > 0 ? formatCurrency(biggestMonth, currency) : '—',
            sub: 'pago individual',
            icon: <Hash className="w-4 h-4" />,
            color: 'text-emerald-600 bg-emerald-50',
          },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</p>
            <p className="text-base font-bold text-slate-900 mt-0.5 truncate">{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Donut */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Por categoría</h2>
              <p className="text-xs text-slate-400 mt-0.5">Este mes</p>
            </div>
          </div>
          {categoryData.length > 0 ? (
            <CategoryPieChart data={categoryData} currency={currency} total={totalMonth} />
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* Area chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="mb-1">
            <h2 className="text-sm font-bold text-slate-800">Evolución de gastos</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tendencia acumulada</p>
          </div>
          <TrendAreaChart expenses={expenses} currency={currency} />
        </div>
      </div>

      {/* ── CATEGORY BARS ─────────────────────────────────────── */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-1">Desglose por categoría</h2>
          <p className="text-xs text-slate-400 mb-5">Ranking de gasto este mes</p>
          <CategoryBarChart data={categoryData} currency={currency} total={totalMonth} />
        </div>
      )}

      {/* ── RECENT EXPENSES ───────────────────────────────────── */}
      {recent.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Últimos gastos</h2>
              <p className="text-xs text-slate-400 mt-0.5">Transacciones recientes</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {recent.map((expense, i) => (
              <div
                key={expense.id}
                className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Category dot + icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 ${CATEGORY_BADGE[expense.category] ?? 'bg-slate-100 text-slate-600'}`}
                >
                  {CATEGORY_EMOJI[expense.category] ?? '📦'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{expense.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: CATEGORY_COLORS[expense.category] ?? '#6b7280' }}
                    />
                    <p className="text-xs text-slate-400">{expense.category} · {formatDate(expense.date)}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900 tabular-nums">
                    {formatCurrency(expense.amount, expense.currency)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{expense.paymentMethod}</p>
                </div>

                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-52 flex flex-col items-center justify-center text-slate-300 gap-2">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        <PiggyBank className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-xs">Sin gastos este mes</p>
    </div>
  )
}
