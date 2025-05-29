import { useInventoryContext } from 'provider/InventoryProvider'
import { ElementType } from 'types/store'

import useMotionState from './useMotionState'

const useElementPurchased = (unitId: string, elementId: string, type: ElementType) => {
  const { items, upgrades } = useInventoryContext()

  const src = type === 'item'
    ? items
    : upgrades

  const purchasedMotionValue = src[unitId]?.[elementId]?.purchased

  if (!purchasedMotionValue) return false

  return useMotionState(purchasedMotionValue)
}

export default useElementPurchased
