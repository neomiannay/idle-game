import React, {
  createContext,
  useContext,
  useMemo
} from 'react'

import useUnitsStore from 'store/useUnitsStore'
import { Item, Upgrade, Unit } from 'types/store'

interface ApparitionEntity {
  _id: string
  unitId: string
  apparitionCondition?: {
    unitId: string
    value: number
  }
}

type VisibilityContextType = {
  visibleEntities: {
    units: string[]
    items: Record<string, string[]>
    upgrades: Record<string, string[]>
  }
}

const VisibilityContext = createContext<VisibilityContextType>({
  visibleEntities: {
    units: ['actif'],
    items: {},
    upgrades: {}
  }
})

type VisibilityProviderProps = {
  items: Record<string, Item[]>
  upgrades: Record<string, Upgrade[]>
}

export const VisibilityProvider: React.FC<React.PropsWithChildren<VisibilityProviderProps>> = ({
  children,
  items: itemsData,
  upgrades: upgradesData
}) => {
  const units = useUnitsStore(state => state.units)

  // Generic function to check entity visibility with force unlock and persistence
  const checkEntityVisibility = <T extends ApparitionEntity>(
    entities: T[],
    units: Record<string, Unit>
  ): string[] => {
    return entities.reduce<string[]>((visibleIds, entity) => {
      // No condition means always visible
      if (!entity.apparitionCondition) {
        if (!visibleIds.includes(entity._id)) visibleIds.push(entity._id)
        return visibleIds
      }

      // Check apparition condition
      const { unitId: conditionUnitId, value: requiredValue } = entity.apparitionCondition
      const conditionUnit = units[conditionUnitId]
      const currentUnit = units[entity._id]

      // Visible if:
      // 1. Condition is met, OR
      // 2. Unit was previously force unlocked, OR
      // 3. Unit was already visible before dropping below condition
      const isConditionMet = conditionUnit && conditionUnit.count >= requiredValue
      const wasForceUnlocked = currentUnit && currentUnit.isForceUnlocked
      const wasAlreadyVisible = currentUnit && currentUnit.wasVisibleBefore

      if (isConditionMet || wasForceUnlocked || wasAlreadyVisible) {
        if (!visibleIds.includes(entity._id)) {
          // Mark that this unit was visible
          if (currentUnit)
            currentUnit.wasVisibleBefore = true

          visibleIds.push(entity._id)
        }
      }

      return visibleIds
    }, [])
  }

  // Convert units to ApparitionEntity for visibility check
  const unitsAsEntities: ApparitionEntity[] = Object.values(units).map(unit => ({
    _id: unit._id,
    unitId: unit._id,
    apparitionCondition: unit.apparitionCondition
  }))

  // Compute visible entities
  const visibleEntities = useMemo(() => {
    return {
      // Always start with 'actif' unit
      units: ['actif', ...checkEntityVisibility(
        unitsAsEntities.filter(u => u._id !== 'actif'),
        units
      )],

      // Compute visible items for each unit
      items: Object.entries(itemsData).reduce<Record<string, string[]>>((acc, [unitId, unitItems]) => {
        acc[unitId] = checkEntityVisibility(unitItems, units)
        return acc
      }, {}),

      // Compute visible upgrades for each unit
      upgrades: Object.entries(upgradesData).reduce<Record<string, string[]>>((acc, [unitId, unitUpgrades]) => {
        acc[unitId] = checkEntityVisibility(unitUpgrades, units)
        return acc
      }, {})
    }
  }, [units, itemsData, upgradesData])

  return (
    <VisibilityContext.Provider value={{ visibleEntities }}>
      { children }
    </VisibilityContext.Provider>
  )
}

export const useVisibility = () => {
  const context = useContext(VisibilityContext)
  if (!context)
    throw new Error('useVisibility must be used within a VisibilityProvider')

  return context
}
