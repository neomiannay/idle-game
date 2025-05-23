import React, { memo, useMemo } from 'react'

import classNames from 'classnames'
import Shop from 'blocks/shop/Shop' // Import the new Shop component
import Meta from 'blocks/meta/Meta'
import Header from 'blocks/header/Header'
import Sections from 'blocks/sections/Sections'
import { useIterationContext } from 'provider/IterationProvider'
import Sectors from 'blocks/sectors/Sectors'
import { AnimatePresence, motion } from 'motion/react'
import { baseVariants } from 'core/animation'
import useTransitionType from 'hooks/useTransitionType'
import { useSectorsProviderContext } from 'provider/SectorsProvider'

import searchActifs from 'data/games/search-actifs.json'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className }: RootProps) {
  const { isPaused, togglePause, loading } = useIterationContext()
  const { reactiveCurrentSector, sectors } = useSectorsProviderContext()

  const searchGameData = useMemo(() => {
    return searchActifs
  }, [])

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
              <motion.div key='sectors' { ...baseVariants }>
                <Sectors />
              </motion.div>
            </AnimatePresence>

            <Sections />
            <button
              className={ classNames(styles.pauseButton, {
                [styles.paused]: isPaused
              }) }
              onClick={ togglePause }
            >
              { isPaused ? 'Paused' : 'Running' }
            </button>

            <Shop />
          </>
        ) }
      </main>
      { /* <Background /> */ }
      { /* <SearchGame
        duration={ searchGameData.settings.duration }
        price={ searchGameData.settings.price }
        efficiency={ searchGameData.settings.efficiency }
        layoutInfos={ searchGameData.layout }
        items={ searchGameData.items as SearchGameProps['items'] }
      /> */ }
    </>
  )
}

export default memo(Root)
