import React, { createContext, useContext, useCallback, useState, useMemo, useEffect } from 'react'

import { useGameLoop } from 'hooks/useGameLoop'
import { useGamePersistence } from 'hooks/useGamePersistence'
import { floor } from 'lodash-es'
import { GameState, GameStateElement, GameStatePrice, GameStateUnit } from 'types/store'
import useTinyEmitter from 'hooks/useTinyEmitter'

import { useMessageSystemContext } from './MessageSystemProvider'
import { BaseProviderProps } from './GlobalProvider'
import { useGameProviderContext } from './GameProvider'
import { useInventoryContext } from './InventoryProvider'
import { usePricesContext } from './PricesProvider'

type IterationContextType = {
  isPaused: boolean
  togglePause: () => void
  loading: boolean
  saveGameState: () => void
}

const IterationContext = createContext<IterationContextType | null>(null)

export function IterationProvider ({ children }: BaseProviderProps) {
  const [loading, setLoading] = useState(true)
  const emitter = useTinyEmitter()

  const { units, getUnit, updateDisplayConditions } = useGameProviderContext()
  const { getItemProduction, getElementsForUnit, setItemCount, setUpgradeCount, setItemPurchased, setUpgradePurchased } = useInventoryContext()
  const { prices } = usePricesContext()
  const { seenMessages, loadMessages, setSeenMessagesLoaded } = useMessageSystemContext()

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

      const motionValue = unitMotionValue.get()

      emitter.emit('unitUpdated', { unitId, motionValue })
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
        const unitData: GameStateUnit = {
          motionValue: unit.motionValue.get(),
          totalMotionValue: unit.totalMotionValue.get()
        }

        if (unit.duration)
          unitData.duration = unit.duration.get()

        if (unit.valueByAction)
          unitData.valueByAction = unit.valueByAction.get()

        acc[unitId] = unitData
        return acc
      }, {} as GameState['units']),
      upgrades: Object.keys(units).reduce((acc, unitId) => {
        const unitUpgrades = getElementsForUnit(unitId, 'upgrade')
        if (Object.keys(unitUpgrades).length > 0) {
          acc[unitId] = {}
          Object.entries(unitUpgrades).forEach(([upgradeId, upgrade]) => {
            acc[unitId][upgradeId] = {
              count: upgrade.count.get(),
              purchased: upgrade.purchased.get()
            }
          })
        }
        return acc
      }, {} as Record<string, Record<string, GameStateElement>>),
      items: Object.keys(units).reduce((acc, unitId) => {
        const unitItems = getElementsForUnit(unitId, 'item')
        if (Object.keys(unitItems).length > 0) {
          acc[unitId] = {}
          Object.entries(unitItems).forEach(([itemId, item]) => {
            acc[unitId][itemId] = {
              count: item.count.get(),
              purchased: item.purchased.get()
            }
          })
        }
        return acc
      }, {} as Record<string, Record<string, GameStateElement>>),
      prices: Object.entries(prices).reduce((acc, [priceId, price]) => {
        acc[priceId] = {
          motionValue: price.motionValue.get(),
          totalMotionValue: price.totalMotionValue.get()
        }
        return acc
      }, {} as Record<string, GameStatePrice>),
      seenMessages
    }
  }, [units, getElementsForUnit, seenMessages])

  // Fonction pour charger l'état du jeu
  const handleLoadState = useCallback((gameState: GameState) => {
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

          if ('duration' in value && unit.duration && typeof unit.duration.set === 'function') {
            const durationVal = floor(Number(value.duration), 0)
            unit.duration.set(durationVal)
          }

          if ('valueByAction' in value && unit.valueByAction && typeof unit.valueByAction.set === 'function') {
            const actionVal = floor(Number(value.valueByAction), 0)
            unit.valueByAction.set(actionVal)
          }
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
        Object.entries(unitItems as Record<string, GameStateElement>).forEach(([itemId, { count, purchased }]) => {
          if (count > 0) setItemCount(unitId, itemId, count)
          if (purchased) setItemPurchased(unitId, itemId)
        })
      })
    }

    // Charger les upgrades
    if (gameState.upgrades) {
      Object.entries(gameState.upgrades).forEach(([unitId, unitUpgrades]) => {
        Object.entries(unitUpgrades as Record<string, GameStateElement>).forEach(([upgradeId, { count, purchased }]) => {
          if (count > 0) setUpgradeCount(unitId, upgradeId, 1)
          if (purchased) setUpgradePurchased(unitId, upgradeId)
        })
      })
    }

    // Charger les messages déjà vus
    if (gameState.seenMessages)
      loadMessages(gameState.seenMessages)

    setSeenMessagesLoaded(true)

    // Charger les prix
    if (gameState.prices) {
      Object.entries(gameState.prices as Record<string, GameStatePrice>).forEach(([priceId, priceData]) => {
        if (prices[priceId]) {
          prices[priceId].motionValue.set(priceData.motionValue)
          prices[priceId].totalMotionValue.set(priceData.totalMotionValue)
        }
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
  }, [])

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
