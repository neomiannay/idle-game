import React, { createContext, useContext, useCallback, useMemo, useEffect } from 'react'

import { useGameLoop } from 'hooks/useGameLoop'
import { useGamePersistence } from 'hooks/useGamePersistence'
import { floor } from 'lodash-es'
import { EGamePrice, EGameUnit, EStatus, GameState, GameStateElement, GameStatePrice, GameStateUnit } from 'types/store'

import { useMessageSystemContext } from './MessageSystemProvider'
import { BaseProviderProps, useGlobalContext } from './GlobalProvider'
import { useGameProviderContext } from './GameProvider'
import { useInventoryContext } from './InventoryProvider'
import { usePricesContext } from './PricesProvider'
import { useFeedbackContext } from './FeedbackProvider'
import { useSectorsProviderContext } from './SectorsProvider'
import { useSearchLaboratoryContext } from './SearchLaboratoryProvider'
import { useSearchPublicityContext } from './SearchPublicityProvider'
import { useLoaderContext } from './LoaderProvider'

type IterationContextType = {
  isPaused: boolean
  togglePause: () => void
  saveGameState: () => void
}

const IterationContext = createContext<IterationContextType | null>(null)

export function IterationProvider ({ children }: BaseProviderProps) {
  const { setLoadingStates } = useLoaderContext()
  const { darkMode, setDarkMode } = useGlobalContext()
  const { units, getUnit, updateDisplayConditions, buyUnit, isSaleSuccessful, hasEnoughUnits } = useGameProviderContext()
  const { getItemProduction, getElementsForUnit, loadElements } = useInventoryContext()
  const { prices } = usePricesContext()
  const { seenMessages, loadMessages, setSeenMessagesLoaded } = useMessageSystemContext()
  const { triggerFeedback, successCount, setSuccessCount, failCount, setFailCount } = useFeedbackContext()
  const { loadSectors, unlockedSectors } = useSectorsProviderContext()
  const { complexComposition, loadComplexComposition, rabbitPrice, loadRabbitPrice } = useSearchLaboratoryContext()
  const { tips, loadTips } = useSearchPublicityContext()

  // Fonction pour traiter un tick de jeu (production d'items)
  const processTick = useCallback((deltaTimeInSeconds: number) => {
    Object.keys(units).forEach(unitId => {
      const unitMotionValue = getUnit(unitId as EGameUnit)?.motionValue
      if (!unitMotionValue) return

      const productionPerSecond = getItemProduction(unitId as EGameUnit)

      // Mettre à jour uniquement s'il y a une production
      if (productionPerSecond > 0) {
        const production = productionPerSecond * deltaTimeInSeconds

        const currentValue = unitMotionValue.get()
        const newValue = floor(currentValue + production, 0)

        if (unitId === EGameUnit.SALE) {
          setSuccessCount(0)
          setFailCount(0)
          for (let i = 0; i < production; i++) {
            if (!hasEnoughUnits(1, EGameUnit.COMPLEX)) return
            if (isSaleSuccessful()) {
              triggerFeedback(EStatus.SUCCESS)
              buyUnit(EGameUnit.SALE)
              setSuccessCount((prev: number) => prev + 1)
            } else {
              triggerFeedback(EStatus.FAIL)
              setFailCount((prev: number) => prev + 1)
            }
          }
        } else { unitMotionValue.set(newValue) }
      }

      // Emitter pour la modale
      // const motionValue = unitMotionValue.get()
      // emitter.emit('unitUpdated', { unitId, motionValue })
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
      darkMode,
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
        const unitUpgrades = getElementsForUnit(unitId as EGameUnit, 'upgrade')
        if (Object.keys(unitUpgrades).length > 0) {
          acc[unitId] = {}
          Object.entries(unitUpgrades).forEach(([upgradeId, upgrade]) => {
            acc[unitId][upgradeId] = {
              _type: 'upgrade',
              _id: upgradeId,
              count: upgrade.count.get(),
              purchased: upgrade.purchased.get()
            }
          })
        }
        return acc
      }, {} as Record<string, Record<string, GameStateElement>>),
      items: Object.keys(units).reduce((acc, unitId) => {
        const unitItems = getElementsForUnit(unitId as EGameUnit, 'item')
        if (Object.keys(unitItems).length > 0) {
          acc[unitId] = {}
          Object.entries(unitItems).forEach(([itemId, item]) => {
            acc[unitId][itemId] = {
              _type: 'item',
              _id: itemId,
              count: item.count.get(),
              purchased: item.purchased.get()
            }
          })
        }
        return acc
      }, {} as Record<string, Record<string, GameStateElement>>),
      sectors: Object.keys(units).reduce((acc, unitId) => {
        const unitSectors = getElementsForUnit(unitId as EGameUnit, 'sector')
        if (Object.keys(unitSectors).length > 0) {
          acc[unitId] = {}
          Object.entries(unitSectors).forEach(([sectorId, sector]) => {
            acc[unitId][sectorId] = {
              _type: 'sector',
              _id: sectorId,
              count: sector.count.get(),
              purchased: sector.purchased.get()
            }
          })
        }
        return acc
      }, {} as Record<string, Record<string, GameStateElement>>),
      otherShopElements: Object.keys(units).reduce((acc, unitId) => {
        const shopElements = getElementsForUnit(unitId as EGameUnit, 'otherShopElement')
        if (Object.keys(shopElements).length > 0) {
          acc[unitId] = {}
          Object.entries(shopElements).forEach(([shopElementId, shopElement]) => {
            acc[unitId][shopElementId] = {
              _type: 'otherShopElement',
              _id: shopElementId,
              count: shopElement.count.get(),
              purchased: shopElement.purchased.get()
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
      seenMessages,
      unlockedSectors,
      complexComposition,
      tips,
      rabbitPrice
    }
  }, [darkMode, units, getElementsForUnit, seenMessages, unlockedSectors, complexComposition, tips, prices, rabbitPrice])

  // Fonction pour charger l'état du jeu
  const handleLoadState = useCallback((gameState: GameState) => {
    // Charger les unités
    if (gameState.darkMode)
      setDarkMode(gameState.darkMode)

    Object.entries(gameState.units || {}).forEach(([unitId, value]) => {
      const unit = getUnit(unitId as EGameUnit)
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
    if (gameState.items)
      loadElements(gameState.items)

    // Charger les upgrades
    if (gameState.upgrades)
      loadElements(gameState.upgrades)

    // Charger les secteurs
    if (gameState.sectors)
      loadElements(gameState.sectors)

    // Charger les autres éléments du shop
    if (gameState.otherShopElements)
      loadElements(gameState.otherShopElements)

    // Charger les messages déjà vus
    if (gameState.seenMessages)
      loadMessages(gameState.seenMessages)

    setSeenMessagesLoaded(true)

    if (gameState.complexComposition)
      loadComplexComposition(gameState.complexComposition)

    if (gameState.tips)
      loadTips(gameState.tips)


    // Charger les prix
    if (gameState.prices) {
      Object.entries(gameState.prices as Record<EGamePrice, GameStatePrice>).forEach(([priceId, priceData]) => {
        if (prices[priceId as EGamePrice]) {
          prices[priceId as EGamePrice].motionValue.set(priceData.motionValue)
          prices[priceId as EGamePrice].totalMotionValue.set(priceData.totalMotionValue)
        }
      })
    }

    if (gameState.unlockedSectors)
      loadSectors(gameState.unlockedSectors)
  }, [getUnit, loadElements, loadSectors])

  // Hook pour la persistance de l'état du jeu
  const { saveGameState, loadGameState } = useGamePersistence({
    onSave: handleSaveState,
    onLoad: handleLoadState
    // autoSaveInterval: 10000
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

    setLoadingStates(prev => ({ ...prev, data: false }))
  }, [])

  const contextValue = useMemo<IterationContextType>(() => ({
    isPaused,
    togglePause,
    saveGameState
  }), [isPaused, togglePause, saveGameState])

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
