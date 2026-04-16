import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Expense, CurrencyCode } from '../../types'
import { getLast12MonthsData, getLast30DaysData } from '../../utils/dates'
import { formatCurrency } from '../../utils/currency'

interface Props {
  expenses: Expense[]
  currency: CurrencyCode
}

export default function TrendAreaChart({ expenses, currency }: Props) {
  const [period, setPeriod] = useState<'12m' | '30d'>('12m')

  const data =
    period === '12m'
      ? getLast12MonthsData(expenses)
      : getLast30DaysData(expenses)

  const max = Math.max(...data.map(d => d.total), 1)
  const avg = data.reduce((s, d) => s + d.total, 0) / data.length

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {(['12m', '30d'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              period === p
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {p === '12m' ? 'Últimos 12 meses' : 'Últimos 30 días'}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={period === '30d' ? 4 : 0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            domain={[0, Math.ceil(max * 1.15)]}
          />
          {avg > 0 && (
            <ReferenceLine
              y={avg}
              stroke="#c4b5fd"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: 'media', position: 'right', fontSize: 10, fill: '#a78bfa' }}
            />
          )}
          <Tooltip
            formatter={(v: number) => [formatCurrency(v, currency), 'Total']}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              fontSize: '13px',
            }}
            cursor={{ stroke: '#8b5cf6', strokeWidth: 1.5, strokeDasharray: '4 3' }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            fill="url(#areaGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
