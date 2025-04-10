import { useEffect, useState, useCallback } from 'react'

import { MotionValue } from 'motion/react'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'

type UpgradeObserverResult = {
  availableUpgrades: Record<string, string[]>
  checkForNewUpgrades: () => void
}

export function useUpgradeObserver (): UpgradeObserverResult {
  const { totalUnits, updateDisplayConditions } = useGameProviderContext()
  const { getElementsForUnit, shouldDisplayElement } = useInventoryContext()

  const [availableUpgrades, setAvailableUpgrades] = useState<Record<string, string[]>>({})

  const checkForNewUpgrades = useCallback(() => {
    updateDisplayConditions()

    const unitIds = Object.keys(totalUnits)
    const newAvailableUpgrades: Record<string, string[]> = {}

    unitIds.forEach(unitId => {
      const upgrades = getElementsForUnit(unitId, 'upgrade')

      if (Object.keys(upgrades).length > 0) {
        newAvailableUpgrades[unitId] = []

        Object.entries(upgrades).forEach(([upgradeId, _]) => {
          if (shouldDisplayElement(unitId, upgradeId, 'upgrade'))
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

    // Vérifier une première fois au mount
    checkForNewUpgrades()

    // Clear les subscriptions au unmount
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    }
  }, [totalUnits, checkForNewUpgrades])

  return { availableUpgrades, checkForNewUpgrades }
}

// Ajouter un listener à une motion value
function addMotionValueListener (
  motionValue: MotionValue<number>,
  callback: (value: number) => void
): () => void {
  const onValueChange = (v: number) => {
    callback(v)
  }

  const unsubscribe = motionValue.on('change', onValueChange)

  return () => {
    unsubscribe()
  }
}
