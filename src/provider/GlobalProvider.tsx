import React, { createContext, useState, useContext, PropsWithChildren, SetStateAction, Dispatch } from 'react'

import { L10nProvider } from './L10nProvider'
import { ViewportProvider } from './ViewportProvider'
import { GameProvider } from './GameProvider'
import { IterationProvider } from './IterationProvider'
import { InventoryProvider } from './InventoryProvider'
import { PricesProvider } from './PricesProvider'

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

  const providers = [
    ViewportProvider,
    L10nProvider,
    PricesProvider, // PricesProvider should be before GameProvider to ensure prices are available
    GameProvider,
    InventoryProvider,
    IterationProvider
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
