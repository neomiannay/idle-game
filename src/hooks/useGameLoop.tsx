import { useCallback, useEffect, useRef, useState } from 'react'

import useRequestAnimationFrame from 'hooks/useRequestAnimationFrame'

type GameLoopOptions = {
  tickRate?: number // en secondes
  onTick: (deltaTime: number) => void
  onPause?: () => void
  onResume?: () => void
  initialPaused?: boolean
}

export function useGameLoop ({
  tickRate = 1,
  onTick,
  onPause,
  onResume,
  initialPaused = false
}: GameLoopOptions) {
  const [isPaused, setIsPaused] = useState(initialPaused)
  const isRunningRef = useRef(!initialPaused)
  const accumulatedTime = useRef(0)
  const lastUpdateTime = useRef(Date.now())

  // Fonction de play/pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const newState = !prev
      isRunningRef.current = !newState

      if (newState && onPause)
        onPause()
      else if (!newState && onResume)
        onResume()

      return newState
    })
    return !isPaused
  }, [isPaused, onPause, onResume])

  const processTick = useCallback((deltaTimeInSeconds: number) => {
    if (!isRunningRef.current) return

    onTick(deltaTimeInSeconds)

    lastUpdateTime.current = Date.now()
  }, [onTick])

  useRequestAnimationFrame((deltaTime: number) => {
    if (!isRunningRef.current) return

    const deltaSeconds = deltaTime * 0.001
    accumulatedTime.current += deltaSeconds

    // Traiter la logique de jeu à un rythme constant
    while (accumulatedTime.current >= tickRate) {
      processTick(tickRate)
      accumulatedTime.current -= tickRate
    }
  })

  // Nettoyer les ressources au démontage
  useEffect(() => {
    return () => {
      isRunningRef.current = false
      accumulatedTime.current = 0
      lastUpdateTime.current = Date.now()
      if (onPause)
        onPause()

      if (onResume)
        onResume()

      setIsPaused(initialPaused)
    }
  }, [])

  return {
    isPaused,
    togglePause,
    lastUpdateTime: lastUpdateTime.current,
    forceUpdate: () => processTick(tickRate)
  }
}
