import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { useSectorsProviderContext } from 'provider/SectorsProvider'

import styles from './SectorsTab.module.scss'

type SectorsTabProps = PropsWithChildren<{
  className?: string
}>

const SectorsTab = ({ className, ...props } : SectorsTabProps) => {
  const { defaultUnlockedSector, unlockedSectors, reactiveCurrentSector, setCurrentSector } = useSectorsProviderContext()

  return (
    <div className={ classNames(styles.wrapper, className) } { ...props }>
      <button
        onClick={ () => setCurrentSector(defaultUnlockedSector) }
      >
        <b>DEFAULT SECTOR : { defaultUnlockedSector }</b>
      </button>
      { unlockedSectors?.map((sector) => (
        <button
          key={ sector }
          className={ classNames(styles.sector, {
            [styles.active]: reactiveCurrentSector === sector
          }) }
          onClick={ () => setCurrentSector(sector) }
        >
          { sector }
        </button>
      )) }
    </div>
  )
}

export default React.memo(SectorsTab)
