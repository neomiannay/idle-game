import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { MotionValue, useMotionValue } from 'motion/react'

import { BaseProviderProps } from './GlobalProvider'

type ShopProviderType = {
  shopOpen: boolean
  setShopOpen: React.Dispatch<React.SetStateAction<boolean>>
  motionWrapperHeight: MotionValue<number>
  motionWrapperRef: React.RefObject<HTMLDivElement | null>
  shopTitleRef: React.RefObject<HTMLDivElement | null>
  translateYValue: number
}

const MARGIN_BETWEEN_TITLE_AND_SHOP = 34

export const ShopProviderContext = createContext<ShopProviderType | null>(null)

export const ShopProvider = ({ children }: BaseProviderProps) => {
  const [shopOpen, setShopOpen] = useState(false)
  const motionWrapperRef = useRef<HTMLDivElement | null>(null)
  const shopTitleRef = useRef<HTMLDivElement | null>(null)
  const motionWrapperHeight = useMotionValue(0)
  const shopTitleHeight = useMotionValue(0)

  useEffect(() => {
    if (shopOpen) motionWrapperHeight.set(motionWrapperRef.current?.offsetHeight ?? 0)
  }, [shopOpen])

  useEffect(() => {
    if (shopTitleRef.current) shopTitleHeight.set(shopTitleRef.current.offsetHeight + MARGIN_BETWEEN_TITLE_AND_SHOP)
  }, [shopTitleRef.current])

  const translateYValue = useMemo(() => {
    return -motionWrapperHeight.get() + shopTitleHeight.get()
  }, [motionWrapperHeight.get(), shopTitleHeight.get()])

  const contextValue = {
    shopOpen,
    setShopOpen,
    motionWrapperHeight,
    motionWrapperRef,
    shopTitleRef,
    translateYValue
  }

  return (
    <ShopProviderContext.Provider value={ contextValue }>
      { children }
    </ShopProviderContext.Provider>
  )
}

export const useShopProviderContext = () => {
  const context = useContext(ShopProviderContext)
  if (!context) throw new Error('useShopProviderContext must be used within a ShopProvider')
  return context
}
