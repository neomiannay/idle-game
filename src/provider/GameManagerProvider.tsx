import React, { useEffect, useState } from 'react'

import useUnitsStore from 'store/useUnitsStore'

const STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY
const SAVE_INTERVAL = 5000

export function GameManagerProvider ({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Restauration des données sauvegardées
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        // Ne restaurer que les données modifiables
        const restoredState = {
          units: Object.entries(parsed.units || {}).reduce((acc, [unitId, unitData]: [string, any]) => {
            const currentUnit = useUnitsStore.getState().units[unitId]

            if (currentUnit) {
              acc[unitId] = {
                ...currentUnit,
                count: unitData.count ?? currentUnit.count,
                action: {
                  ...currentUnit.action,
                  valueByAction: unitData.action?.valueByAction ?? currentUnit.action.valueByAction,
                  duration: unitData.action?.duration ?? currentUnit.action.duration
                },
                items: unitData.items ?? currentUnit.items,
                upgrades: unitData.upgrades ?? currentUnit.upgrades
              }
            }

            return acc
          }, {} as Record<string, any>)
        }

        useUnitsStore.setState({ units: restoredState.units })
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState))
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState))
      console.log('🚨 GameManagerProvider: save before unload')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLoaded])

  // // Mise à jour des types pour inclure les items et upgrades
  // useEffect(() => {
  //   if (!isLoaded) return

  //   const gameLoop = setInterval(() => {
  //     const { units } = useUnitsStore.getState()

  //     Object.values(units).forEach(unit => {
  //       if (unit.items && unit.items.length > 0) {
  //         unit.items.forEach(item => {
  //           if (item.unitByTime && item.unitId)
  //             useUnitsStore.getState().updateUnitCount(item.unitId, item.unitByTime / (1000 / 1000))
  //         })
  //       }
  //     })
  //   }, 1000)

  //   return () => clearInterval(gameLoop)
  // }, [isLoaded])

  if (!isLoaded)
    return <div>Loading game data...</div>

  return <>{ children }</>
}
