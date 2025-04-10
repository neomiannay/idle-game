import React, { createContext, useContext, useEffect } from 'react'

import { MotionValue, useMotionValue } from 'motion/react'
import { ElementTypes, ItemType, UpgradeType } from 'types/store'

import itemsData from '../data/items.json'
import upgradesData from '../data/upgrades.json'

import { BaseProviderProps } from './GlobalProvider'
import { UnitMultiplierGetter, useGameProviderContext } from './GameProvider'

type InventoryType = {
  items: Record<string, Record<string, ItemType>>
  upgrades: Record<string, Record<string, UpgradeType>>

  // Methods
  getElement: <T extends keyof ElementTypes>(unitId: string, id: string, type: T) => ElementTypes[T]
  getAllElements: <T extends keyof ElementTypes>(unitId: string, type: T) => Record<string, ElementTypes[T]>
  canBuyElement: <T extends keyof ElementTypes>(unitId: string, id: string, type: T) => boolean
  buyElement: <T extends keyof ElementTypes>(unitId: string, id: string, type: T) => void
  getElementsForUnit: <T extends keyof ElementTypes>(unitId: string, type: T) => Record<string, ElementTypes[T]>
  shouldDisplayElement: <T extends keyof ElementTypes>(unitId: string, id: string, type: T) => boolean
  getItemCount: (unitId: string, itemId: string) => number
  getUpgradeCount: (unitId: string, upgradeId: string) => number
  setItemCount: (unitId: string, itemId: string, count: number) => void
  setUpgradeCount: (unitId: string, upgradeId: string, count: number) => void
  getUnitMultiplier: (unitId: string) => number
  getItemProduction: (unitId: string) => number
}

export const InventoryContext = createContext<InventoryType | null>(null)

let context: InventoryType

