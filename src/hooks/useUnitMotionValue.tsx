import { useMotionValue, useMotionValueEvent } from 'motion/react'
import { MotionValue } from 'motion'

export type UnitMotionValueResult = {
  value: MotionValue<number>
  total: MotionValue<number>
  add: (amount: number) => void
  subtract: (amount: number) => boolean // returns true if successful
  get: () => number
  getTotal: () => number
}

export function useUnitMotionValue (initialValue: number = 0): UnitMotionValueResult {
  const value = useMotionValue(initialValue)
  const total = useMotionValue(initialValue)

  useMotionValueEvent(value, 'change', (latest) => {
    const delta = latest - (value.getPrevious() || 0)
    if (delta > 0) total.set(total.get() + delta)
  })

  const add = (amount: number) => {
    value.set(value.get() + amount)
  }

  const subtract = (amount: number) => {
    const current = value.get()
    if (current >= amount) {
      value.set(current - amount)
      return true
    }
    return false
  }

  return {
    value,
    total,
    add,
    subtract,
    get: () => value.get(),
    getTotal: () => total.get()
  }
}
