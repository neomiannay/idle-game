import React, { memo, useEffect, useState } from 'react'

import classNames from 'classnames'
import Shop from 'components/shop/Shop' // Import the new Shop component
import Meta from 'components/meta/Meta'
import BangerRive from 'components/banger-rive/BangerRive'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className }: RootProps) {
  // const { canDisplayUnit, units } = useGameProviderContext()
  // const { isPaused, togglePause, loading } = useIterationContext()

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

  // const unitIds = Object.keys(units)

  return (
    <main className={ classNames(styles.wrapper, {
      // [styles.loading]: loading
    }) }
    >
      <Meta />
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
