import React, { memo } from 'react'

import classNames from 'classnames'
import Shop from 'blocks/shop/Shop'
import Meta from 'blocks/meta/Meta'
import Header from 'blocks/header/Header'
import { useIterationContext } from 'provider/IterationProvider'
import Sectors from 'blocks/sectors/Sectors'
import { AnimatePresence } from 'motion/react'
import { baseVariants } from 'core/animation'
import useTransitionType from 'hooks/useTransitionType'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import RabitGame from 'blocks/rabit-game/RabitGame'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className }: RootProps) {
  const { isPaused, togglePause, loading } = useIterationContext()
  const { reactiveCurrentSector, sectors } = useSectorsProviderContext()

  const custom = { type: useTransitionType(reactiveCurrentSector, sectors) }

  return (
    <>
      <main className={ classNames(styles.wrapper, {
        [styles.loading]: loading
      }) }
      >
        { loading && <div className={ styles.loading }>Loading...</div> }
        { !loading && (
          <>
            <Meta />
            <Header />

            <AnimatePresence custom={ custom }>
              <Sectors key='sectors' { ...baseVariants } />
            </AnimatePresence>

            { /* <button
              className={ classNames(styles.pauseButton, {
                [styles.paused]: isPaused
              }) }
              onClick={ togglePause }
            >
              { isPaused ? 'Paused' : 'Running' }
            </button> */ }

            <Shop />
          </>
        ) }
      </main>
      { /* <Background /> */ }
      <RabitGame />
    </>
  )
}

export default memo(Root)
