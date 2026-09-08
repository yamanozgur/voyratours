import { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; prefix: boolean }> = {
  EUR: { rate: 1.0, symbol: '€', prefix: true },
  USD: { rate: 1.08, symbol: '$', prefix: true },
  TRY: { rate: 38.0, symbol: '₺', prefix: false },
  GBP: { rate: 0.85, symbol: '£', prefix: true },
};

export function formatPrice(priceInEUR: number, currency: Currency): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.EUR;
  const converted = Math.round(priceInEUR * config.rate);
  const formattedNumber = new Intl.NumberFormat('en-US').format(converted);

  if (config.prefix) {
    return `${config.symbol}${formattedNumber}`;
  }
  return `${formattedNumber} ${config.symbol}`;
}
