export function formatNumber(value: number, language: string, maximumFractionDigits: number) {
  return new Intl.NumberFormat(language, { maximumFractionDigits }).format(value)
}
