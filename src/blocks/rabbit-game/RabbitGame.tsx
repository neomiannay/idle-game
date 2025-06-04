import React, { useState } from 'react'

import { useMotionValue } from 'motion/react'
import { useL10n } from 'provider/L10nProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'

import rabbits from 'data/games/rabbits.json'

import styles from './RabbitGame.module.scss'
import Rabbit from './components/rabbit/Rabbit'
import RabbitSlider, {
  TRabbitSliderItem
} from './components/rabbit-slider/RabbitSlider'

export type TRabbitData = {
  price: number;
};

const RabbitGame = () => {
  const l10n = useL10n()
  const life = useMotionValue<number>(-1)

  const [rabbitPrice, setRabbitPrice] = useState(rabbits.price)
  const [currentExp, setCurrentExp] = useState<TRabbitSliderItem | null>(null)
  const { hasEnoughUnits, modifyUnitValue } = useGameProviderContext()

  const handleBuy = () => {
    if (!hasEnoughUnits(rabbitPrice, EGameUnit.BENEFITS)) return
    if (life.get() <= 0) {
      setRabbitPrice(rabbitPrice * rabbits.factor)
      modifyUnitValue(EGameUnit.BENEFITS, -rabbitPrice)
      life.set(100)
    }
  }

  const handleStart = (exp: TRabbitSliderItem) => {
    setCurrentExp(exp)
  }

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n('RABIT_GAME.LAYOUT.NAME') }</h3>
      <hr className={ styles.divider } />
      <Rabbit
        life={ life }
        price={ rabbitPrice }
        attack={ currentExp?.power ?? 0 }
        onBuy={ handleBuy }
      />
      <RabbitSlider
        items={ rabbits.items as TRabbitSliderItem[] }
        onStart={ handleStart }
      />
    </div>
  )
}

export default RabbitGame
