import { Unit, UnitsState, Upgrade, Item } from 'types/store'
import { create } from 'zustand'

import unitsData from 'data/units.json'

const storeKey = import.meta.env.VITE_LOCAL_STORAGE_KEY

const getStoredValue = <T>(key: string, defaultValue: T): T => {
  try {
    const savedData = localStorage.getItem(storeKey)

    if (!savedData) return defaultValue

    const parsed = JSON.parse(savedData)

    return key in parsed ? parsed[key] : defaultValue
  } catch (error) {
    console.error('Error while parsing localStorage data:', error)
    return defaultValue
  }
}

const initializeUnit = (unitData: Unit): Unit => {
  const storedUnits = getStoredValue<Record<string, Unit>>('units', {})
  const storedUnit = storedUnits[unitData._id]

  if (!storedUnit) return { ...unitData }

  return {
    ...unitData,
    count: storedUnit.count ?? unitData.count,
    action: {
      ...unitData.action,
      valueByAction: storedUnit.action?.valueByAction ?? unitData.action.valueByAction,
      duration: storedUnit.action?.duration ?? unitData.action.duration
    },
    items: storedUnit.items ?? unitData.items,
    upgrades: storedUnit.upgrades ?? unitData.upgrades
  }
}

const initialUnits = unitsData.units.reduce<Record<string, Unit>>((acc, unit) => {
  acc[unit._id] = initializeUnit(unit as Unit)

  return acc
}, {})

const useUnitsStore = create<UnitsState>((set, get) => ({
  units: initialUnits,
  getUnit: (unitId: string) => get().units[unitId],
  updateUnitCount: (unitId: string, amount: number) => {
    set((state: any) => ({
      units: {
        ...state.units,
        [unitId]: {
          ...state.units[unitId],
          count: (state.units[unitId]?.count || 0) + amount
        }
      }
    }))
  },
  updateValueByAction: (unitId: string, newValue: number) => {
    set((state: any) => ({
      units: {
        ...state.units,
        [unitId]: {
          ...state.units[unitId],
          action: {
            ...state.units[unitId].action,
            valueByAction: newValue
          }
        }
      }
    }))
  },
  updateActionDuration: (unitId: string, duration: number) => {
    set((state: any) => ({
      units: {
        ...state.units,
        [unitId]: {
          ...state.units[unitId],
          action: {
            ...state.units[unitId].action,
            duration
          }
        }
      }
    }))
  },
  addItem: (unitId: string, item: Item) => {
    set((state) => {
      const unit = state.units[unitId]
      if (!unit) return state

      const currentItems = unit.items || []

      // Vérifier si l'item existe déjà
      const itemExists = currentItems.some(existingItem => existingItem._id === item._id)
      if (itemExists) return state

      return {
        units: {
          ...state.units,
          [unitId]: {
            ...unit,
            items: [...currentItems, item]
          }
        }
      }
    })
  },
  addUpgrade: (unitId: string, upgrade: Upgrade) => {
    set((state) => {
      const unit = state.units[unitId]
      if (!unit) return state

      const currentUpgrades = unit.upgrades || []

      // Vérifier si l'upgrade existe déjà
      const upgradeExists = currentUpgrades.some(existingUpgrade => existingUpgrade._id === upgrade._id)
      if (upgradeExists) return state

      return {
        units: {
          ...state.units,
          [unitId]: {
            ...unit,
            upgrades: [...currentUpgrades, upgrade]
          }
        }
      }
    })
  },
  performAction: (unitId: string) => {
    const unit = get().units[unitId]
    if (!unit) return

    get().updateUnitCount(unitId, unit.action.valueByAction)
  },
  resetStore: () => {
    set({
      units: initialUnits
    })
  }
}))

export default useUnitsStore
