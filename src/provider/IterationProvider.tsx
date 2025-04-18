import React, { createContext, useContext, useCallback, useState, useMemo, useEffect } from 'react'

import { useGameLoop } from 'hooks/useGameLoop'
import { useGamePersistence } from 'hooks/useGamePersistence'
import { floor } from 'lodash-es'

import { BaseProviderProps } from './GlobalProvider'
import { useGameProviderContext } from './GameProvider'
import { useInventoryContext } from './InventoryProvider'

type IterationContextType = {
  isPaused: boolean
  togglePause: () => void
  loading: boolean
  saveGameState: () => void
}

const IterationContext = createContext<IterationContextType | null>(null)

export function IterationProvider ({ children }: BaseProviderProps) {
  const [loading, setLoading] = useState(true)

  const { units, getUnit, updateDisplayConditions } = useGameProviderContext()
  const { getItemProduction, getElementsForUnit, setItemCount, setUpgradeCount } = useInventoryContext()

  // Fonction pour traiter un tick de jeu (production d'items)
  const processTick = useCallback((deltaTimeInSeconds: number) => {
    Object.keys(units).forEach(unitId => {
      const unitMotionValue = getUnit(unitId)?.motionValue
      if (!unitMotionValue) return

      const productionPerSecond = getItemProduction(unitId)

      // Mettre à jour uniquement s'il y a une production
      if (productionPerSecond > 0) {
        const production = productionPerSecond * deltaTimeInSeconds

        const currentValue = unitMotionValue.get()
        const newValue = floor(currentValue + production, 0)

        unitMotionValue.set(newValue)
      }
    })
  }, [units, getUnit, getItemProduction])

  const { isPaused, togglePause } = useGameLoop({
    onTick: processTick,
    initialPaused: false
  })

  // Fonction pour sauvegarder l'état du jeu
  const handleSaveState = useCallback(() => {
    return {
      lastPlayedTime: Date.now(),
      units: Object.entries(units).reduce((acc, [unitId, unit]) => {
        acc[unitId] = {
          motionValue: unit.motionValue.get(),
          totalMotionValue: unit.totalMotionValue.get()
        }
        return acc
      }, {} as Record<string, { motionValue: number, totalMotionValue: number }>),
      upgrades: Object.keys(units).reduce((acc, unitId) => {
        const unitUpgrades = getElementsForUnit(unitId, 'upgrade')
        if (Object.keys(unitUpgrades).length > 0) {
          acc[unitId] = {}
          Object.entries(unitUpgrades).forEach(([upgradeId, upgrade]) => {
            acc[unitId][upgradeId] = upgrade.purchased.get()
          })
        }
        return acc
      }, {} as Record<string, Record<string, boolean>>),
      items: Object.keys(units).reduce((acc, unitId) => {
        const unitItems = getElementsForUnit(unitId, 'item')
        if (Object.keys(unitItems).length > 0) {
          acc[unitId] = {}
          Object.entries(unitItems).forEach(([itemId, item]) => {
            acc[unitId][itemId] = item.count.get()
          })
        }
        return acc
      }, {} as Record<string, Record<string, number>>)
    }
  }, [units, getElementsForUnit])

  // Fonction pour charger l'état du jeu
  const handleLoadState = useCallback((gameState: any) => {
    // Charger les unités
    Object.entries(gameState.units || {}).forEach(([unitId, value]) => {
      const unit = getUnit(unitId)
      if (unit) {
        // Vérifier si la valeur est un objet avec motionValue et totalMotionValue
        if (typeof value === 'object' && value !== null && 'motionValue' in value && 'totalMotionValue' in value) {
          const motionVal = floor(Number(value.motionValue), 0)
          const totalVal = floor(Number(value.totalMotionValue), 0)

          unit.motionValue.set(motionVal)
          unit.totalMotionValue.set(totalVal)
        } else {
          // Rétrocompatibilité avec l'ancien format
          const roundedValue = floor(Number(value), 0)
          unit.motionValue.set(roundedValue)
        }
      }
    })

    // Charger les items
    if (gameState.items) {
      Object.entries(gameState.items).forEach(([unitId, unitItems]) => {
        Object.entries(unitItems as Record<string, number>).forEach(([itemId, count]) => {
          if (count > 0) setItemCount(unitId, itemId, count)
        })
      })
    }

    // Charger les upgrades
    if (gameState.upgrades) {
      Object.entries(gameState.upgrades).forEach(([unitId, unitUpgrades]) => {
        Object.entries(unitUpgrades as Record<string, boolean>).forEach(([upgradeId, purchased]) => {
          if (purchased) setUpgradeCount(unitId, upgradeId, 1)
        })
      })
    }
  }, [getUnit, setItemCount, setUpgradeCount])

  // Hook pour la persistance de l'état du jeu
  const { saveGameState, loadGameState } = useGamePersistence({
    onSave: handleSaveState,
    onLoad: handleLoadState,
    autoSaveInterval: 10000
  })

  // Charger l'état du jeu au montage
  useEffect(() => {
    const result = loadGameState()

    if (result?.success) {
      // Progression hors ligne
      if (result.offlineTime > 0) {
        processTick(result.offlineTime)
        console.log(`You earned ${Math.floor(result.offlineTime / 60)} minutes of offline progress!`)
      }

      updateDisplayConditions()
    }

    setLoading(false)
  }, [loadGameState, processTick, updateDisplayConditions])

  const contextValue = useMemo<IterationContextType>(() => ({
    isPaused,
    togglePause,
    loading,
    saveGameState
  }), [isPaused, togglePause, loading, saveGameState])

  return (
    <IterationContext.Provider value={ contextValue }>
      { children }
    </IterationContext.Provider>
  )
}

export const useIterationContext = () => {
  const context = useContext(IterationContext)
  if (!context) throw Error('useIterationContext must be used inside an `IterationProvider`')
  return context
}
