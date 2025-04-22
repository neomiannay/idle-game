import { createContext, useCallback, useContext } from 'react'

import { GamePrice } from 'types/store'
import { useUnitMotionValue } from 'hooks/useUnitMotionValue'

import { BaseProviderProps } from './GlobalProvider'

type PricesContextType = {
  prices: Record<string, GamePrice>
  getPrice: (unitId: string) => GamePrice
}

export const PricesContext = createContext<PricesContextType | null>({} as PricesContextType)

let context: PricesContextType

export const PricesProvider = ({ children }: BaseProviderProps) => {
  // Initialize motion values for prices
  const productionPrice = useUnitMotionValue(20)
  const sellingPrice = useUnitMotionValue(80)

  // Define prices
  const prices: Record<string, GamePrice> = {
    production: {
      id: 'production',
      rawValue: productionPrice,
      motionValue: productionPrice.value,
      totalMotionValue: productionPrice.total
    },
    selling: {
      id: 'selling',
      rawValue: sellingPrice,
      motionValue: sellingPrice.value,
      totalMotionValue: sellingPrice.total
    }
  }
  const getPrice = useCallback((priceId: string): GamePrice => {
    return prices[priceId] || null
  }, [])

  context = {
    prices,
    getPrice
  }

  return (
    <PricesContext.Provider
      value={ context }
    >
      { children }
    </PricesContext.Provider>
  )
}

export const usePricesContext = (): PricesContextType => {
  const context = useContext(PricesContext)
  if (!context) throw new Error('usePricesContext must be used within a PricesProvider')
  return context
}
