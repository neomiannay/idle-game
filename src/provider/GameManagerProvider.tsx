import React, { useEffect, useState } from 'react'

import useUnitsStore from 'store/useUnitsStore'

import { BaseProviderProps } from './GlobalProvider'

const STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY
const SAVE_INTERVAL = 5000

export function GameManagerProvider ({ children }: BaseProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Restauration des données sauvegardées
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)

        const restoredState = {
          units: Object.entries(parsed.units || {}).reduce((acc, [unitId, unitData]: [string, any]) => {
            const currentUnit = useUnitsStore.getState().units[unitId]

            if (currentUnit) {
              // Ajouter un flag pour indiquer si l'unité a déjà été débloquée
              const wasUnlocked = parsed.unlockedUnits && parsed.unlockedUnits.includes(unitId)

              acc[unitId] = {
                ...currentUnit,
                count: unitData.count ?? currentUnit.count,
                action: {
                  ...currentUnit.action,
                  valueByAction: unitData.action?.valueByAction ?? currentUnit.action.valueByAction,
                  duration: unitData.action?.duration ?? currentUnit.action.duration
                },
                items: unitData.items ?? currentUnit.items,
                upgrades: unitData.upgrades ?? currentUnit.upgrades,
                // Si l'unité était déjà débloquée avant, on force son existence
                isForceUnlocked: wasUnlocked
              }
            }

            return acc
          }, {} as Record<string, any>)
        }

        useUnitsStore.setState({
          units: restoredState.units
        })
      }
    } catch (error) {
      console.error('Error while loading game state:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sauvegarde automatique toutes les 5 secondes
  useEffect(() => {
    if (!isLoaded) return

    const interval = setInterval(() => {
      const currentState = useUnitsStore.getState()

      const unlockedUnits = Object.entries(currentState.units)
        .filter(([_, unit]) => unit.count > 0 || unit.isForceUnlocked)
        .map(([unitId]) => unitId)

      const stateToSave = {
        ...currentState,
        unlockedUnits
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
      console.log('🚨 GameManagerProvider: auto save done')
    }, SAVE_INTERVAL)

    console.log('🚨 GameManagerProvider: auto save activated')

    return () => clearInterval(interval)
  }, [isLoaded])

  // Sauvegarde avant la fermeture de la page
  useEffect(() => {
    if (!isLoaded) return

    const handleBeforeUnload = () => {
      const currentState = useUnitsStore.getState()

      const unlockedUnits = Object.entries(currentState.units)
        .filter(([_, unit]) => unit.count > 0 || unit.isForceUnlocked)
        .map(([unitId]) => unitId)

      const stateToSave = {
        ...currentState,
        unlockedUnits
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
      console.log('🚨 GameManagerProvider: save before unload')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLoaded])

  if (!isLoaded)
    return <div>Loading game data...</div>

  return <>{ children }</>
}
