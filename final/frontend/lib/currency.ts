// Currency formatting utilities

export const CURRENCY_SYMBOLS: Record<string, string> = {
  PKR: 'Rs',
  USD: '$',
  EUR: '€',
  GBP: '£',
  SAR: 'SR',
  AED: 'د.إ'
}

export function formatCurrency(amount: number, currency: string = 'PKR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  return `${symbol} ${amount.toFixed(2)}`
}

export function getCurrencySymbol(currency: string = 'PKR'): string {
  return CURRENCY_SYMBOLS[currency] || currency
}
