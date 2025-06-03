import React, { useState } from 'react'

import { useMotionValue } from 'motion/react'
import { useL10n } from 'provider/L10nProvider'

import rabits from 'data/games/rabits.json'

import styles from './RabitGame.module.scss'
import Rabit from './components/rabit/Rabit'
import RabitSlider, {
  TRabitSliderItem
} from './components/rabit-slider/RabitSlider'

export type TRabitData = {
  price: number;
};

const RabitGame = () => {
  const l10n = useL10n()
  const life = useMotionValue<number>(-1)

  const [rabitPrice, setRabitPrice] = useState(rabits.price)
  const [currentExp, setCurrentExp] = useState<TRabitSliderItem | null>(null)

  const handleBuy = () => {
    if (life.get() <= 0) {
      setRabitPrice(rabitPrice * rabits.factor)
      life.set(100)
    }
  }

  const handleStart = (exp: TRabitSliderItem) => {
    setCurrentExp(exp)
  }

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n('RABIT_GAME.LAYOUT.NAME') }</h3>
      <hr className={ styles.divider } />
      <Rabit
        life={ life }
        price={ rabitPrice }
        attack={ currentExp?.power ?? 0 }
        onBuy={ handleBuy }
      />
      <RabitSlider
        items={ rabits.items as TRabitSliderItem[] }
        onStart={ handleStart }
      />
    </div>
  )
}

export default RabitGame
