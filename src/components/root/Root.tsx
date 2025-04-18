import React, { memo, useEffect, useState } from 'react'

import classNames from 'classnames'
import Shop from 'components/shop/Shop' // Import the new Shop component
import Meta from 'components/meta/Meta'
import Header from 'components/header/Header'
import Sections from 'components/sections/Sections'
import BangerRive from 'components/banger-rive/BangerRive'
import { useIterationContext } from 'provider/IterationProvider'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className }: RootProps) {
  const { isPaused, togglePause, loading } = useIterationContext()

  const [animations, setAnimations] = useState<string[]>([])

  // setTimeout(() => {
  //   setAnimations(['Dance'])
  //   console.log('animations', animations)
  // }, 1000)

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setAnimations(['Dance'])
      console.log('animations', animations)
    }, 1000)

    return () => clearTimeout(timeOut)
  }, [])

  return (
    <main className={ classNames(styles.wrapper, {
      // [styles.loading]: loading
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
      <div className={ styles.gameLayout }>
        { /* { unitIds.map((unitId) => (
          canDisplayUnit(unitId) && (
            <Section key={ unitId } unitId={ unitId } />
          )
        )) } */ }
        { /* <button
          className={ classNames(styles.pauseButton, {
            [styles.paused]: isPaused
          }) }
          onClick={ togglePause }
        >
          { isPaused ? 'Paused' : 'Running' }
        </button> */ }
      </div>

      <Shop />
      <BangerRive src='rive/devilboy.riv' stateMachines='StateMachine' animations={ animations } />
    </main>
  )
}

export default memo(Root)
