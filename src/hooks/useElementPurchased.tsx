import { useInventoryContext } from 'provider/InventoryProvider'
import { ElementType } from 'types/store'

import useMotionState from './useMotionState'

const useElementPurchased = (unitId: string, elementId: string, type: ElementType) => {
  const { items, upgrades } = useInventoryContext()
  const purchasedMotionValue = type === 'item'
    ? items[unitId]?.[elementId]?.purchased
    : upgrades[unitId]?.[elementId]?.purchased
  return useMotionState(purchasedMotionValue)
}

export default useElementPurchased
