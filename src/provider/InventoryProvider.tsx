import React, { createContext, useContext, useEffect } from 'react'

import { MotionValue, useMotionValue } from 'motion/react'
import { EGameUnit, ElementTypes, GameStateElement, ItemType, UpgradeType } from 'types/store'

import itemsData from '../data/items.json'
import upgradesData from '../data/upgrades.json'

import { BaseProviderProps } from './GlobalProvider'
import { UnitMultiplierGetter, useGameProviderContext } from './GameProvider'

type InventoryType = {
  items: Record<string, Record<string, ItemType>>
  upgrades: Record<string, Record<string, UpgradeType>>

  // Methods
  getElement: <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T) => ElementTypes[T]
  getAllElements: <T extends keyof ElementTypes>(unitId: EGameUnit, type: T) => Record<string, ElementTypes[T]>
  canBuyElement: <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T) => boolean
  buyElement: <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T) => void
  buyElementFromShop: <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T) => void
  getElementsForUnit: <T extends keyof ElementTypes>(unitId: EGameUnit, type: T) => Record<string, ElementTypes[T]>
  shouldDisplayElement: <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T) => boolean
  getItemCount: (unitId: EGameUnit, itemId: string) => number
  getUpgradeCount: (unitId: EGameUnit, upgradeId: string) => number
  getItemPurchased: (unitId: EGameUnit, itemId: string) => boolean
  getUpgradePurchased: (unitId: EGameUnit, upgradeId: string) => boolean
  setItemCount: (unitId: EGameUnit, itemId: string, count: number) => void
  setUpgradeCount: (unitId: EGameUnit, upgradeId: string, count: number) => void
  setItemPurchased: (unitId: EGameUnit, itemId: string) => void
  setUpgradePurchased: (unitId: EGameUnit, upgradeId: string) => void
  getUnitMultiplier: (unitId: EGameUnit) => number
  getItemProduction: (unitId: EGameUnit) => number
  setElementCount: (unitId: EGameUnit, elementId: string, count: number) => void
  setElementPurchased: (unitId: EGameUnit, elementId: string) => void
  loadElements: (data: Record<string, Record<string, GameStateElement>>) => void
}

export const InventoryContext = createContext<InventoryType | null>(null)

let context: InventoryType

