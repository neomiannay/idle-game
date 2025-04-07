import { Unit } from 'types/store'

export interface VisibilityEntity {
  _id: string;
  unitId: string;
  apparitionCondition?: {
    unitId: string;
    value: number;
  };
  _wasVisibleBefore?: boolean; // Ajouté à l'interface générique
}

export function createVisibilityManager<T extends VisibilityEntity> (
  entities: T[],
  units: Record<string, Unit>
): {
  visibleEntities: string[];
  managedEntities: T[];
} {
  const managedEntities = entities.map(entity => ({
    ...entity,
    _wasVisibleBefore: entity._wasVisibleBefore || false
  }))

  const visibleEntities = managedEntities.reduce<string[]>((visibleIds, entity) => {
    // Pas de condition = toujours visible
    if (!entity.apparitionCondition) {
      if (!visibleIds.includes(entity._id)) {
        visibleIds.push(entity._id)
        entity._wasVisibleBefore = true
      }
      return visibleIds
    }

    const { unitId: conditionUnitId, value: requiredValue } = entity.apparitionCondition
    const conditionUnit = units[conditionUnitId]
    const currentUnit = units[entity._id]

    // Conditions de visibilité :
    // 1. Condition respectée
    // 2. Déjà rendu visible précédemment
    // 3. Débloquage forcé
    const isConditionMet = conditionUnit && conditionUnit.count >= requiredValue
    const wasAlreadyVisible = entity._wasVisibleBefore
    const wasForceUnlocked = currentUnit && currentUnit.isForceUnlocked

    if (isConditionMet || wasAlreadyVisible || wasForceUnlocked) {
      if (!visibleIds.includes(entity._id)) {
        visibleIds.push(entity._id)
        entity._wasVisibleBefore = true
      }
    }

    return visibleIds
  }, [])

  return { visibleEntities, managedEntities }
}
