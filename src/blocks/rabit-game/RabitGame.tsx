import React from 'react'

import { useMotionValue } from 'motion/react'
import { useL10n } from 'provider/L10nProvider'
import { formatValue } from 'helpers/units'

import styles from './RabitGame.module.scss'
import Rabit from './components/rabit/Rabit'
import RabitSlider from './components/rabit-slider/RabitSlider'
import RabitBtn from './components/rabit/components/rabit-btn/RabitBtn'

const RabitGame = () => {
  const l10n = useL10n()
  const life = useMotionValue(100)
  const price = {
    rabit: 100,
    exp: 100
  }
  const attack = 51

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n('RABIT_GAME.LAYOUT.NAME') }</h3>
      <hr className={ styles.divider } />
      <Rabit life={ life } price={ price.rabit } attack={ attack } />
      <RabitSlider />
      <RabitBtn
        className={ styles.rabitExpBtn }
        price={ `${formatValue(price.exp)} ${l10n('UNITS.EURO')}` }
        label={ l10n('ACTIONS.BUY_RABIT') }
      />
    </div>
  )
}

export default React.memo(RabitGame)