export const InventoryProvider = ({ children }: BaseProviderProps) => {
  const { getUnit, setUnitMultiplierGetter } = useGameProviderContext()

  const items: Record<string, Record<string, ItemType>> = {}
  Object.entries(itemsData.items).forEach(([unitId, unitItems]) => {
    items[unitId] = {}
    unitItems.forEach((item: any) => {
      items[unitId][item._id] = {
        ...item,
        count: useMotionValue(0)
      }
    })
  })

  const upgrades: Record<string, Record<string, UpgradeType>> = {}
  Object.entries(upgradesData.upgrades).forEach(([unitId, unitUpgrades]) => {
    upgrades[unitId] = {}
    unitUpgrades.forEach((upgrade: any) => {
      upgrades[unitId][upgrade._id] = {
        ...upgrade,
        purchased: useMotionValue(false)
      }
    })
  })

  const getElement = <T extends keyof ElementTypes>(unitId: string, id: string, type: T): ElementTypes[T] => {
    if (type === 'item')
      return items[unitId]?.[id] as ElementTypes[T]
    else
      return upgrades[unitId]?.[id] as ElementTypes[T]
  }

  const getAllElements = <T extends keyof ElementTypes>(unitId: string, type: T): Record<string, ElementTypes[T]> => {
    const unit = type === 'item' ? items[unitId] : upgrades[unitId]
    return unit as Record<string, ElementTypes[T]> || {}
  }

  const getResourceByUnitId = (unitId: string): MotionValue<number> | null => {
    const unit = getUnit(unitId)
    if (!unit) return null
    return unit.motionValue
  }

  const getTotalResourceByUnitId = (unitId: string): MotionValue<number> | null => {
    const unit = getUnit(unitId)
    if (!unit) return null
    return unit.totalMotionValue
  }

  const shouldDisplayElement = <T extends keyof ElementTypes>(unitId: string, id: string, type: T): boolean => {
    const element = getElement(unitId, id, type)
    if (!element) return false

    const conditionUnit = getTotalResourceByUnitId(element.apparitionCondition.unitId)
    if (!conditionUnit) return false

    return conditionUnit.get() >= element.apparitionCondition.value
  }

  const canBuyElement = <T extends keyof ElementTypes>(unitId: string, id: string, type: T): boolean => {
    const element = getElement(unitId, id, type)
    if (!element) return false

    if (!shouldDisplayElement(unitId, id, type)) return false
    if (type === 'upgrade' && (element as UpgradeType).purchased.get()) return false

    const resource = getResourceByUnitId(element.cost.unitId)
    if (!resource) return false

    return resource.get() >= element.cost.value
  }

  const buyElement = <T extends keyof ElementTypes>(unitId: string, id: string, type: T): void => {
    if (!canBuyElement(unitId, id, type)) return

    const element = getElement(unitId, id, type)
    const resource = getResourceByUnitId(element.cost.unitId)
    if (!resource) return

    // Deduct cost
    resource.set(resource.get() - element.cost.value)

    // Increment item count or mark as purchased
    if (type === 'item') {
      const newCount = (element as ItemType).count.get() + 1;
      (element as ItemType).count.set(newCount)
      console.log(`Bought item ${id} for unit ${unitId}. New count: ${newCount}`)
    } else {
      (element as UpgradeType).purchased.set(true)
      console.log(`Bought upgrade ${id} for unit ${unitId}.`)
    }
  }

  const getElementsForUnit = <T extends keyof ElementTypes>(unitId: string, type: T): Record<string, ElementTypes[T]> => {
    const allElements = getAllElements(unitId, type)
    const visibleElements: Record<string, ItemType | UpgradeType> = {}

    Object.entries(allElements).forEach(([elementId, element]) => {
      if (shouldDisplayElement(unitId, elementId, type))
        visibleElements[elementId] = element
    })

    return visibleElements as Record<string, ElementTypes[T]>
  }

  // Get item count
  const getItemCount = (unitId: string, itemId: string): number => {
    return items[unitId]?.[itemId]?.count.get() || 0
  }

  const getUpgradeCount = (unitId: string, upgradeId: string): number => {
    return upgrades[unitId]?.[upgradeId]?.purchased.get() ? 1 : 0
  }

  const setItemCount = (unitId: string, itemId: string, count: number): void => {
    if (items[unitId]?.[itemId])
      items[unitId][itemId].count.set(count)
  }

  const setUpgradeCount = (unitId: string, upgradeId: string, count: number): void => {
    if (upgrades[unitId]?.[upgradeId])
      upgrades[unitId][upgradeId].purchased.set(count > 0)
  }

  // Calculate unit multiplier based on purchased upgrades
  const getUnitMultiplier: UnitMultiplierGetter = (unitId: string): number => {
    let multiplier = 1
    const unitUpgrades = upgrades[unitId] || {}

    Object.values(unitUpgrades).forEach(upgrade => {
      if (upgrade.purchased.get())
        multiplier += upgrade.valueByAction - 1
    })

    return multiplier
  }

  // Calculate production from items for a specific unit
  const getItemProduction = (unitId: string): number => {
    let production = 0
    const unitItems = items[unitId] || {}

    Object.values(unitItems).forEach(item => {
      production += item.count.get() * item.unitByTime
    })

    return production
  }

  useEffect(() => {
    setUnitMultiplierGetter(getUnitMultiplier)
  }, [setUnitMultiplierGetter])

  context = {
    items,
    upgrades,
    getElement,
    getAllElements,
    canBuyElement,
    buyElement,
    getElementsForUnit,
    shouldDisplayElement,
    getItemCount,
    getUpgradeCount,
    setItemCount,
    setUpgradeCount,
    getUnitMultiplier,
    getItemProduction
  }

  return (
    <InventoryContext.Provider value={ context }>
      { children }
    </InventoryContext.Provider>
  )
}

export const useInventoryContext = () => {
  const context = useContext(InventoryContext)
  if (!context) throw Error('useInventoryContext must be used inside an `InventoryProvider`')
  return context
}
