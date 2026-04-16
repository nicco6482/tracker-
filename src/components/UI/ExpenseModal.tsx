import { useState, useEffect } from 'react'
import {
  Expense, Category, PaymentMethod, CurrencyCode,
  CATEGORIES, PAYMENT_METHODS, CURRENCIES, CATEGORY_EMOJI,
} from '../../types'
import { todayISO } from '../../utils/dates'
import { X } from 'lucide-react'

interface Props {
  expense: Expense | null
  defaultCurrency: CurrencyCode
  onSubmit: (data: Omit<Expense, 'id'>) => void
  onClose: () => void
}

interface FormState {
  date: string
  amount: string
  description: string
  category: Category
  paymentMethod: PaymentMethod
  currency: CurrencyCode
}

export default function ExpenseModal({ expense, defaultCurrency, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<FormState>({
    date:          expense?.date          ?? todayISO(),
    amount:        expense?.amount.toString() ?? '',
    description:   expense?.description   ?? '',
    category:      expense?.category      ?? 'Comida',
    paymentMethod: expense?.paymentMethod ?? 'Efectivo',
    currency:      expense?.currency      ?? defaultCurrency,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (!form.description.trim()) next.description = 'Obligatorio'
    const n = parseFloat(form.amount)
    if (!form.amount || isNaN(n) || n <= 0) next.amount = 'Importe inválido'
    if (!form.date) next.date = 'Obligatorio'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      date:          form.date,
      amount:        parseFloat(parseFloat(form.amount).toFixed(2)),
      description:   form.description.trim(),
      category:      form.category,
      paymentMethod: form.paymentMethod,
      currency:      form.currency,
    })
  }

  const fieldClass = (err?: string) =>
    `w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 text-slate-800 transition-all ${
      err
        ? 'border-red-300 bg-red-50 focus:ring-red-300'
        : 'border-slate-200 hover:border-slate-300 focus:ring-violet-400 focus:border-violet-400'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-backdrop">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet / Modal */}
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-modal">

        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {expense ? 'Editar gasto' : 'Nuevo gasto'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {expense ? 'Modifica los campos que quieras' : 'Rellena los datos del gasto'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Descripción <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <input
              type="text"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Ej: Gasolinera, Comida..."
              autoFocus
              className={fieldClass(errors.description)}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Importe <span className="text-red-400 normal-case font-normal">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="0.00"
                className={fieldClass(errors.amount)}
              />
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Moneda</label>
              <select
                value={form.currency}
                onChange={e => set('currency', e.target.value)}
                className={fieldClass()}
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Fecha <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className={fieldClass(errors.date)}
            />
          </div>

          {/* Category grid */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => set('category', cat)}
                  className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    form.category === cat
                      ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm scale-105'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl leading-none">{CATEGORY_EMOJI[cat] ?? '📦'}</span>
                  <span className="leading-tight">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment method chips */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Método de pago</label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set('paymentMethod', m)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    form.paymentMethod === m
                      ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-sm font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-200"
            >
              {expense ? 'Guardar cambios' : 'Añadir gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
