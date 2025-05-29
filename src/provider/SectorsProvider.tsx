import React, { createContext, useContext, useMemo, useState } from 'react'

import { EGameSector } from 'types/store'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { MotionValue, useMotionValue } from 'motion/react'
import useMotionState from 'hooks/useMotionState'

import { BaseProviderProps } from './GlobalProvider'

type SectorsProviderType = {
  defaultUnlockedSector: EGameSector
  sectors: EGameSector[]
  unlockedSectors: EGameSector[] | null
  currentSector: MotionValue<EGameSector>
  reactiveCurrentSector: EGameSector
  setUnlockedSectors: React.Dispatch<React.SetStateAction<EGameSector[] | null>>
  setCurrentSector: (sector: EGameSector) => void
  loadSectors: (data: EGameSector[]) => void
}

export const SectorsProdivderContext = createContext<SectorsProviderType | null>(null)

export const SectorsProvider = ({ children }: BaseProviderProps) => {
  const defaultUnlockedSector = EGameSector.PRODUCTION

  const sectors = useMemo<EGameSector[]>(() => [
    EGameSector.PRODUCTION,
    EGameSector.LABORATORY,
    EGameSector.PUBLICITY
  ], [])

  const currentSector = useMotionValue(defaultUnlockedSector)
  const reactiveCurrentSector = useMotionState(currentSector, (v) => v)

  const defaultData = useLocalStorage<EGameSector[] | null>('unlockedSectors')
  const [unlockedSectors, setUnlockedSectors] = useState<EGameSector[] | null>(defaultData)

  const loadSectors = (data: EGameSector[]) => {
    setUnlockedSectors(data)
  }

  const setCurrentSector = (sector: EGameSector) => {
    currentSector.set(sector)
  }

  const contextValue = {
    defaultUnlockedSector,
    sectors,
    unlockedSectors,
    setUnlockedSectors,
    currentSector,
    reactiveCurrentSector,
    setCurrentSector,
    loadSectors
  }

  return (
    <SectorsProdivderContext.Provider value={ contextValue }>
      { children }
    </SectorsProdivderContext.Provider>
  )
}

export const useSectorsProviderContext = () => {
  const context = useContext(SectorsProdivderContext)
  if (!context) throw Error('useSectorsProviderContext must be used inside a `SectorsProvider`')
  return context
}
