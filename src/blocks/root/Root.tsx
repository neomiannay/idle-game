import React, { useEffect, useState } from 'react'

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
import Background from 'blocks/background/Background'

import styles from './Root.module.scss'

function Root () {
  const { loading } = useIterationContext()
  const { reactiveCurrentSector, sectors } = useSectorsProviderContext()

  const custom = { type: useTransitionType(reactiveCurrentSector, sectors) }

  // Make isFontsLoaded a reactive value
  const [isFontsLoaded, setIsFontsLoaded] = useState<boolean>(false)

  useEffect(() => {
    let cancelled = false
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) setIsFontsLoaded(true)
      })
    }
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <main
        className={ classNames(styles.wrapper, {
          [styles.loading]: loading
        }) }
      >
        { (loading || !isFontsLoaded) && (
          <div className={ styles.loading }>Loading...</div>
        ) }
        { !loading && isFontsLoaded && (
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
            <Background />
          </>
        ) }
      </main>
    </>
  )
}

export default Root
