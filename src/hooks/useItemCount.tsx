import { useInventoryContext } from 'provider/InventoryProvider'
import { EGameUnit } from 'types/store'

import useMotionState from './useMotionState'

const useItemCount = (unitId: EGameUnit, itemId: string) => {
  const { getElement } = useInventoryContext()
  const item = getElement(unitId, itemId, 'item')

  if (!item) return 0

  return useMotionState(item.count, value => value)
}

export default useItemCount
