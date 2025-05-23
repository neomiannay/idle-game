import { useState, useEffect } from 'react'

import { getStorageKey } from './useGamePersistence'

export function useLocalStorage<T> (key: string) {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    try {
      const item = localStorage.getItem(getStorageKey())
      if (!item) return null

      const parsedItem = JSON.parse(item)
      return parsedItem[key] ?? null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  })

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = localStorage.getItem(getStorageKey())
        if (!item) return

        const parsedItem = JSON.parse(item)
        setStoredValue(parsedItem[key] ?? null)
      } catch (error) {
        console.error('Error reading from localStorage:', error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return storedValue
}
