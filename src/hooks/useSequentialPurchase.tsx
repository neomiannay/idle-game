import { useCallback } from 'react'

import { ElementTypes } from 'types/store'
import { useInventoryContext } from 'provider/InventoryProvider'

export function useSequentialPurchase () {
  const { getElementsForUnit, getItemCount, getUpgradeCount } = useInventoryContext()

  const canPurchaseItemSequentially = useCallback((unitId: string, itemId: string): boolean => {
    const items = getElementsForUnit(unitId, 'item')
    const itemIds = Object.keys(items)

    const currentIndex = itemIds.indexOf(itemId)

    if (currentIndex === 0) return true

    // Otherwise, check if previous item is purchased
    if (currentIndex > 0) {
      const previousItemId = itemIds[currentIndex - 1]
      return getItemCount(unitId, previousItemId) > 0
    }

    return false
  }, [getElementsForUnit, getItemCount])

  const canPurchaseUpgradeSequentially = useCallback((unitId: string, upgradeId: string): boolean => {
    const upgrades = getElementsForUnit(unitId, 'upgrade')
    const upgradeIds = Object.keys(upgrades)

    // Find current upgrade index
    const currentIndex = upgradeIds.indexOf(upgradeId)

    // If it's the first upgrade, allow purchase
    if (currentIndex === 0) return true

    // Otherwise, check if previous upgrade is purchased
    if (currentIndex > 0) {
      const previousUpgradeId = upgradeIds[currentIndex - 1]
      return getUpgradeCount(unitId, previousUpgradeId) > 0
    }

    return false
  }, [getElementsForUnit, getUpgradeCount])

  // Generic function that works for any element type
  const canPurchaseElementSequentially = useCallback(<T extends keyof ElementTypes>(
    unitId: string,
    elementId: string,
    type: T
  ): boolean => {
    if (type === 'item')
      return canPurchaseItemSequentially(unitId, elementId)
    else if (type === 'upgrade')
      return canPurchaseUpgradeSequentially(unitId, elementId)

    return false
  }, [canPurchaseItemSequentially, canPurchaseUpgradeSequentially])

  return {
    canPurchaseItemSequentially,
    canPurchaseUpgradeSequentially,
    canPurchaseElementSequentially
  }
}
