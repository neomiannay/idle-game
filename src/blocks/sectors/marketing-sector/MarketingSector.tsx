import React, { PropsWithChildren, useMemo } from 'react'

import classNames from 'classnames'
import SearchGame, { SearchGameProps } from 'blocks/search-game/SearchGame'
import { EGameSector } from 'types/store'
import { useLoaderContext } from 'provider/LoaderProvider'

import searchActifs from 'data/games/search-tips.json'

import Sector from '../sector/Sector'

import styles from './MarketingSector.module.scss'

type MarketingSectorProps = PropsWithChildren<{
  className?: string;
}>;

const MarketingSector = ({ className, ...props }: MarketingSectorProps) => {
  const { resources } = useLoaderContext()

  const influenceurBlur = resources.influenceurBlur as HTMLImageElement
  const searchGameData = useMemo(() => searchActifs, [])

  return (
    <Sector className={ classNames(className) } { ...props }>
      <div className={ styles.container }>
        <SearchGame
          duration={ searchGameData.settings.duration }
          price={ searchGameData.settings.price }
          efficiency={ searchGameData.settings.efficiency }
          layoutInfos={ searchGameData.layout }
          items={ searchGameData.items as SearchGameProps['items'] }
          sectorId={ EGameSector.PUBLICITY }
        />
        <img
          src={ influenceurBlur.src }
          alt=''
          className={ styles.influenceurBlur }
        />
      </div>
    </Sector>
  )
}

export default MarketingSector
