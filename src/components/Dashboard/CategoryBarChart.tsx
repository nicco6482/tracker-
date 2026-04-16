import { useEffect, useState } from 'react'
import { CurrencyCode, CATEGORY_COLORS, CATEGORY_EMOJI } from '../../types'
import { formatCurrency } from '../../utils/currency'

interface Props {
  data: { name: string; value: number }[]
  currency: CurrencyCode
  total: number
}

export default function CategoryBarChart({ data, currency, total }: Props) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120)
    return () => clearTimeout(t)
  }, [data])

  // reset animation when data changes
  useEffect(() => {
    setAnimated(false)
    const t = setTimeout(() => setAnimated(true), 120)
    return () => clearTimeout(t)
  }, [data.length])

  if (data.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-4 text-center">Sin datos este mes</p>
    )
  }

  return (
    <div className="space-y-3">
      {data.map(({ name, value }) => {
        const pct = total > 0 ? (value / total) * 100 : 0
        const color = CATEGORY_COLORS[name] ?? '#6b7280'
        return (
          <div key={name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{CATEGORY_EMOJI[name] ?? '📦'}</span>
                <span className="text-sm font-medium text-slate-700">{name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 tabular-nums">
                  {pct.toFixed(0)}%
                </span>
                <span className="text-sm font-semibold text-slate-900 tabular-nums w-24 text-right">
                  {formatCurrency(value, currency)}
                </span>
              </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  backgroundColor: color,
                  transition: 'width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
