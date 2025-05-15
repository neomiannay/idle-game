import { createContext, useCallback, useContext } from 'react'

import { EGamePrice, GamePrice } from 'types/store'
import { useUnitMotionValue } from 'hooks/useUnitMotionValue'

import { BaseProviderProps } from './GlobalProvider'

type PricesContextType = {
  prices: Record<EGamePrice, GamePrice>
  getPrice: (priceId: EGamePrice) => GamePrice
}

export const PricesContext = createContext<PricesContextType | null>({} as PricesContextType)

let context: PricesContextType

export const PricesProvider = ({ children }: BaseProviderProps) => {
  // Initialize motion values for prices
  const productionPrice = useUnitMotionValue(20)
  const sellingPrice = useUnitMotionValue(80)

  // Define prices
  const prices: Record<EGamePrice, GamePrice> = {
    [EGamePrice.PRODUCTION]: {
      id: EGamePrice.PRODUCTION,
      rawValue: productionPrice,
      motionValue: productionPrice.value,
      totalMotionValue: productionPrice.total
    },
    [EGamePrice.SELLING]: {
      id: EGamePrice.SELLING,
      rawValue: sellingPrice,
      motionValue: sellingPrice.value,
      totalMotionValue: sellingPrice.total
    }
  }
  const getPrice = useCallback((priceId: EGamePrice): GamePrice => {
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
