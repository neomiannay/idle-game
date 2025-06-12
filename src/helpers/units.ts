const UNITS = ['', 'k', 'M', 'B', 'T']
export const DEFAULT_SCALE_FACTOR = 1.4

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

  const result = value
    .toLocaleString(undefined, {
      style: 'decimal',
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal
    })
    .replace(/\s/g, '.')

  const unitIndex = Math.floor(Math.log10(value) / 3) - 1
  const maxUnitIndex = UNITS.length - 1
  const index = unitIndex > maxUnitIndex ? maxUnitIndex : unitIndex
  const parsedResult = result.split(/[.,]/)
  const unit = UNITS[index] ?? ''

  if (showUnits && parsedResult.length > 1) {
    const separator = parsedResult[1].length > 2 ? ' ' : ','
    const sliceMax =
      index >= maxUnitIndex ? parsedResult.length - UNITS.length : 2

    return parsedResult.slice(0, sliceMax).join(separator) + unit
  } else {
    return result.replace('.', ' ')
  }
}

export function formatBenefits (value: number): string {
  const fixed = value.toFixed(2) // garde 2 décimales : "15.00"
  const [intPart, decimalPart] = fixed.split('.')

  // Padding de l'entier à 15 chiffres (on veut 17 total avec 2 décimales)
  const paddedInt = intPart.padStart(10, '0')

  // Groupes de 3 chiffres (de droite à gauche)
  const formattedInt = paddedInt.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')

  return `${formattedInt}.${decimalPart}`
}

/**
 * @param duration in ms
 */
export const getRoundedTime = (
  duration: number
): { value: number; unit: string } => {
  // Duration to seconds:
  const seconds = duration / 1000

  // Minutes
  const minutes = Math.floor(seconds / 60)
  if (minutes < 1) return { value: seconds, unit: 'UNITS.SEC' }

  // Hours
  const hours = Math.floor(minutes / 60)
  if (hours < 1) return { value: minutes, unit: 'UNITS.MIN' }

  return { value: hours, unit: 'UNITS.HOUR' }
}

/**
 * @param time - The time to print
 * @param forceZero - Whether to force the time to print
 * @returns The time to print
 */
const timeToPrint = (time: number, forceZero: boolean = false) => {
  return time || forceZero ? (time).toString().padStart(2, '0') + ':' : ''
}

/**
 * @param duration in ms
 * @returns hh:mm:ss
 */
export const timeToHHMMSS = (duration: number) => {
  duration = duration / 1000
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60

  const hStr = timeToPrint(hours)
  const mStr = timeToPrint(minutes, !!hStr.length) || '00:'
  const sStr = seconds.toString().padStart(2, '0')

  return `${hStr}${mStr}${sStr}`
}

/**
 * @param base - The base price
 * @param factor - The factor
 * @param count - The count
 * @returns The price
 */
export const getItemPrice = (base: number, count: number, factor: number = DEFAULT_SCALE_FACTOR) => {
  return Math.round(base * Math.pow(count || 1, factor))
}
