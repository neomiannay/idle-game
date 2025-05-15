import React, { createContext, useContext, useCallback, useState } from 'react'

import { MotionValue } from 'motion/react'
import useMotionState from 'hooks/useMotionState'
import { GameUnit } from 'types/store'
import { useUnitMotionValue } from 'hooks/useUnitMotionValue'

import { BaseProviderProps } from './GlobalProvider'
import { usePricesContext } from './PricesProvider'

export type UnitMultiplierGetter = (unitId: string) => number;

const defaultUnitMultiplier: UnitMultiplierGetter = () => 1

type GameProviderType = {
  units: Record<string, GameUnit>
  totalUnits: Record<string, MotionValue<number>>
  getUnit: (unitId: string) => GameUnit | null
  canDisplayUnit: (unitId: string) => boolean
  canBuyUnit: (unitId: string) => boolean
  buyUnit: (unitId: string, multiplierGetter?: UnitMultiplierGetter) => void
  setUnitMultiplierGetter: (getter: UnitMultiplierGetter) => void
  updateDisplayConditions: () => void
  updateUnitDuration: (unitId: string) => void
  updateValueByAction: (unitId: string) => void
  modifyUnitValue: (unitId: string, value: number) => boolean | void
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
  const reputationUnit = useUnitMotionValue(0)
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
  const [displayReputation, setDisplayReputation] = useState(false)

  const complexDuration = useUnitMotionValue(5000)
  const valueByAction = useUnitMotionValue(1)

  const updateDisplayConditions = useCallback(() => {
    setDisplayComplex(actifUnit.getTotal() >= 100)
    setDisplaySale(complexUnit.getTotal() >= 5)
    setDisplayBenefits(saleUnit.getTotal() > 0)
    setDisplayReputation(reputationUnit.getTotal() > 0)
  }, [actifUnit, complexUnit, saleUnit, reputationUnit])

  // Define the units
  const units: Record<string, GameUnit> = {
    actif: {
      id: 'actif',
      rawValue: actifUnit,
      motionValue: actifUnit.value,
      totalMotionValue: actifUnit.total,
      displayCondition: canDisplayActif,
      purchaseCondition: canBuyActif
    },
    complex: {
      id: 'complex',
      rawValue: complexUnit,
      motionValue: complexUnit.value,
      totalMotionValue: complexUnit.total,
      displayCondition: displayComplex,
      purchaseCondition: canBuyComplex,
      costUnitId: 'actif',
      costAmount: 10,
      duration: complexDuration.value,
      valueByAction: valueByAction.value
    },
    sale: {
      id: 'sale',
      rawValue: saleUnit,
      motionValue: saleUnit.value,
      totalMotionValue: saleUnit.total,
      displayCondition: displaySale,
      purchaseCondition: canBuySale,
      costUnitId: 'complex',
      costAmount: 1
    },
    benefits: {
      id: 'benefits',
      rawValue: benefitsUnit,
      motionValue: benefitsUnit.value,
      totalMotionValue: benefitsUnit.total,
      displayCondition: displayBenefits,
      purchaseCondition: canBuyWithBenefits
    },
    reputation: {
      id: 'reputation',
      rawValue: reputationUnit,
      motionValue: reputationUnit.value,
      totalMotionValue: reputationUnit.total,
      displayCondition: displayReputation,
      purchaseCondition: canBuyWithReputation
    },
    karma: {
      id: 'karma',
      rawValue: karmaUnit,
      motionValue: karmaUnit.value,
      totalMotionValue: karmaUnit.total,
      displayCondition: false,
      purchaseCondition: true
    }
  }

  const totalUnits = {
    actif: actifUnit.total,
    complex: complexUnit.total,
    sale: saleUnit.total,
    benefit: benefitsUnit.total,
    reputationUnit: reputationUnit.total
  }

  const getUnit = useCallback((unitId: string): GameUnit | null => {
    return units[unitId] || null
  }, [units])

  const canDisplayUnit = useCallback((unitId: string): boolean => {
    const unit = getUnit(unitId)
    return unit ? unit.displayCondition : false
  }, [getUnit])

  const canBuyUnit = useCallback((unitId: string): boolean => {
    const unit = getUnit(unitId)
    return unit ? unit.purchaseCondition : false
  }, [getUnit])

  const buyUnit = useCallback((unitId: string) => {
    const unit = getUnit(unitId)
    if (!unit) return

    // If the unit has a cost, subtract it
    if (unit.costUnitId && unit.costAmount) {
      const costUnit = getUnit(unit.costUnitId)
      if (!costUnit || !costUnit.rawValue.subtract(unit.costAmount)) return
    }

    let multiplier = currentUnitMultiplierGetter(unitId)

    if (unit.id === 'complex' && unit.valueByAction)
      multiplier = unit.valueByAction.get()

    unit.rawValue.add(1 * multiplier)
    if (unit.id === 'sale') {
      const benefitsUnit = getUnit('benefits')
      const productionCost = getPrice('production').motionValue.get()
      const sellingCost = getPrice('selling').motionValue.get()
      benefitsUnit?.rawValue.add((sellingCost - productionCost) * multiplier)
    }
  }, [getUnit, getPrice])

  const modifyUnitValue = useCallback((unitId: string, value: number) => {
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

  const updateUnitDuration = useCallback((unitId: string) => {
    const unit = getUnit(unitId)

    if (unit && unitId === 'complex') {
      if (unit.costUnitId && unit.costAmount) {
        const costUnit = getUnit(unit.costUnitId)
        if (!costUnit || !costUnit.rawValue.subtract(unit.costAmount)) return
      }
      complexDuration.subtract(500)
    }
  }, [])

  const updateValueByAction = useCallback((unitId: string) => {
    const unit = getUnit(unitId)

    if (unit && unitId === 'complex') {
      if (unit.costUnitId && unit.costAmount) {
        const costUnit = getUnit(unit.costUnitId)
        if (!costUnit || !costUnit.rawValue.subtract(unit.costAmount)) return
      }
      valueByAction.add(1)
    }
  }, [])

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
    modifyUnitValue
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
