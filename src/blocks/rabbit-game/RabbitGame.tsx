import React, { useMemo, useState } from 'react'

import { useMotionValue } from 'framer-motion'
import { useL10n } from 'provider/L10nProvider'

import rabbits from 'data/games/rabbits.json'

import styles from './RabbitGame.module.scss'
import Rabbit from './components/rabbit/Rabbit'
import RabbitSlider, {
  TRabbitSliderItem
} from './components/rabbit-slider/RabbitSlider'
import useMotionState from 'hooks/useMotionState'

export type TRabbitData = {
  price: number;
};

const RabbitGame = () => {
  const l10n = useL10n()
  const life = useMotionValue<number>(6)

  const [rabbitPrice, setRabbitPrice] = useState(rabbits.price)
  const [currentExp, setCurrentExp] = useState<TRabbitSliderItem | null>(null)

  const isRabbitDead = useMotionState(life, (v) => v <= 0)

  const attack = useMemo(() => currentExp?.power ?? 0, [currentExp]);

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n('RABBIT_GAME.LAYOUT.NAME') }</h3>
      <hr className={ styles.divider } />
      <Rabbit
        life={ life }
        price={ rabbitPrice }
        attack={ attack }
        isRabbitDead={ isRabbitDead }
      />
      <RabbitSlider
        items={ rabbits.items as TRabbitSliderItem[] }
        setCurrentExp={ setCurrentExp }
        isRabbitDead={ isRabbitDead }
        life={ life }
        rabbitPrice={ rabbitPrice }
        testPrice={ rabbits.testPrice }
        setRabbitPrice={ setRabbitPrice }
      />
    </div>
  )
}

export default RabbitGame
