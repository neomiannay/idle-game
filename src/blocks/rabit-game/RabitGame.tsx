import React, { useState } from 'react'

import { useMotionValue } from 'motion/react'
import { useL10n } from 'provider/L10nProvider'
import { formatValue } from 'helpers/units'

import rabits from 'data/games/rabits.json'

import styles from './RabitGame.module.scss'
import Rabit from './components/rabit/Rabit'
import RabitSlider, {
  TRabitSliderItem
} from './components/rabit-slider/RabitSlider'
import RabitBtn from './components/rabit/components/rabit-btn/RabitBtn'

export type TRabitData = {
  price: number;
};

const RabitGame = () => {
  const l10n = useL10n()
  const life = useMotionValue(100)

  const [rabitPrice, setRabitPrice] = useState(rabits.price)
  const [rabitBuyed, setRabitBuyed] = useState(false)

  const attack = 10
  const handleBuy = () => {
    if (!rabitBuyed) {
      setRabitPrice(rabitPrice * rabits.factor)
      setRabitBuyed(true)
    }
  }

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n('RABIT_GAME.LAYOUT.NAME') }</h3>
      <hr className={ styles.divider } />
      <Rabit life={ life } price={ rabitPrice } attack={ attack } onBuy={ handleBuy } />
      <RabitSlider items={ rabits.items as TRabitSliderItem[] } />
      <RabitBtn
        className={ styles.rabitExpBtn }
        price={ `${formatValue(10)} ${l10n('UNITS.EURO')}` }
        label={ l10n('RABIT_GAME.LAYOUT.START_EXP') }
      />
    </div>
  )
}

export default RabitGame
