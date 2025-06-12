import React, { PropsWithChildren, useMemo } from 'react'

import classNames from 'classnames'
import SearchGame, { SearchGameProps } from 'blocks/search-game/SearchGame'
import { EGameSector } from 'types/store'
import RabbitGame from 'blocks/rabbit-game/RabbitGame'

import searchActifs from 'data/games/search-actifs.json'

import Sector from '../sector/Sector'

import styles from './LaboratorySector.module.scss'

type LaboratorySectorProps = PropsWithChildren<{
  className?: string
}>

const LaboratorySector = ({ className, ...props } : LaboratorySectorProps) => {
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
          layoutInfos={ searchGameData.layout }
          items={ searchGameData.items as SearchGameProps['items'] }
          sectorId={ EGameSector.LABORATORY }
        />
        <RabbitGame />
      </div>
    </Sector>
  )
}

export default LaboratorySector
