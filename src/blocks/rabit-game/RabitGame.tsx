import React from 'react'

import { useMotionValue } from 'motion/react'
import { useL10n } from 'provider/L10nProvider'

import styles from './RabitGame.module.scss'
import Rabit from './rabit/Rabit'

const RabitGame = () => {
  const l10n = useL10n()
  const life = useMotionValue(0)
  const price = 100

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n('RABIT_GAME.LAYOUT.NAME') }</h3>
      <hr className={ styles.divider } />
      <Rabit life={ life } price={ price } />
    </div>
  )
}

export default React.memo(RabitGame)
