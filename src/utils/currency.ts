import { CURRENCIES, CurrencyCode } from '../types'

export function getCurrencyInfo(code: CurrencyCode) {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0]
}

export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
  const info = getCurrencyInfo(currencyCode)
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
