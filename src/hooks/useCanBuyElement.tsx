import { useInventoryContext } from 'provider/InventoryProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit, ElementType } from 'types/store'
import { getItemPrice } from 'helpers/units'

import useMotionState from './useMotionState'

const useCanBuyElement = (unitId: EGameUnit, elementId: string, type: ElementType, count: number) => {
  const { getElement, shouldDisplayElement } = useInventoryContext()
  const { getUnit } = useGameProviderContext()

  const element = getElement(unitId, elementId, type)
  if (!element) return false

  const shouldDisplay = shouldDisplayElement(unitId, elementId, type)
  if (!shouldDisplay) return false

  const resource = getUnit(element.cost.unitId)?.motionValue
  if (!resource) return false

  const cost = getItemPrice(element.cost.value, count)
  return useMotionState(resource, (value) => value >= cost)
}

export default useCanBuyElement
