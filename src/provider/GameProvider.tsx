import React, { createContext, useContext, useCallback, useState } from 'react'

import { MotionValue } from 'motion/react'
import useMotionState from 'hooks/useMotionState'
import { EGamePrice, EGameUnit, GameUnit } from 'types/store'
import { useUnitMotionValue } from 'hooks/useUnitMotionValue'

import { BaseProviderProps } from './GlobalProvider'
import { usePricesContext } from './PricesProvider'

export type UnitMultiplierGetter = (unitId: EGameUnit) => number;

const defaultUnitMultiplier: UnitMultiplierGetter = () => 1

type GameProviderType = {
  units: Record<EGameUnit, GameUnit>
  totalUnits: Record<EGameUnit, MotionValue<number>>
  getUnit: (unitId: EGameUnit) => GameUnit | null
  canDisplayUnit: (unitId: EGameUnit) => boolean
  canBuyUnit: (unitId: EGameUnit) => boolean
  buyUnit: (unitId: EGameUnit, multiplierGetter?: UnitMultiplierGetter) => void
  setUnitMultiplierGetter: (getter: UnitMultiplierGetter) => void
  updateDisplayConditions: () => void
  updateUnitDuration: (unitId: EGameUnit) => void
  updateValueByAction: (unitId: EGameUnit, addedValue: number) => void
  modifyUnitValue: (unitId: EGameUnit, value: number) => boolean | void,
  isSaleSuccessful: () => boolean
  hasEnoughUnits: (amountNeeded: number, unitNeeded: EGameUnit) => boolean
}

export const GameProviderContext = createContext<GameProviderType | null>(null)

let currentUnitMultiplierGetter: UnitMultiplierGetter = defaultUnitMultiplier

