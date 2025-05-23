import { useMemo, useRef, useEffect } from 'react'

import { PageTransitions } from 'core/page-transition'
import { EGameSector } from 'types/store'

const useTransitionType = (currentSector: EGameSector, sectors: EGameSector[]) => {
  const currentIndex = sectors.findIndex((sector) => sector === currentSector)
  const prevIndexRef = useRef(currentIndex)

  useEffect(() => {
    prevIndexRef.current = currentIndex
  }, [currentIndex])

  const prevIndex = prevIndexRef.current

  return useMemo(() => {
    return currentIndex < prevIndex ? PageTransitions.rightToLeft : PageTransitions.leftToRight
  }, [currentIndex, prevIndex])
}

export default useTransitionType
