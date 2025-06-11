import React, { PropsWithChildren, useMemo } from 'react'

import classNames from 'classnames'
import SearchGame, { SearchGameProps } from 'blocks/search-game/SearchGame'
import { EGameSector } from 'types/store'

import searchActifs from 'data/games/search-tips.json'

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
      className={ classNames(className) }
      { ...props }
    >
      <div className={ styles.container }>
        <SearchGame
          duration={ searchGameData.settings.duration }
          price={ searchGameData.settings.price }
          efficiency={ searchGameData.settings.efficiency }
          layoutInfos={ searchGameData.layout }
          items={ searchGameData.items as SearchGameProps['items'] }
          sectorId={ EGameSector.PUBLICITY }
        />
        <img src='/img/influenceurs/influenceurs_blur.png' alt='' className={ styles.influenceurBlur } />
      </div>
    </Sector>
  )
}

export default MarketingSector
