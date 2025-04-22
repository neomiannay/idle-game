import React, { memo } from 'react'

import classNames from 'classnames'
import Shop from 'components/shop/Shop' // Import the new Shop component
import { useIterationContext } from 'provider/IterationProvider'
import Meta from 'components/meta/Meta'
import Header from 'components/header/Header'
import Sections from 'components/sections/Sections'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className }: RootProps) {
  const { isPaused, togglePause, loading } = useIterationContext()

  return (
    <main className={ classNames(styles.wrapper, {
      [styles.loading]: loading
    }) }
    >
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
    </main>
  )
}

export default memo(Root)
