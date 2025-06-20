import React, { createContext, useContext, useState, useEffect } from 'react'

import { TSearchGameItem } from 'blocks/search-game/SearchGame'

import rabbits from 'data/games/rabbits.json'
import searchGame from 'data/games/search-actifs.json'

import { BaseProviderProps } from './GlobalProvider'

type SearchLaboratoryContextType = {
  currentTimeLab: number
  startProgressLab: (duration: number) => void
  stopProgressLab: () => void
  isRunningLab: boolean
  searchStateLab: number
  setSearchStateLab: (searchStateLab: number) => void
  newItemLab: TSearchGameItem | null
  setNewItemLab: (item: TSearchGameItem | null) => void
  complexComposition: TSearchGameItem[] | null
  setComplexComposition: (items: TSearchGameItem[] | null) => void
  saveNewItemLab: (item: TSearchGameItem | null) => void
  loadComplexComposition: (data: TSearchGameItem[]) => void
  rabbitPrice: number | null
  setRabbitPrice: (price: number) => void
  loadRabbitPrice: (data: number | null | undefined) => void
  killedRabbits: number
  setKilledRabbits: React.Dispatch<React.SetStateAction<number>>
  loadKilledRabbits: (data: number) => void
  isErrorLab: boolean
  setIsErrorLab: (isError: boolean) => void
  efficiencyLab: number;
  setEfficiencyLab: (efficiency: number) => void;
};

const SearchLaboratoryContext = createContext<
  SearchLaboratoryContextType | undefined
>(undefined)

let context: SearchLaboratoryContextType

export const SearchLaboratoryProvider = ({ children }: BaseProviderProps) => {
  const [currentTimeLab, setCurrentTimeLab] = useState(0)
  const [efficiencyLab, setEfficiencyLab] = useState<number>(() => {
    const saved = localStorage.getItem('efficiencyLab')
    if (saved !== null) return Number(saved)
    return searchGame.settings.efficiency
  })
  const [isRunningLab, setIsRunningLab] = useState(false)
  const [searchStateLab, setSearchStateLab] = useState(0)
  const [newItemLab, setNewItemLab] = useState<TSearchGameItem | null>(null)
  const [complexComposition, setComplexComposition] = useState<
    TSearchGameItem[] | null
  >(null)
  const [rabbitPrice, setRabbitPrice] = useState<number>(() => {
    const saved = localStorage.getItem('rabbitPrice')
    if (saved !== null) return Number(saved)
    return rabbits.price
  })
  const [killedRabbits, setKilledRabbits] = useState<number>(0)
  const [isErrorLab, setIsErrorLab] = useState(false)

  useEffect(() => {
    localStorage.setItem('rabbitPrice', String(rabbitPrice))
  }, [rabbitPrice])

  useEffect(() => {
    localStorage.setItem('efficiencyLab', String(efficiencyLab))
  }, [efficiencyLab])

  useEffect(() => {
    if (!isRunningLab) return

    const timer = setInterval(() => {
      setCurrentTimeLab((prev) => {
        const newTime = Math.max(prev - 1000, 0)
        if (newTime === 0) {
          const evalEfficiency = Math.round(Math.random() * 100)
          const isError = evalEfficiency > efficiencyLab

          setIsErrorLab(isError)
          setEfficiencyLab(50 + Math.round(Math.random() * 50))

          setSearchStateLab(isError ? 0 : 2)

          clearInterval(timer)
          setIsRunningLab(false)
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunningLab])

  const startProgressLab = (duration: number) => {
    setCurrentTimeLab(duration)
    setIsRunningLab(true)
  }

  const stopProgressLab = () => {
    setIsRunningLab(false)
    setCurrentTimeLab(0)
  }

  const saveNewItemLab = (item: TSearchGameItem | null) => {
    if (item) {
      setComplexComposition((prev) => {
        if (!prev) return [item]
        if (prev.some((i) => i.id === item.id)) return prev // Avoid duplicates
        return [...prev, item]
      })
    } else {
      setComplexComposition(null)
    }
  }

  const loadComplexComposition = (data: TSearchGameItem[]) => {
    setComplexComposition(data)
  }
  const loadKilledRabbits = (data: number) => {
    setKilledRabbits(data)
  }

  const loadRabbitPrice = (data: number | null | undefined) => {
    if (data === undefined || data === null) setRabbitPrice(rabbits.price)
    else setRabbitPrice(data)
  }

  context = {
    currentTimeLab,
    efficiencyLab,
    setEfficiencyLab,
    startProgressLab,
    stopProgressLab,
    isRunningLab,
    searchStateLab,
    setSearchStateLab,
    newItemLab,
    setNewItemLab,
    complexComposition,
    setComplexComposition,
    saveNewItemLab,
    loadComplexComposition,
    rabbitPrice,
    setRabbitPrice,
    loadRabbitPrice,
    killedRabbits,
    setKilledRabbits,
    loadKilledRabbits,
    isErrorLab,
    setIsErrorLab
  }

  return (
    <SearchLaboratoryContext.Provider value={ context }>
      { children }
    </SearchLaboratoryContext.Provider>
  )
}

export const useSearchLaboratoryContext = (): SearchLaboratoryContextType => {
  const context = useContext(SearchLaboratoryContext)
  if (!context) {
    throw new Error(
      'useSearchLaboratoryContext must be used within a SearchLaboratoryProvider'
    )
  }
  return context
}
