import React, { createContext, useContext, useState, useEffect } from 'react'

import { TSearchGameItem } from 'blocks/search-game/SearchGame'

import searchTips from 'data/games/search-tips.json'

import { BaseProviderProps } from './GlobalProvider'

type SearchPublicityContextType = {
  currentTimePub: number
  efficiencyPub: number
  setEfficiencyPub: (efficiency: number) => void
  startProgressPub: (duration: number) => void
  stopProgressPub: () => void
  isRunningPub: boolean
  searchStatePub: number
  setSearchStatePub: (searchState: number) => void
  newItemPub: TSearchGameItem | null
  setNewItemPub: (item: TSearchGameItem | null) => void
  tips: TSearchGameItem[] | null
  setTips: (items: TSearchGameItem[] | null) => void
  saveNewItemPub: (item: TSearchGameItem | null) => void
  loadTips: (data: TSearchGameItem[]) => void
  isErrorPub: boolean
  setIsErrorPub: (isError: boolean) => void
}

const SearchPublicityContext = createContext<SearchPublicityContextType | undefined>(undefined)

let context: SearchPublicityContextType

export const SearchPublicityProvider = ({ children }: BaseProviderProps) => {
  const [currentTimePub, setCurrentTimePub] = useState(0)
  const [efficiencyPub, setEfficiencyPub] = useState<number>(() => {
    const saved = localStorage.getItem('efficiencyPub')
    if (saved !== null) return Number(saved)
    return searchTips.settings.efficiency
  })
  const [isRunningPub, setIsRunningPub] = useState(false)
  const [searchStatePub, setSearchStatePub] = useState(0)
  const [newItemPub, setNewItemPub] = useState<TSearchGameItem | null>(null)
  const [tips, setTips] = useState<TSearchGameItem[] | null>(null)
  const [isErrorPub, setIsErrorPub] = useState(false)

  useEffect(() => {
    localStorage.setItem('efficiencyPub', String(efficiencyPub))
  }, [efficiencyPub])

  useEffect(() => {
    if (!isRunningPub) return

    const timer = setInterval(() => {
      setCurrentTimePub((prev) => {
        const newTime = Math.max(prev - 1000, 0)
        if (newTime === 0) {
          const evalEfficiency = Math.round(Math.random() * 100)
          const isError = evalEfficiency > efficiencyPub

          setIsErrorPub(isError)
          setEfficiencyPub(50 + Math.round(Math.random() * 50))

          setSearchStatePub(isError ? 0 : 2)

          clearInterval(timer)
          setIsRunningPub(false)
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunningPub])

  const startProgressPub = (duration: number) => {
    setCurrentTimePub(duration)
    setIsRunningPub(true)
  }

  const stopProgressPub = () => {
    setIsRunningPub(false)
    setCurrentTimePub(0)
    setEfficiencyPub(0)
  }

  const saveNewItemPub = (item: TSearchGameItem | null) => {
    if (item) {
      setTips((prev) => {
        if (!prev) return [item]
        if (prev.some((i) => i.id === item.id)) return prev
        return [...prev, item]
      })
    } else { setTips(null) }
  }

  const loadTips = (data: TSearchGameItem[]) => {
    setTips(data)
  }

  context = {
    currentTimePub,
    efficiencyPub,
    setEfficiencyPub,
    startProgressPub,
    stopProgressPub,
    isRunningPub,
    searchStatePub,
    setSearchStatePub,
    newItemPub,
    setNewItemPub,
    tips,
    setTips,
    saveNewItemPub,
    loadTips,
    isErrorPub,
    setIsErrorPub
  }

  return (
    <SearchPublicityContext.Provider value={ context }>
      { children }
    </SearchPublicityContext.Provider>
  )
}

export const useSearchPublicityContext = (): SearchPublicityContextType => {
  const context = useContext(SearchPublicityContext)
  if (!context) throw new Error('useSearchPublicityContext must be used within a SearchPublicityProvider')
  return context
}
