import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  subMonths,
  eachMonthOfInterval,
  eachDayOfInterval,
  subDays,
} from 'date-fns'
import { es } from 'date-fns/locale'

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function daysAgoISO(days: number): string {
  return format(subDays(new Date(), days), 'yyyy-MM-dd')
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy', { locale: es })
}

export function isThisMonth(dateStr: string): boolean {
  const date = parseISO(dateStr)
  const now = new Date()
  return isWithinInterval(date, {
    start: startOfMonth(now),
    end: endOfMonth(now),
  })
}

export function isThisYear(dateStr: string): boolean {
  const date = parseISO(dateStr)
  const now = new Date()
  return isWithinInterval(date, {
    start: startOfYear(now),
    end: endOfYear(now),
  })
}

export function getLast12MonthsData(expenses: { date: string; amount: number }[]) {
  const now = new Date()
  const months = eachMonthOfInterval({
    start: subMonths(startOfMonth(now), 11),
    end: now,
  })

  return months.map(month => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    const total = expenses
      .filter(e => {
        try {
          return isWithinInterval(parseISO(e.date), { start, end })
        } catch {
          return false
        }
      })
      .reduce((sum, e) => sum + e.amount, 0)

    return {
      label: format(month, 'MMM yy', { locale: es }),
      total: Math.round(total * 100) / 100,
    }
  })
}

export function getLast30DaysData(expenses: { date: string; amount: number }[]) {
  const now = new Date()
  const days = eachDayOfInterval({ start: subDays(now, 29), end: now })

  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const total = expenses
      .filter(e => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0)

    return {
      label: format(day, 'dd/MM'),
      total: Math.round(total * 100) / 100,
    }
  })
}
