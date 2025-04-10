import React, { memo } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import Section from 'components/section/Section'
import Shop from 'components/shop/Shop' // Import the new Shop component
import { useIterationContext } from 'provider/IterationProvider'
import Meta from 'components/meta/Meta'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className }: RootProps) {
  const { canDisplayUnit, units } = useGameProviderContext()
  const { isPaused, togglePause, loading } = useIterationContext()

  const unitIds = Object.keys(units)

  return (
    <main className={ classNames(styles.wrapper, {
      [styles.loading]: loading
    }) }
    >
      <Meta />
      <div className={ styles.gameLayout }>
        { unitIds.map((unitId) => (
          canDisplayUnit(unitId) && (
            <Section key={ unitId } unitId={ unitId } />
          )
        )) }
        <button
          className={ classNames(styles.pauseButton, {
            [styles.paused]: isPaused
          }) }
          onClick={ togglePause }
        >
          { isPaused ? 'Paused' : 'Running' }
        </button>
      </div>

      <Shop />
    </main>
  )
}

export default memo(Root)
