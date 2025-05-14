import React, { memo, useEffect, useState } from 'react'

import BangerRive from 'components/banger-rive/BangerRive'
import { Alignment } from '@rive-app/react-canvas'
import { Fit, Layout } from 'rive-react'

import styles from './Background.module.scss'

/**
 * Banger Rive Component
 * @returns {React.ReactNode} The Background component
 */
function Background () {
  // Animations
  const [animations, setAnimations] = useState<string[]>([])

  useEffect(() => {
    setAnimations(['idle'])
  }, [])

  return (
    <>
      <div className={ styles.background }>
        <BangerRive
          id='background'
          src='rive/background.riv'
          stateMachines='StateMachine'
          animations={ animations }
          layout={ new Layout({ fit: Fit.Cover, alignment: Alignment.Center }) }
        />
      </div>
    </>
  )
}

export default memo(Background)
