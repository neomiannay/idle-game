import React, { memo } from 'react'

import classNames from 'classnames'
import Shop from 'blocks/shop/Shop' // Import the new Shop component
import Meta from 'blocks/meta/Meta'
import Header from 'blocks/header/Header'
import Sections from 'blocks/sections/Sections'
import { useIterationContext } from 'provider/IterationProvider'
import Modal from 'components/modal/Modal'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className }: RootProps) {
  const { isPaused, togglePause, loading } = useIterationContext()

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
            <Sections className={ styles.sections } />
            <button
              className={ classNames(styles.pauseButton, {
                [styles.paused]: isPaused
              }) }
              onClick={ togglePause }
            >
              { isPaused ? 'Paused' : 'Running' }
            </button>

            <Shop />
            <Modal />
          </>
        ) }
      </main>
      { /* <Background /> */ }
    </>
  )
}

export default memo(Root)
