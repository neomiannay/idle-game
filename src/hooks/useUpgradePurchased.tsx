import { useInventoryContext } from 'provider/InventoryProvider'
import { EGameUnit } from 'types/store'

import useMotionState from './useMotionState'

export const useUpgradePurchased = (unitId: EGameUnit, upgradeId: string) => {
  const { upgrades } = useInventoryContext()
  const purchasedMotionValue = upgrades[unitId]?.[upgradeId]?.purchased
  return useMotionState(purchasedMotionValue)
}
