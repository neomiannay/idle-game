import React, { createContext, useContext, useState, useEffect } from 'react'

import { TSearchGameItem } from 'blocks/search-game/SearchGame'

import { BaseProviderProps } from './GlobalProvider'

type SearchPublicityContextType = {
  currentTimePub: number
  startProgressPub: (duration: number, onEnd: () => void) => void
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
}

const SearchPublicityContext = createContext<SearchPublicityContextType | undefined>(undefined)

let context: SearchPublicityContextType

export const SearchPublicityProvider = ({ children }: BaseProviderProps) => {
  const [currentTimePub, setCurrentTimePub] = useState(0)
  const [isRunningPub, setIsRunningPub] = useState(false)
  // eslint-disable-next-line no-extra-parens
  const [onEndCallbackPub, setOnEndCallbackPub] = useState<() => void>(() => () => {})
  const [searchStatePub, setSearchStatePub] = useState(0)
  const [newItemPub, setNewItemPub] = useState<TSearchGameItem | null>(null)
  const [tips, setTips] = useState<TSearchGameItem[] | null>(null)

  useEffect(() => {
    if (!isRunningPub) return

    const timer = setInterval(() => {
      setCurrentTimePub((prev) => {
        const newTime = Math.max(prev - 1000, 0)
        if (newTime === 0) {
          clearInterval(timer)
          setIsRunningPub(false)
          onEndCallbackPub()
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunningPub, onEndCallbackPub])

  const startProgressPub = (duration: number, onEnd: () => void) => {
    setCurrentTimePub(duration)
    setIsRunningPub(true)
    setOnEndCallbackPub(() => onEnd)
  }

  const stopProgressPub = () => {
    setIsRunningPub(false)
    setCurrentTimePub(0)
  }

  console.log(currentTimePub, searchStatePub)

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
    loadTips
  }

  return (
    <SearchPublicityContext.Provider
      value={ context }
    >
      { children }
    </SearchPublicityContext.Provider>
  )
}

export const useSearchPublicityContext = (): SearchPublicityContextType => {
  const context = useContext(SearchPublicityContext)
  if (!context) throw new Error('useSearchPublicityContext must be used within a SearchPublicityProvider')
  return context
}
