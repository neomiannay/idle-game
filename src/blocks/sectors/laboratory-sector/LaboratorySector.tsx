import React, { PropsWithChildren, useMemo } from 'react'

import classNames from 'classnames'
import SearchGame, { SearchGameProps } from 'blocks/search-game/SearchGame'

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
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      LaboratorySector
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

export default React.memo(LaboratorySector)
