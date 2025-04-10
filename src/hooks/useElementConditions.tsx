import { useCallback } from 'react'

import { ElementTypes } from 'types/store'

type ConditionsOptions = {
  getTotalResource: (unitId: string) => number
  getCurrentResource: (unitId: string) => number
}

export function useElementConditions ({
  getTotalResource,
  getCurrentResource
}: ConditionsOptions) {
  const shouldDisplayElement = useCallback(<T extends keyof ElementTypes>(
    element: ElementTypes[T]
  ): boolean => {
    if (!element || !element.apparitionCondition) return false

    const { unitId, value } = element.apparitionCondition
    const totalResource = getTotalResource(unitId)

    return totalResource >= value
  }, [getTotalResource])

  const canBuyElement = useCallback(<T extends keyof ElementTypes>(
    element: ElementTypes[T]
  ): boolean => {
    if (!element || !element.cost) return false
    if (!shouldDisplayElement(element)) return false

    // Pour les upgrades, vérifier si déjà acheté
    if (element._type === 'upgrade' && (element as any).purchased?.get?.())
      return false

    const { unitId, value } = element.cost
    const currentResource = getCurrentResource(unitId)

    return currentResource >= value
  }, [getCurrentResource, shouldDisplayElement])

  return {
    shouldDisplayElement,
    canBuyElement
  }
}
