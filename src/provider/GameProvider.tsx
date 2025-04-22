// GameProvider.tsx
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
}

export const GameProviderContext = createContext<GameProviderType | null>(null)

let currentUnitMultiplierGetter: UnitMultiplierGetter = defaultUnitMultiplier

export function GameProvider ({ children }: BaseProviderProps) {
  const { getPrice } = usePricesContext()

  // Initialize motion values for units
  const actifUnit = useUnitMotionValue(0)
  const excipientUnit = useUnitMotionValue(0)
  const complexUnit = useUnitMotionValue(0)
  const benefitsUnit = useUnitMotionValue(0)

  // Purchase conditions
  const canBuyActif = true
  const canBuyExcipient = useMotionState(actifUnit.value, () => actifUnit.get() >= 5)
  const canBuyComplex = useMotionState(excipientUnit.value, () => excipientUnit.get() >= 10)
  const canBuyWithBenefits = useMotionState(benefitsUnit.value, () => benefitsUnit.get() >= 10) // 10 = how much benefits you need to fund a project/mini-game

  // Display conditions
  const canDisplayActif = true
  const [displayExcipient, setDisplayExcipient] = useState(false)
  const [displayComplex, setDisplayComplex] = useState(false)
  const [displayBenefits, setDisplayBenefits] = useState(false)

  const updateDisplayConditions = useCallback(() => {
    setDisplayExcipient(actifUnit.getTotal() >= 5)
    setDisplayComplex(excipientUnit.getTotal() >= 10)
    setDisplayBenefits(complexUnit.getTotal() >= 1)
  }, [actifUnit, excipientUnit, complexUnit])

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
    excipient: {
      id: 'excipient',
      rawValue: excipientUnit,
      motionValue: excipientUnit.value,
      totalMotionValue: excipientUnit.total,
      displayCondition: displayExcipient,
      purchaseCondition: canBuyExcipient,
      costUnitId: 'actif',
      costAmount: 5
    },
    complex: {
      id: 'complex',
      rawValue: complexUnit,
      motionValue: complexUnit.value,
      totalMotionValue: complexUnit.total,
      displayCondition: displayComplex,
      purchaseCondition: canBuyComplex,
      costUnitId: 'excipient',
      costAmount: 10
    },
    benefits: {
      id: 'benefits',
      rawValue: benefitsUnit,
      motionValue: benefitsUnit.value,
      totalMotionValue: benefitsUnit.total,
      displayCondition: displayBenefits,
      purchaseCondition: canBuyWithBenefits
    }
  }

  const totalUnits = {
    actif: actifUnit.total,
    excipient: excipientUnit.total,
    complex: complexUnit.total
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

    const multiplier = currentUnitMultiplierGetter(unitId)
    unit.rawValue.add(1 * multiplier)
    if (unit.id === 'complex') {
      const benefitsUnit = getUnit('benefits')
      const productionCost = getPrice('production').motionValue.get()
      const sellingCost = getPrice('selling').motionValue.get()
      benefitsUnit?.rawValue.add((sellingCost - productionCost) * multiplier)
    }
  }, [getUnit])

  const setUnitMultiplierGetter = useCallback((getter: UnitMultiplierGetter) => {
    currentUnitMultiplierGetter = getter
  }, [])

  const contextValue = {
    units,
    totalUnits,
    getUnit,
    canDisplayUnit,
    canBuyUnit,
    buyUnit,
    setUnitMultiplierGetter,
    updateDisplayConditions
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
