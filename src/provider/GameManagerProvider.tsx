import React, { useEffect } from 'react'

import useGameState from 'store/gameState'

const STORAGE_KEY = 'idle-game-state'

export function GameManagerProvider ({ children }: { children: React.ReactNode }) {
  const { count } = useGameState()

  // Charger les données depuis le localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const parsed = JSON.parse(savedData)
      useGameState.setState(parsed)
    }
  }, [])

  // Sauvegarde automatique toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useGameState.getState()))
      console.log('🚨 GameManagerProvider: auto save done')
    }, 5000)

    console.log('🚨 GameManagerProvider: auto save activated')

    return () => clearInterval(interval)
  }, [])

  return <>{ children }</>
}