export function GameProvider ({ children }: BaseProviderProps) {
  const { getPrice } = usePricesContext()

  // Initialize motion values for units
  const actifUnit = useUnitMotionValue(0)
  const complexUnit = useUnitMotionValue(0)
  const saleUnit = useUnitMotionValue(0)
  const benefitsUnit = useUnitMotionValue(0)
  const reputationUnit = useUnitMotionValue(50)
  const karmaUnit = useUnitMotionValue(0)

  // Purchase conditions
  const canBuyActif = true
  const canBuyComplex = useMotionState(actifUnit.value, () => actifUnit.get() >= 10)
  const canBuySale = useMotionState(complexUnit.value, () => complexUnit.get() >= 1)
  const canBuyWithBenefits = useMotionState(benefitsUnit.value, () => benefitsUnit.get() >= 10) // 10 = how much benefits you need to fund a project/mini-game
  const canBuyWithReputation = useMotionState(reputationUnit.value, () => reputationUnit.get() >= 10) // 10 = how much reputation you need to fund a project/mini-game

  // Display conditions
  const canDisplayActif = true
  const [displayComplex, setDisplayComplex] = useState(false)
  const [displaySale, setDisplaySale] = useState(false)
  const [displayBenefits, setDisplayBenefits] = useState(false)

  const complexDuration = useUnitMotionValue(5000)
  const actifValueByAction = useUnitMotionValue(1)
  const complexValueByAction = useUnitMotionValue(1)

  const updateDisplayConditions = useCallback(() => {
    setDisplayComplex(actifUnit.getTotal() >= 100)
    setDisplaySale(complexUnit.getTotal() >= 5)
    setDisplayBenefits(saleUnit.getTotal() > 0)
  }, [actifUnit, complexUnit, saleUnit, reputationUnit])

  // Define the units
  const units: Record<EGameUnit, GameUnit> = {
    [EGameUnit.ACTIF]: {
      id: EGameUnit.ACTIF,
      rawValue: actifUnit,
      motionValue: actifUnit.value,
      totalMotionValue: actifUnit.total,
      displayCondition: canDisplayActif,
      purchaseCondition: canBuyActif,
      rawValueByAction: actifValueByAction,
      valueByAction: actifValueByAction.value
    },
    [EGameUnit.COMPLEX]: {
      id: EGameUnit.COMPLEX,
      rawValue: complexUnit,
      motionValue: complexUnit.value,
      totalMotionValue: complexUnit.total,
      displayCondition: displayComplex,
      purchaseCondition: canBuyComplex,
      costUnitId: EGameUnit.ACTIF,
      costAmount: 10,
      duration: complexDuration.value,
      rawValueByAction: complexValueByAction,
      valueByAction: complexValueByAction.value
    },
    [EGameUnit.SALE]: {
      id: EGameUnit.SALE,
      rawValue: saleUnit,
      motionValue: saleUnit.value,
      totalMotionValue: saleUnit.total,
      displayCondition: displaySale,
      purchaseCondition: canBuySale,
      costUnitId: EGameUnit.COMPLEX,
      costAmount: 1
    },
    [EGameUnit.BENEFITS]: {
      id: EGameUnit.BENEFITS,
      rawValue: benefitsUnit,
      motionValue: benefitsUnit.value,
      totalMotionValue: benefitsUnit.total,
      displayCondition: displayBenefits,
      purchaseCondition: canBuyWithBenefits
    },
    [EGameUnit.REPUTATION]: {
      id: EGameUnit.REPUTATION,
      rawValue: reputationUnit,
      motionValue: reputationUnit.value,
      totalMotionValue: reputationUnit.total,
      displayCondition: true,
      purchaseCondition: canBuyWithReputation
    },
    [EGameUnit.KARMA]: {
      id: EGameUnit.KARMA,
      rawValue: karmaUnit,
      motionValue: karmaUnit.value,
      totalMotionValue: karmaUnit.total,
      displayCondition: false,
      purchaseCondition: true
    }
  }

  const totalUnits = {
    [EGameUnit.ACTIF]: actifUnit.total,
    [EGameUnit.COMPLEX]: complexUnit.total,
    [EGameUnit.SALE]: saleUnit.total,
    [EGameUnit.BENEFITS]: benefitsUnit.total,
    [EGameUnit.REPUTATION]: reputationUnit.total,
    [EGameUnit.KARMA]: karmaUnit.total
  }

  const getUnit = useCallback((unitId: EGameUnit): GameUnit | null => {
    return units[unitId] || null
  }, [units])

  const canDisplayUnit = useCallback((unitId: EGameUnit): boolean => {
    const unit = getUnit(unitId)
    return unit ? unit.displayCondition : false
  }, [getUnit])

  const canBuyUnit = useCallback((unitId: EGameUnit): boolean => {
    const unit = getUnit(unitId)

    return unit ? unit.purchaseCondition : false
  }, [getUnit])

  const hasEnoughUnits = (amountNeeded: number, unitNeeded: EGameUnit) => {
    const unit = getUnit(unitNeeded)
    if (!unit) return false
    const unitNeededValue = unit.rawValue.get()
    return amountNeeded <= unitNeededValue
  }

  const buyUnit = useCallback((unitId: EGameUnit) => {
    const unit = getUnit(unitId)
    if (!unit) return

    // If the unit has a cost, subtract it
    if (unit.costUnitId && unit.costAmount) {
      const costUnit = getUnit(unit.costUnitId)
      if (!costUnit) return
      if (!hasEnoughUnits(unit.costAmount, costUnit.id)) return
      if (unitId === EGameUnit.COMPLEX && !costUnit.rawValue.subtract(unit.costAmount)) return
    }

    let multiplier = 1
    if (unit.valueByAction)
      multiplier = unit.valueByAction.get()

    if (unit.id !== EGameUnit.SALE)
      unit.rawValue.add(1 * multiplier)

    if (unit.id === EGameUnit.SALE) {
      const benefitsUnit = getUnit(EGameUnit.BENEFITS)
      const productionCost = getPrice(EGamePrice.PRODUCTION).motionValue.get()
      const sellingCost = getPrice(EGamePrice.SELLING).motionValue.get()

      if (unit.costUnitId && unit.costAmount) {
        const costUnit = getUnit(unit.costUnitId)
        if (!costUnit || !costUnit.rawValue.subtract(unit.costAmount)) return
      }

      benefitsUnit?.rawValue.add((sellingCost - productionCost) * multiplier)
      unit.rawValue.add(1 * multiplier)
    }
  }, [getUnit, getPrice])

  const modifyUnitValue = useCallback((unitId: EGameUnit, value: number) => {
    const unit = getUnit(unitId)
    if (!unit) return false

    if (value < 0) {
      // On vérifie qu'on peut soustraire (qu'on ne tombe pas en dessous de 0)
      const currentValue = unit.rawValue.get()
      if (currentValue + value < 0) return false
      return unit.rawValue.subtract(Math.abs(value))
    } else if (value > 0) {
      return unit.rawValue.add(value)
    }

    return true
  }, [getUnit])

  const setUnitMultiplierGetter = useCallback((getter: UnitMultiplierGetter) => {
    currentUnitMultiplierGetter = getter
  }, [])

  const updateUnitDuration = useCallback((unitId: EGameUnit) => {
    const unit = getUnit(unitId)

    if (unit && unitId === 'complex') {
      if (unit.costUnitId && unit.costAmount) {
        const costUnit = getUnit(unit.costUnitId)
        if (!costUnit || !costUnit.rawValue.subtract(unit.costAmount)) return
      }
      complexDuration.subtract(500)
    }
  }, [])

  const updateValueByAction = useCallback((unitId: EGameUnit, addedValue: number) => {
    const unit = getUnit(unitId)

    if (unit && unit.valueByAction) {
      if (unitId === EGameUnit.COMPLEX && unit.costUnitId && unit.costAmount) {
        const costUnit = getUnit(unit.costUnitId)
        if (!costUnit || !costUnit.rawValue.subtract(unit.costAmount)) return
      }
      const unitValue = unit.valueByAction.get()
      const newValue = unitValue + addedValue

      unit.valueByAction.set(newValue)
    }
  }, [])

  const isSaleSuccessful = () => {
    const reputation = getUnit(EGameUnit.REPUTATION)?.motionValue.get() ?? 0
    const chance = Math.min(reputation, 100)
    const roll = Math.random() * 100

    return roll <= chance
  }

  const contextValue = {
    units,
    totalUnits,
    getUnit,
    canDisplayUnit,
    canBuyUnit,
    buyUnit,
    setUnitMultiplierGetter,
    updateDisplayConditions,
    updateUnitDuration,
    updateValueByAction,
    modifyUnitValue,
    isSaleSuccessful,
    hasEnoughUnits
  }

  return (
    <GameProviderContext.Provider value={ contextValue }>
      { children }
    </GameProviderContext.Provider>
  )
}

export const useGameProviderContext = () => {
  const context = useContext(GameProviderContext)
  if (!context) throw Error('useGameProviderContext must be used inside a `GameProvider`')
  return context
}
