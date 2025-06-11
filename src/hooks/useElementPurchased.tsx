import { useMemo } from 'react'

import { useInventoryContext } from 'provider/InventoryProvider'
import { ElementType } from 'types/store'

import useMotionState from './useMotionState'

const useElementPurchased = (unitId: string, elementId: string, type: ElementType) => {
  const { items, upgrades, sectors, otherShopElements } = useInventoryContext()

  const src = useMemo(() => {
    if (type === 'item') return items
    if (type === 'upgrade') return upgrades
    if (type === 'sector') return sectors
    if (type === 'otherShopElement') return otherShopElements
    return null
  }, [items, upgrades, sectors, type])

  const purchasedMotionValue = src?.[unitId]?.[elementId]?.purchased || false

  if (!purchasedMotionValue) return false

  return useMotionState(purchasedMotionValue)
}

export default useElementPurchased
