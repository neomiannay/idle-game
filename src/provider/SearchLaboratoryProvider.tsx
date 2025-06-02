import React, { createContext, useContext, useState, useEffect } from 'react'

import { TSearchGameItem } from 'blocks/search-game/SearchGame'

import { BaseProviderProps } from './GlobalProvider'

type SearchLaboratoryContextType = {
  currentTimeLab: number
  startProgressLab: (duration: number, onEnd: () => void) => void
  stopProgressLab: () => void
  isRunningLab: boolean
  searchStateLab: number
  setSearchStateLab: (searchStateLab: number) => void
  newItemLab: TSearchGameItem | null
  setNewItemLab: (item: TSearchGameItem | null) => void
  complexComposition: TSearchGameItem[] | null
  setComplexComposition: (items: TSearchGameItem[] | null) => void
  saveNewItemLab: (item: TSearchGameItem | null) => void
}

const SearchLaboratoryContext = createContext<SearchLaboratoryContextType | undefined>(undefined)

let context: SearchLaboratoryContextType

export const SearchLaboratoryProvider = ({ children }: BaseProviderProps) => {
  const [currentTimeLab, setCurrentTimeLab] = useState(0)
  const [isRunningLab, setIsRunningLab] = useState(false)
  // eslint-disable-next-line no-extra-parens
  const [onEndCallbackLab, setOnEndCallbackLab] = useState<() => void>(() => () => {})
  const [searchStateLab, setSearchStateLab] = useState(0)
  const [newItemLab, setNewItemLab] = useState<TSearchGameItem | null>(null)
  const [complexComposition, setComplexComposition] = useState<TSearchGameItem[] | null>(null)

  useEffect(() => {
    if (!isRunningLab) return

    const timer = setInterval(() => {
      setCurrentTimeLab((prev) => {
        const newTime = Math.max(prev - 1000, 0)
        if (newTime === 0) {
          clearInterval(timer)
          setIsRunningLab(false)
          onEndCallbackLab()
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunningLab, onEndCallbackLab])

  const startProgressLab = (duration: number, onEnd: () => void) => {
    setCurrentTimeLab(duration)
    setIsRunningLab(true)
    setOnEndCallbackLab(() => onEnd)
  }

  const stopProgressLab = () => {
    setIsRunningLab(false)
    setCurrentTimeLab(0)
  }

  console.log(complexComposition)

  const saveNewItemLab = (item: TSearchGameItem | null) => {
    if (item) {
      setComplexComposition((prev) => {
        if (!prev) return [item]
        if (prev.some((i) => i.id === item.id)) return prev // Avoid duplicates
        return [...prev, item]
      })
    } else { setComplexComposition(null) }
  }

  context = {
    currentTimeLab,
    startProgressLab,
    stopProgressLab,
    isRunningLab,
    searchStateLab,
    setSearchStateLab,
    newItemLab,
    setNewItemLab,
    complexComposition,
    setComplexComposition,
    saveNewItemLab
  }

  return (
    <SearchLaboratoryContext.Provider
      value={ context }
    >
      { children }
    </SearchLaboratoryContext.Provider>
  )
}

export const useSearchLaboratoryContext = (): SearchLaboratoryContextType => {
  const context = useContext(SearchLaboratoryContext)
  if (!context) throw new Error('useSearchLaboratoryContext must be used within a SearchLaboratoryProvider')
  return context
}
