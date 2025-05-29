import { EGameUnit, ElementType } from 'types/store'
import { useInventoryContext } from 'provider/InventoryProvider'

import useMotionState from './useMotionState'

export const useSequentialPurchaseState = (unitId: EGameUnit, elementId: string, type: ElementType) => {
  const { getElementsForUnit, items, upgrades } = useInventoryContext()

  const elements = getElementsForUnit(unitId, type)
  const elementIds = Object.keys(elements)
  const currentIndex = elementIds.indexOf(elementId)

  if (currentIndex === 0) return true

  if (currentIndex > 0) {
    const previousElementId = elementIds[currentIndex - 1]
    const previousElement = type === 'item'
      ? items[unitId]?.[previousElementId]
      : upgrades[unitId]?.[previousElementId]

    if (!previousElement) return false
    return useMotionState(previousElement.purchased, (value) => value)
  }

  return false
}
