import React, { createContext, useContext, useEffect } from 'react'

import { MotionValue, useMotionValue } from 'motion/react'
import { EGameUnit, ElementTypes, GameStateElement, ItemType, OtherShopElementType, SectorType, UpgradeType } from 'types/store'
import { getItemPrice } from 'helpers/units'

import itemsData from '../data/items.json'
import upgradesData from '../data/upgrades.json'
import sectorsData from '../data/sectors.json'
import otherShopElementsData from '../data/otherShopElements.json'

import { BaseProviderProps } from './GlobalProvider'
import { UnitMultiplierGetter, useGameProviderContext } from './GameProvider'

type InventoryType = {
  items: Record<string, Record<string, ItemType>>
  upgrades: Record<string, Record<string, UpgradeType>>
  sectors: Record<string, Record<string, SectorType>>
  otherShopElements: Record<string, Record<string, OtherShopElementType>>

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
  getSectorCount: (unitId: EGameUnit, sectorId: string) => number
  getItemPurchased: (unitId: EGameUnit, itemId: string) => boolean
  getUpgradePurchased: (unitId: EGameUnit, upgradeId: string) => boolean
  getSectorPurchased: (unitId: EGameUnit, sectorId: string) => boolean
  getOtherShopElementPurchased: (unitId: EGameUnit, elementId: string) => boolean
  setItemCount: (unitId: EGameUnit, itemId: string, count: number) => void
  setUpgradeCount: (unitId: EGameUnit, upgradeId: string, count: number) => void
  setSectorCount: (unitId: EGameUnit, sectorId: string, count: number) => void
  setItemPurchased: (unitId: EGameUnit, itemId: string) => void
  setUpgradePurchased: (unitId: EGameUnit, upgradeId: string) => void
  setSectorPurchased: (unitId: EGameUnit, sectorId: string) => void
  getUnitMultiplier: (unitId: EGameUnit) => number
  getItemProduction: (unitId: EGameUnit) => number
  setElementCount: (unitId: EGameUnit, elementId: string, count: number) => void
  setElementPurchased: (unitId: EGameUnit, elementId: string) => void
  loadElements: (data: Record<string, Record<string, GameStateElement>>) => void
}

export const InventoryContext = createContext<InventoryType | null>(null)

let context: InventoryType

