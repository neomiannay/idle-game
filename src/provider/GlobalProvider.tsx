import React, { createContext, useContext, PropsWithChildren } from 'react'

import { L10nProvider } from './L10nProvider'
import { ViewportProvider } from './ViewportProvider'
import { GameProvider } from './GameProvider'
import { IterationProvider } from './IterationProvider'
import { InventoryProvider } from './InventoryProvider'
import { PricesProvider } from './PricesProvider'
import { MessageSystemProvider } from './MessageSystemProvider'
import { FeedbackProvider } from './FeedbackProvider'
import { SectorsProvider } from './SectorsProvider'
import { SearchLaboratoryProvider } from './SearchLaboratoryProvider'
import { SearchPublicityProvider } from './SearchPublicityProvider'
import { ShopProvider } from './ShopProvider'
import { LoaderProvider } from './LoaderProvider'

type GlobalContextType = {};

export const GlobalContext = createContext<GlobalContextType | null>(null)

export type BaseProviderProps = PropsWithChildren<{}>;

let context: GlobalContextType

export const GlobalProvider = ({ children }: BaseProviderProps) => {
  const providers = [
    LoaderProvider,
    ViewportProvider,
    L10nProvider,
    PricesProvider, // PricesProvider should be before GameProvider to ensure prices are available
    FeedbackProvider,
    GameProvider,
    InventoryProvider,
    SectorsProvider,
    MessageSystemProvider,
    SearchLaboratoryProvider,
    SearchPublicityProvider,
    ShopProvider,
    IterationProvider
  ]

  context = {}

  return (
    <GlobalContext.Provider value={ context }>
      { providers.reverse().reduce(
        (children, Provider) => (
          <Provider>{ children }</Provider>
        ),
        children
      ) }
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context)
    throw Error('useGlobalContext must be used inside a `GlobalProvider`')
  return context
}

export const getGlobalContext = () => {
  if (!context) throw Error('getGlobalContext can\'t be used server-side')
  return context
}
