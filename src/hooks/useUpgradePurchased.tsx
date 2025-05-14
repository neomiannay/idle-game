import { useInventoryContext } from 'provider/InventoryProvider'

import useMotionState from './useMotionState'

export const useUpgradePurchased = (unitId: string, upgradeId: string) => {
  const { upgrades } = useInventoryContext()
  const purchasedMotionValue = upgrades[unitId]?.[upgradeId]?.purchased
  return useMotionState(purchasedMotionValue)
}