export const InventoryProvider = ({ children }: BaseProviderProps) => {
  const { getUnit, setUnitMultiplierGetter, modifyUnitValue, updateValueByAction } = useGameProviderContext()

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

  const sectors: Record<string, Record<string, SectorType>> = {}
  Object.entries(sectorsData.sectors).forEach(([unitId, unitSectors]) => {
    sectors[unitId] = {}
    unitSectors.forEach((sector: any) => {
      sectors[unitId][sector._id] = {
        ...sector,
        count: useMotionValue(0),
        purchased: useMotionValue(false)
      }
    })
  })

  const otherShopElements: Record<string, Record<string, OtherShopElementType>> = {}
  Object.entries(otherShopElementsData.otherShopElements).forEach(([unitId, elements]) => {
    otherShopElements[unitId] = {}
    elements.forEach((element: any) => {
      otherShopElements[unitId][element._id] = {
        ...element,
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
      case 'sector':
        return sectors[unitId]?.[id] as ElementTypes[T]
      case 'otherShopElement':
        return otherShopElements[unitId]?.[id] as ElementTypes[T]
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
      case 'sector':
        return sectors[unitId] as Record<string, ElementTypes[T]> || {}
      case 'otherShopElement':
        return otherShopElements[unitId] as Record<string, ElementTypes[T]> || {}
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

    const count = getItemCount(unitId, id)
    const cost = getItemPrice(element.cost.value, count)
    return resource.get() >= cost
  }

  const buyElement = <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T): void => {
    if (!canBuyElement(unitId, id, type)) return

    const element = getElement(unitId, id, type)
    const resource = getResourceByUnitId(element.cost.unitId)
    if (!resource) return

    // Deduct cost
    const count = getItemCount(unitId, id)
    const cost = getItemPrice(element.cost.value, count)
    resource.set(resource.get() - cost)

    // Increment item count or mark as purchased
    if (type === 'item') {
      const newCount = (element as ItemType).count.get() + 1;
      (element as ItemType).count.set(newCount)
    } else if (type === 'upgrade') {
      (element as UpgradeType).purchased.set(true)
    } else if (type === 'sector') {
      (element as SectorType).purchased.set(true)
    }
  }

  const getElementsForUnit = <T extends keyof ElementTypes>(unitId: EGameUnit, type: T): Record<string, ElementTypes[T]> => {
    const allElements = getAllElements(unitId, type)
    const visibleElements: Record<string, ElementTypes[T]> = {}

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

  const getSectorCount = (unitId: EGameUnit, sectorId: string): number => {
    return sectors[unitId]?.[sectorId]?.count.get() || 0
  }

  const getItemPurchased = (unitId: EGameUnit, itemId: string): boolean => {
    return items[unitId]?.[itemId]?.purchased.get() || false
  }

  const getUpgradePurchased = (unitId: EGameUnit, upgradeId: string): boolean => {
    return upgrades[unitId]?.[upgradeId]?.purchased.get() || false
  }

  const getSectorPurchased = (unitId: EGameUnit, sectorId: string): boolean => {
    return sectors[unitId]?.[sectorId]?.purchased.get() || false
  }
  const getOtherShopElementPurchased = (unitId: EGameUnit, elementId: string): boolean => {
    return otherShopElements[unitId]?.[elementId]?.purchased.get() || false
  }

  const setItemCount = (unitId: EGameUnit, itemId: string, count: number): void => {
    if (items[unitId]?.[itemId]) items[unitId][itemId].count.set(count)
  }

  const setUpgradeCount = (unitId: EGameUnit, upgradeId: string, count: number): void => {
    if (upgrades[unitId]?.[upgradeId]) upgrades[unitId][upgradeId].count.set(count)
  }

  const setSectorCount = (unitId: EGameUnit, sectorId: string, count: number): void => {
    if (sectors[unitId]?.[sectorId]) sectors[unitId][sectorId].count.set(count)
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

  const setSectorPurchased = (unitId: EGameUnit, sectorId: string): void => {
    if (sectors[unitId]?.[sectorId]) {
      sectors[unitId][sectorId].count.set(1)
      sectors[unitId][sectorId].purchased.set(true)
    }
  }

  const setOtherShopElementPurchased = (unitId: EGameUnit, sectorId: string): void => {
    if (otherShopElements[unitId]?.[sectorId]) {
      otherShopElements[unitId][sectorId].count.set(1)
      otherShopElements[unitId][sectorId].purchased.set(true)
    }
  }

  const setElementPurchased = (unitId: EGameUnit, elementId: string): void => {
    if (items[unitId]?.[elementId]) {
      items[unitId][elementId].count.set(1)
      items[unitId][elementId].purchased.set(true)
    } else if (upgrades[unitId]?.[elementId]) {
      upgrades[unitId][elementId].count.set(1)
      upgrades[unitId][elementId].purchased.set(true)
    } else if (sectors[unitId]?.[elementId]) {
      sectors[unitId][elementId].count.set(1)
      sectors[unitId][elementId].purchased.set(true)
    } else if (otherShopElements[unitId]?.[elementId]) {
      otherShopElements[unitId][elementId].count.set(1)
      otherShopElements[unitId][elementId].purchased.set(true)
    }
  }

  const buyElementFromShop = <T extends keyof ElementTypes>(unitId: EGameUnit, id: string, type: T): void => {
    if (!canBuyElement(unitId, id, type)) return

    const element = getElement(unitId, id, type)
    const resource = getResourceByUnitId(element.cost.unitId)
    if (!resource) return

    const count = getItemCount(unitId, id)
    const cost = getItemPrice(element.cost.value, count)

    modifyUnitValue(unitId, -cost)

    if (type === 'item') setItemPurchased(unitId, id)
    else if (type === 'upgrade') setUpgradePurchased(unitId, id)
    else if (type === 'sector') setSectorPurchased(unitId, id)
    else if (type === 'otherShopElement') setOtherShopElementPurchased(unitId, id)
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
        if (element.purchased) setElementPurchased(unitId as EGameUnit, elementId)

        // set the count after the setElementPurchased to avoid race condition
        if (element.count > 0) setElementCount(unitId as EGameUnit, elementId, element.count)
      })
    })
  }

  useEffect(() => {
    setUnitMultiplierGetter(getUnitMultiplier)
  }, [setUnitMultiplierGetter])

  context = {
    items,
    upgrades,
    sectors,
    otherShopElements,
    getElement,
    getAllElements,
    canBuyElement,
    buyElement,
    buyElementFromShop,
    getElementsForUnit,
    shouldDisplayElement,
    getItemCount,
    getUpgradeCount,
    getSectorCount,
    getItemPurchased,
    getUpgradePurchased,
    getSectorPurchased,
    getOtherShopElementPurchased,
    setItemCount,
    setUpgradeCount,
    setSectorCount,
    setItemPurchased,
    setUpgradePurchased,
    setSectorPurchased,
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
