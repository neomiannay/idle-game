import React, { createContext, useState, useContext, PropsWithChildren, SetStateAction, Dispatch, useMemo } from 'react'

import itemsJson from 'data/items.json'
import upgradesJson from 'data/upgrades.json'

import { L10nProvider } from './L10nProvider'
import { ViewportProvider } from './ViewportProvider'
import { GameManagerProvider } from './GameManagerProvider'
import { ItemsProvider } from './ItemsProvider'
import { VisibilityProvider } from './VisibilityProvider'

type GlobalContextType = {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const GlobalContext = createContext<GlobalContextType | null>(null)

export type BaseProviderProps = PropsWithChildren<{
}>

let context: GlobalContextType

export const GlobalProvider = ({ children }: BaseProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true)

  const itemsData = useMemo(() => itemsJson.items, [])
  const upgradesData = useMemo(() => upgradesJson.upgrades, [])

  const providers = [
    ViewportProvider,
    L10nProvider,
    GameManagerProvider,
    ItemsProvider,
    () => (
      <VisibilityProvider
        items={ itemsData }
        upgrades={ upgradesData }
      >
        { children }
      </VisibilityProvider>
    )
  ]

  context = {
    loading,
    setLoading
  }

  return (
    <GlobalContext.Provider
      value={ context }
    >
      { providers.reverse().reduce((children, Provider) => (
        <Provider>
          { children }
        </Provider>
      ), children) }
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context) throw Error('useGlobalContext must be used inside a `GlobalProvider`')
  return context
}

export const getGlobalContext = () => {
  if (!context) throw Error('getGlobalContext can\'t be used server-side')
  return context
}
