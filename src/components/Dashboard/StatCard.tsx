import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  subtitle?: string
  color: 'violet' | 'blue' | 'pink' | 'emerald'
}

const styles = {
  violet:  { card: 'bg-violet-600',  icon: 'bg-white/20', text: 'text-violet-100', val: 'text-white' },
  blue:    { card: 'bg-blue-600',    icon: 'bg-white/20', text: 'text-blue-100',   val: 'text-white' },
  pink:    { card: 'bg-pink-600',    icon: 'bg-white/20', text: 'text-pink-100',   val: 'text-white' },
  emerald: { card: 'bg-emerald-600', icon: 'bg-white/20', text: 'text-emerald-100',val: 'text-white' },
}

export default function StatCard({ title, value, icon, subtitle, color }: StatCardProps) {
  const s = styles[color]
  return (
    <div className={`${s.card} rounded-2xl p-5 flex flex-col gap-4 shadow-lg shadow-${color}-200 relative overflow-hidden`}>
      {/* decorative circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -right-1 -bottom-6 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <p className={`text-sm font-medium ${s.text} leading-tight`}>{title}</p>
        <div className={`${s.icon} w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <p className={`text-2xl font-bold ${s.val} truncate leading-none`}>{value}</p>
        {subtitle && <p className={`text-xs ${s.text} mt-1.5`}>{subtitle}</p>}
      </div>
    </div>
  )
}
