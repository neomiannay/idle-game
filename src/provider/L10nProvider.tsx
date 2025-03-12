import { createContext, useCallback, useContext } from 'react'

import { get, each, set } from 'lodash-es'

import json from 'data/l10n.json' with { type: 'json' }

import { BaseProviderProps } from './GlobalProvider'

type L10nVariables = { [key: string]: string } | null
export type L10n = (key: string, variables?: (L10nVariables), fallback?: boolean) => string

// Add conjugate as a utility function outside the provider
export const conjugate = (key: string, count: number) => {
  const parts = key.split('.')
  if (parts.length > 1) {
    const lastPart = parts.pop()
    return count > 1 ? `${parts.join('.')}.${lastPart}.plural` : `${parts.join('.')}.${lastPart}.singular`
  }
  return key
}

export const L10nContext = createContext<L10n>({} as L10n)

export const buildl10n = (data: any) => {
  const formatted = {}
  each(json, (value, key) => {
    set(formatted, key, value)
  })

  return (key: string, variables: L10nVariables = null, fallback = true) => {
    let v = get(formatted, key, fallback ? '🚨 ' + key : false) as string
    if (variables) each(variables, (value, key) => { v = v.replace(`%${key}%`, value) })
    return v
  }
}

export const L10nProvider = ({ children }: BaseProviderProps) => {
  const l10n = useCallback(buildl10n(json), [json])

  return (
    <L10nContext.Provider value={ l10n }>
      { children }
    </L10nContext.Provider>
  )
}

export const useL10n = () => {
  const context = useContext(L10nContext)
  if (!context) throw Error('useDataContext must be used inside a `DataProvider`')
  return context
}

export const getBackendL10n = (locale: string) => {
  const data = {}
  return buildl10n(data)
}
