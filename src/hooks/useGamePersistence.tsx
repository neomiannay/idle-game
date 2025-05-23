import { useCallback, useEffect } from 'react'

import { GameState } from 'types/store'

type PersistenceOptions = {
  onLoad?: (state: GameState) => void
  onSave?: () => GameState
  autoSaveInterval?: number // in milliseconds
  storageKey?: string
}

export const getStorageKey = () => {
  return import.meta.env.VITE_LOCAL_STORAGE_KEY || 'game-store'
}

export function useGamePersistence ({
  onLoad,
  onSave,
  autoSaveInterval = 60000, // Save every minute by default
  storageKey = getStorageKey()
}: PersistenceOptions) {
  const saveGameState = useCallback(() => {
    if (!onSave) return

    const gameState = onSave()
    try {
      localStorage.setItem(storageKey, JSON.stringify(gameState))
      console.log('✨✨✨ Game state saved successfully')
    } catch (error) {
      console.error('Error saving game state:', error)
    }
  }, [onSave, storageKey])

  const loadGameState = useCallback(() => {
    if (!onLoad) return

    try {
      console.log('🔍🔍🔍 Loading game state')

      const savedState = localStorage.getItem(storageKey)
      if (savedState) {
        const gameState = JSON.parse(savedState) as GameState
        onLoad(gameState)
        console.log('✨✨✨ Game state loaded successfully')

        // Calculate offline progress in seconds
        const offlineTime = (Date.now() - gameState.lastPlayedTime) / 1000
        return {
          success: true,
          offlineTime: Math.min(offlineTime, 60 * 60 * 8) // Max 8 hours
        }
      }
    } catch (error) {
      console.error('Error loading game state:', error)
    }

    return { success: false, offlineTime: 0 }
  }, [onLoad, storageKey])

  // Auto-save at intervals
  useEffect(() => {
    if (!autoSaveInterval || !onSave) return

    const interval = setInterval(saveGameState, autoSaveInterval)
    return () => clearInterval(interval)
  }, [autoSaveInterval, saveGameState, onSave])

  // Save when component unmounts
  useEffect(() => {
    return () => {
      if (onSave) saveGameState()
    }
  }, [saveGameState, onSave])

  return {
    saveGameState,
    loadGameState
  }
}
