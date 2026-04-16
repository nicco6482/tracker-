// ─── CATEGORÍAS ────────────────────────────────────────────────────
// Edita esta lista para añadir, quitar o renombrar categorías.
// Luego actualiza CATEGORY_COLORS, CATEGORY_BADGE y CATEGORY_EMOJI.
export const CATEGORIES = [
  'Comida',
  'Gasolina',
  'Tabaco',
  'Fiesta',
  'Compras',
  'Otros',
] as const

export type Category = (typeof CATEGORIES)[number]

// ─── MÉTODOS DE PAGO ───────────────────────────────────────────────
export const PAYMENT_METHODS = [
  'Efectivo',
  'Tarjeta débito',
  'Tarjeta crédito',
  'Transferencia',
  'Bizum',
  'PayPal',
  'Otro',
] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

// ─── MONEDAS ───────────────────────────────────────────────────────
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'MXN' | 'COP' | 'ARS'

export interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  name: string
  locale: string
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'EUR', symbol: '€', name: 'Euro',            locale: 'es-ES' },
  { code: 'USD', symbol: '$', name: 'US Dollar',       locale: 'en-US' },
  { code: 'GBP', symbol: '£', name: 'British Pound',   locale: 'en-GB' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano',   locale: 'es-MX' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano', locale: 'es-CO' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino',  locale: 'es-AR' },
]

// ─── TIPOS CORE ────────────────────────────────────────────────────
export interface Expense {
  id: string
  date: string // YYYY-MM-DD
  amount: number
  description: string
  category: Category
  paymentMethod: PaymentMethod
  currency: CurrencyCode
}

export type View = 'dashboard' | 'expenses'

export interface Filters {
  search: string
  category: Category | ''
  paymentMethod: PaymentMethod | ''
  dateFrom: string
  dateTo: string
}

// ─── COLORES DE CATEGORÍA ──────────────────────────────────────────
// Color del gráfico (hex)
export const CATEGORY_COLORS: Record<string, string> = {
  Comida:   '#10b981',
  Gasolina: '#3b82f6',
  Tabaco:   '#64748b',
  Fiesta:   '#ec4899',
  Compras:  '#f97316',
  Otros:    '#a855f7',
}

// Clase Tailwind para el badge de la tabla/lista
export const CATEGORY_BADGE: Record<string, string> = {
  Comida:   'bg-emerald-100 text-emerald-700',
  Gasolina: 'bg-blue-100 text-blue-700',
  Tabaco:   'bg-slate-100 text-slate-600',
  Fiesta:   'bg-pink-100 text-pink-700',
  Compras:  'bg-orange-100 text-orange-700',
  Otros:    'bg-purple-100 text-purple-700',
}

// Emoji de cada categoría
export const CATEGORY_EMOJI: Record<string, string> = {
  Comida:   '🍽',
  Gasolina: '⛽',
  Tabaco:   '🚬',
  Fiesta:   '🎉',
  Compras:  '🛍',
  Otros:    '📦',
}
