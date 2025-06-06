import React, { useState } from 'react'

import classNames from 'classnames'
import Shop from 'blocks/shop/Shop'
import Meta from 'blocks/meta/Meta'
import Header from 'blocks/header/Header'
import Sectors from 'blocks/sectors/Sectors'
import { AnimatePresence } from 'motion/react'
import { baseVariants } from 'core/animation'
import useTransitionType from 'hooks/useTransitionType'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import Background from 'blocks/background/Background'
import { useLoaderContext } from 'provider/LoaderProvider'

import styles from './Root.module.scss'
import Loading from './components/loading/Loading'

type RootProps = {
  className?: string;
};
function Root ({ className }: RootProps) {
  const { isLoading } = useLoaderContext()
  const { reactiveCurrentSector, sectors } = useSectorsProviderContext()

  const custom = { type: useTransitionType(reactiveCurrentSector, sectors) }

  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false)

  return (
    <main
      className={ classNames(styles.wrapper, {
        [styles.loading]: isLoading
      }) }
    >
      { isLoading || !isBackgroundLoaded ? (
        <Loading />
      ) : (
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

      <Background
        onLoad={ () => requestAnimationFrame(() => {
          setIsBackgroundLoaded(true)
        }) }
      />
    </main>
  )
}

export default Root
