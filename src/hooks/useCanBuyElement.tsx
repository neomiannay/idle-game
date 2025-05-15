import { useInventoryContext } from 'provider/InventoryProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { ElementType } from 'types/store'

import useMotionState from './useMotionState'

const useCanBuyElement = (unitId: string, elementId: string, type: ElementType) => {
  const { getElement, shouldDisplayElement } = useInventoryContext()
  const { getUnit } = useGameProviderContext()

  const element = getElement(unitId, elementId, type)
  if (!element) return false

  const shouldDisplay = shouldDisplayElement(unitId, elementId, type)
  if (!shouldDisplay) return false

  const resource = getUnit(element.cost.unitId)?.motionValue
  if (!resource) return false

  return useMotionState(resource, (value) => value >= element.cost.value)
}

export default useCanBuyElement
