import React, { PropsWithChildren, useMemo } from 'react'

import classNames from 'classnames'
import SearchGame, { SearchGameProps } from 'blocks/search-game/SearchGame'

import searchActifs from 'data/games/search-actifs.json'

import Sector from '../sector/Sector'

import styles from './MarketingSector.module.scss'

type MarketingSectorProps = PropsWithChildren<{
  className?: string
}>

const MarketingSector = ({ className, ...props } : MarketingSectorProps) => {
  const searchGameData = useMemo(() => {
    return searchActifs
  }, [])

  return (
    <Sector
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      MarketingSector
      <SearchGame
        duration={ searchGameData.settings.duration }
        price={ searchGameData.settings.price }
        efficiency={ searchGameData.settings.efficiency }
        layoutInfos={ searchGameData.layout }
        items={ searchGameData.items as SearchGameProps['items'] }
      />
    </Sector>
  )
}

export default React.memo(MarketingSector)
