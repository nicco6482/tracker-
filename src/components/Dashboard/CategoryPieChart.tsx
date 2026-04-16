import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'
import { CurrencyCode, CATEGORY_COLORS, CATEGORY_EMOJI } from '../../types'
import { formatCurrency } from '../../utils/currency'

interface Props {
  data: { name: string; value: number }[]
  currency: CurrencyCode
  total: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

export default function CategoryPieChart({ data, currency, total }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const active = activeIndex !== undefined ? data[activeIndex] : null

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              activeIndex={activeIndex}
              activeShape={ActiveShape}
              onMouseEnter={(_, i) => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(undefined)}
              animationBegin={0}
              animationDuration={700}
            >
              {data.map(entry => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#6b7280'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => [formatCurrency(v, currency), 'Total']}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center transition-all duration-150">
            {active ? (
              <>
                <p className="text-2xl">{CATEGORY_EMOJI[active.name] ?? '📦'}</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {formatCurrency(active.value, currency)}
                </p>
                <p className="text-xs text-slate-400">{active.name}</p>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-slate-900 leading-tight">
                  {formatCurrency(total, currency)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">este mes</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {data.map((d, i) => (
          <div
            key={d.name}
            className={`flex items-center gap-2 cursor-pointer rounded-lg px-1.5 py-1 transition-colors ${
              activeIndex === i ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: CATEGORY_COLORS[d.name] ?? '#6b7280' }}
            />
            <span className="text-xs text-slate-600 truncate">{d.name}</span>
            <span className="text-xs text-slate-400 ml-auto shrink-0">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
