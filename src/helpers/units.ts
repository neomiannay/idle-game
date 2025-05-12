const UNITS = ['', 'k', 'M', 'B', 'T']

/**
 * Format a number with units
 * @param value - The number to format
 * @param decimal - The number of decimal places
 * @param showUnits - Whether to show the units
 * @returns The formatted number
 */
export function formatValue (
  value: number,
  decimal?: 0 | 1 | 2 | 3,
  showUnits?: boolean
): string {
  decimal ??= 0
  showUnits ??= true

  const result = value.toLocaleString(undefined, {
    style: 'decimal',
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal
  }).replace(/\s/g, '.')

  const unitIndex = Math.floor(Math.log10(value) / 3) - 1
  const maxUnitIndex = UNITS.length - 1
  const index = unitIndex > maxUnitIndex ? maxUnitIndex : unitIndex
  const parsedResult = result.split(/[.,]/)
  const unit = UNITS[index] ?? ''

  if (showUnits && parsedResult.length > 1) {
    const separator = parsedResult[1].length > 2 ? ' ' : ','
    const sliceMax = index >= maxUnitIndex ? parsedResult.length - UNITS.length : 2

    return parsedResult.slice(0, sliceMax).join(separator) + unit
  } else {
    return result.replace('.', ' ')
  }
}
