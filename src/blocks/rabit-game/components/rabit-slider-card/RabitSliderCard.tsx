import React from 'react'

import { useL10n } from 'provider/L10nProvider'
import { EGamePrice, EGameUnit } from 'types/store'
import { useMotionValue } from 'motion/react'

import { TRabitSliderItem } from '../rabit-slider/RabitSlider'
import RabitHp from '../rabit-hp/RabitHp'

import styles from './RabitSliderCard.module.scss'

type TRabitSliderCardProps = {
  item: TRabitSliderItem;
};

const RabitSliderCard = ({ item }: TRabitSliderCardProps) => {
  const l10n = useL10n()
  const life = useMotionValue(item.power)

  const targetLabels: Record<string, string> = {
    [EGamePrice.PRODUCTION]: l10n('UI.LABEL_PRODUCTION'),
    [EGamePrice.SELLING]: l10n('UI.LABEL_SELLING'),
    [EGameUnit.REPUTATION]: l10n('UI.LABEL_REPUTATION')
  }

  return (
    <div className={ styles.card }>
      <div className={ styles.cardHeader }>
        <h3 className={ styles.cardTitle }>{ l10n(item.name) }</h3>
        <RabitHp className={ styles.cardHp } life={ life } length={ 6 } reduce />
      </div>
      <p className={ styles.cardDescription }>{ l10n(item.description) }</p>
      <div className={ styles.cardValues }>
        { item.values.map((value) => (
          <div key={ value.target } className={ styles.cardValuesItem }>
            <h5 className={ styles.cardValuesTitle }>{ targetLabels[value.target] ?? value.target }</h5>
            <h6 className={ styles.cardValuesLabel }>{ value.value }%</h6>
          </div>
        )) }
      </div>
    </div>
  )
}

export default RabitSliderCard
