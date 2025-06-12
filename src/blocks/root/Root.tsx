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
import ActivateSound from 'blocks/activate-sound/ActivateSound'
import Button from 'components/button/Button'
import { useL10n } from 'provider/L10nProvider'

import styles from './Root.module.scss'
import Loading from './components/loading/Loading'

type RootProps = {
  className?: string;
};
function Root ({ className }: RootProps) {
  const l10n = useL10n()
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
      <Button // TODO: move to EndScreen component
        action={ l10n('BUTTONS.NEW_GAME') }
        variant='simple'
        className={ styles.newGame }
        onClick={ () => {
          localStorage.clear()
          window.location.reload()
        } }
      />

      <a
        className={ classNames(styles.newGame, styles.creditsLink) }
        href='https://www.notion.so/Sources-207ca43dc6968043b395d6fd8a2c0282'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Button action={ l10n('BUTTONS.CREDITS_LINK') } variant='simple' />
      </a>

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

          <ActivateSound />

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