export const InventoryProvider = ({ children }: BaseProviderProps) => {
  const { getUnit, setUnitMultiplierGetter, updateValueByAction } = useGameProviderContext()

  const items: Record<string, Record<string, ItemType>> = {}
  Object.entries(itemsData.items).forEach(([unitId, unitItems]) => {
    items[unitId] = {}
    unitItems.forEach((item: any) => {
      items[unitId][item._id] = {
        ...item,
        count: useMotionValue(0),
        purchased: useMotionValue(false)
      }
    })
  })

  const upgrades: Record<string, Record<string, UpgradeType>> = {}
  Object.entries(upgradesData.upgrades).forEach(([unitId, unitUpgrades]) => {
    upgrades[unitId] = {}
    unitUpgrades.forEach((upgrade: any) => {
      upgrades[unitId][upgrade._id] = {
        ...upgrade,
        count: useMotionValue(0),
        purchased: useMotionValue(false)
      }
    })
  })

  const getElement = <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T): ElementTypes[T] => {
    switch (type) {
      case 'item':
        return items[unitId]?.[id] as ElementTypes[T]
      case 'upgrade':
        return upgrades[unitId]?.[id] as ElementTypes[T]
      default:
        throw new Error(`Unknown element type: ${type}`)
    }
  }

  const getAllElements = <T extends keyof ElementTypes>(unitId: EGameUnit, type: T): Record<string, ElementTypes[T]> => {
    switch (type) {
      case 'item':
        return items[unitId] as Record<string, ElementTypes[T]> || {}
      case 'upgrade':
        return upgrades[unitId] as Record<string, ElementTypes[T]> || {}
      default:
        throw new Error(`Unknown element type: ${type}`)
    }
  }

  const getResourceByUnitId = (unitId: EGameUnit): MotionValue<number> | null => {
    const unit = getUnit(unitId)
    if (!unit) return null
    return unit.motionValue
  }

  const getTotalResourceByUnitId = (unitId: EGameUnit): MotionValue<number> | null => {
    const unit = getUnit(unitId)
    if (!unit) return null
    return unit.totalMotionValue
  }

  const shouldDisplayElement = <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T): boolean => {
    const element = getElement(unitId, id, type)
    if (!element) return false

    const conditionUnit = getTotalResourceByUnitId(element.apparitionCondition.unitId)
    if (!conditionUnit) return false

    return conditionUnit.get() >= element.apparitionCondition.value
  }

  const canBuyElement = <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T): boolean => {
    const element = getElement(unitId, id, type)
    if (!element) return false

    if (!shouldDisplayElement(unitId, id, type)) return false

    const resource = getResourceByUnitId(element.cost.unitId)
    if (!resource) return false

    return resource.get() >= element.cost.value
  }

  const buyElement = <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T): void => {
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
    } else if (type === 'upgrade') {
      (element as UpgradeType).purchased.set(true)
    }
  }

  const getElementsForUnit = <T extends keyof ElementTypes>(unitId: EGameUnit, type: T): Record<string, ElementTypes[T]> => {
    const allElements = getAllElements(unitId, type)
    const visibleElements: Record<string, ItemType | UpgradeType> = {}

    Object.entries(allElements).forEach(([elementId, element]) => {
      if (shouldDisplayElement(unitId, elementId, type)) visibleElements[elementId] = element
    })

    return visibleElements as Record<string, ElementTypes[T]>
  }

  // Get item count
  const getItemCount = (unitId: EGameUnit, itemId: string): number => {
    return items[unitId]?.[itemId]?.count.get() || 0
  }

  const getUpgradeCount = (unitId: EGameUnit, upgradeId: string): number => {
    return upgrades[unitId]?.[upgradeId]?.count.get() || 0
  }

  const getItemPurchased = (unitId: EGameUnit, itemId: string): boolean => {
    return items[unitId]?.[itemId]?.purchased.get() || false
  }

  const getUpgradePurchased = (unitId: EGameUnit, upgradeId: string): boolean => {
    return upgrades[unitId]?.[upgradeId]?.purchased.get() || false
  }

  const setItemCount = (unitId: EGameUnit, itemId: string, count: number): void => {
    if (items[unitId]?.[itemId])
      items[unitId][itemId].count.set(count)
  }

  const setUpgradeCount = (unitId: EGameUnit, upgradeId: string, count: number): void => {
    if (upgrades[unitId]?.[upgradeId])
      upgrades[unitId][upgradeId].count.set(count)
  }

  const setElementCount = (unitId: EGameUnit, elementId: string, count: number): void => {
    if (items[unitId]?.[elementId])
      items[unitId][elementId].count.set(count)
    else if (upgrades[unitId]?.[elementId])
      upgrades[unitId][elementId].count.set(1) // we force the upgrade count to 1 only
  }

  const setItemPurchased = (unitId: EGameUnit, itemId: string): void => {
    if (items[unitId]?.[itemId]) {
      items[unitId][itemId].count.set(1)
      items[unitId][itemId].purchased.set(true)
    }
  }

  const setUpgradePurchased = (unitId: EGameUnit, upgradeId: string): void => {
    if (upgrades[unitId]?.[upgradeId]) {
      updateValueByAction(unitId, upgrades[unitId][upgradeId].valueByAction)
      upgrades[unitId][upgradeId].count.set(1)
      upgrades[unitId][upgradeId].purchased.set(true)
    }
  }

  const setElementPurchased = (unitId: EGameUnit, elementId: string): void => {
    if (items[unitId]?.[elementId]) {
      items[unitId][elementId].count.set(1)
      items[unitId][elementId].purchased.set(true)
    } else if (upgrades[unitId]?.[elementId]) {
      upgrades[unitId][elementId].count.set(1)
      upgrades[unitId][elementId].purchased.set(true)
    }
  }

  const buyElementFromShop = <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T): void => {
    if (!canBuyElement(unitId, id, type)) return

    const element = getElement(unitId, id, type)
    const resource = getResourceByUnitId(element.cost.unitId)
    if (!resource) return

    resource.set(resource.get() - element.cost.value)

    if (type === 'item') setItemPurchased(unitId, id)
    else if (type === 'upgrade') setUpgradePurchased(unitId, id)
  }

  // Calculate unit multiplier based on purchased upgrades
  const getUnitMultiplier: UnitMultiplierGetter = (unitId: EGameUnit): number => {
    let multiplier = 1
    const unitUpgrades = upgrades[unitId] || {}

    Object.values(unitUpgrades).forEach(upgrade => {
      if (upgrade.purchased.get())
        multiplier += upgrade.valueByAction - 1
    })

    return multiplier
  }

  // Calculate production from items for a specific unit
  const getItemProduction = (unitId: EGameUnit): number => {
    let production = 0
    const unitItems = items[unitId] || {}

    Object.values(unitItems).forEach(item => {
      production += item.count.get() * item.unitByTime
    })

    return production
  }

  const loadElements = (data: Record<EGameUnit, Record<string, GameStateElement>>) => {
    Object.entries(data).forEach(([unitId, unitElements]) => {
      Object.entries(unitElements).forEach(([elementId, element]) => {
        if (element.count > 0) setElementCount(unitId as EGameUnit, elementId, element.count)
        if (element.purchased) setElementPurchased(unitId as EGameUnit, elementId)
      })
    })
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
    buyElementFromShop,
    getElementsForUnit,
    shouldDisplayElement,
    getItemCount,
    getUpgradeCount,
    getItemPurchased,
    getUpgradePurchased,
    setItemCount,
    setUpgradeCount,
    setItemPurchased,
    setUpgradePurchased,
    getUnitMultiplier,
    getItemProduction,
    setElementCount,
    setElementPurchased,
    loadElements
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
