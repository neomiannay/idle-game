import { create } from 'zustand'

type GameState = {
  count: number
  increment: () => void
  reset: () => void
}

const useGameState = create<GameState>((set) => ({
  count: JSON.parse(localStorage.getItem('game-store') || '{}').count || 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 })
}))

export default useGameState
