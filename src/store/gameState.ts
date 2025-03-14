import { create } from 'zustand'

import units from './unitsState'

type GameState = {
  count: number
  increment: () => void
  reset: () => void
}

const useGameState = create<GameState>((set) => {
  return {
    count: JSON.parse(localStorage.getItem('game-store') || '{}').count || 0,
    ...units(set),
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 })
  }
})

export default useGameState
