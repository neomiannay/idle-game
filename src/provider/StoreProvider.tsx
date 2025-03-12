// import { createContext } from 'react'

// import { create } from 'zustand'

// import { BaseProviderProps } from './GlobalProvider'

// type Store = {
//   count: number
//   increment: (by: number) => void
// }

// export const StoreContext = createContext<Store | null>(null)

// let context: Store

// export const StoreProvider = ({ children }: BaseProviderProps) => {
//   const useStore = create<Store>((set) => ({
//     count: 0,
//     increment: (by) => set((state) => ({ count: state.count + by }))
//   }))

//   const { count, increment } = useStore()

//   context = {
//     count,
//     increment
//   }

//   return (
//     <StoreContext.Provider value={ context }>
//       { children }
//     </StoreContext.Provider>
//   )
// }

// export const useStore = () => {
//   const context = createContext(StoreContext)
//   if (!context) throw Error('useStore must be used inside a `StoreProvider`')
//   return context
// }
