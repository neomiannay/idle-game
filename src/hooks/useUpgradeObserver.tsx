import { useEffect, useState, useCallback } from 'react'

import { MotionValue } from 'motion/react'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import { EGameUnit } from 'types/store'

type UpgradeObserverResult = {
  availableUpgrades: Record<string, string[]>
  checkForNewUpgrades: () => void
}

// Fonction d'aide pour ajouter un listener à une MotionValue
function addMotionValueListener<T> (motionValue: MotionValue<T>, callback: (value: T) => void): () => void {
  return motionValue.on('change', callback)
}

export function useUpgradeObserver (): UpgradeObserverResult {
  const { totalUnits, updateDisplayConditions } = useGameProviderContext()
  const { getElementsForUnit, shouldDisplayElement } = useInventoryContext()

  const [availableUpgrades, setAvailableUpgrades] = useState<Record<string, string[]>>({})

  const checkForNewUpgrades = useCallback(() => {
    updateDisplayConditions()

    const unitIds = Object.keys(totalUnits) as EGameUnit[]
    const newAvailableUpgrades: Record<string, string[]> = {}

    unitIds.forEach(unitId => {
      const upgrades = getElementsForUnit(unitId as EGameUnit, 'upgrade')

      if (Object.keys(upgrades).length > 0) {
        newAvailableUpgrades[unitId] = []

        Object.entries(upgrades).forEach(([upgradeId, upgrade]) => {
          if (shouldDisplayElement(unitId as EGameUnit, upgradeId, 'upgrade'))
            newAvailableUpgrades[unitId].push(upgradeId)
        })
      }
    })

    setAvailableUpgrades(newAvailableUpgrades)
  }, [getElementsForUnit, shouldDisplayElement, totalUnits, updateDisplayConditions])

  useEffect(() => {
    const unsubscribeFunctions: Array<() => void> = []

    Object.entries(totalUnits).forEach(([unitId, motionValue]) => {
      const callback = (newValue: number) => {
        checkForNewUpgrades()
      }

      // Ajouter un listener pour cette motion value
      const unsubscribe = addMotionValueListener(motionValue, callback)
      unsubscribeFunctions.push(unsubscribe)
    })

    // Observer les changements d'état des upgrades
    Object.entries(totalUnits).forEach(([unitId, _]) => {
      const upgrades = getElementsForUnit(unitId as EGameUnit, 'upgrade')
      Object.entries(upgrades).forEach(([upgradeId, upgrade]) => {
        const callback = (newValue: boolean) => {
          checkForNewUpgrades()
        }

        // Ajouter un listener pour l'état purchased de chaque upgrade
        const unsubscribe = addMotionValueListener(upgrade.purchased, callback)
        unsubscribeFunctions.push(unsubscribe)
      })
    })

    // Vérifier une première fois au mount
    checkForNewUpgrades()

    // Clear les subscriptions au unmount
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    }
  }, [totalUnits, checkForNewUpgrades, getElementsForUnit])

  return { availableUpgrades, checkForNewUpgrades }
}
