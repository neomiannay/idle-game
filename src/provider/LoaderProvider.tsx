import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import { RiveFile, useRiveFile } from '@rive-app/react-webgl2'

import { sources } from 'data/sources.json'

import { BaseProviderProps } from './GlobalProvider'

type TResource = RiveFile | HTMLImageElement;

type LoaderContextType = {
  isLoading: boolean;
  resources: Record<string, TResource>;
  setLoadingStates: Dispatch<
    SetStateAction<{
      data: boolean;
      assets: boolean;
    }>
  >;
  loadingStates: {
    data: boolean;
    assets: boolean;
  };
};

const LoaderContext = createContext<LoaderContextType | null>(null)

export function LoaderProvider ({ children }: BaseProviderProps) {
  // States
  const [resources, setResources] = useState<Record<string, TResource>>({})
  const [loadingStates, setLoadingStates] = useState({
    data: true,
    assets: true
  })

  // Memo
  const isLoading = useMemo(
    () => Object.values(loadingStates).some((v) => v),
    [loadingStates]
  )

  const contextValue = useMemo<LoaderContextType>(
    () => ({
      isLoading,
      resources,
      loadingStates,
      setLoadingStates
    }),
    [isLoading, loadingStates, setLoadingStates]
  )

  // Font loading
  useEffect(() => {
    document.fonts?.ready?.then(() => setLoadingStates((prev) => ({ ...prev, font: false }))
    )
  }, [])

  const res = useMemo<Record<string, TResource>>(() => ({}), [])
  const setResource = (name: string, value: TResource) => {
    if (!(name in resources)) res[name] = value

    // Check if all resources are loaded
    if (Object.keys(res).length === sources.length && loadingStates.assets) {
      setResources(res)
      setLoadingStates((p) => ({
        ...p,
        assets: false
      }))
    }
  }

  // Load resources
  const src = [...sources]
  src.forEach((s) => {
    // Rive
    switch (s.type) {
      case 'rive': {
        const { riveFile, status } = useRiveFile({ src: s.src })

        useEffect(() => {
          const isLoaded = riveFile && status === 'success'
          if (isLoaded) setResource(s.name, riveFile)
        }, [status])
        break
      }
      case 'img': {
        const img = new Image()
        img.src = s.src

        img.onload = () => {
          img.onload = null
          setResource(s.name, img)
        }
        break
      }
      default:
        break
    }
  })

  return (
    <LoaderContext.Provider value={ contextValue }>
      { children }
    </LoaderContext.Provider>
  )
}

export const useLoaderContext = () => {
  const context = useContext(LoaderContext)
  if (!context)
    throw Error('useLoaderContext must be used inside an `LoaderProvider`')
  return context
}
