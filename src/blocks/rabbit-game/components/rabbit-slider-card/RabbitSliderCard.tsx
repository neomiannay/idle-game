import React from 'react'

import { useL10n } from 'provider/L10nProvider'
import { EGamePrice, EGameUnit } from 'types/store'
import { useMotionValue } from 'motion/react'

import { TRabbitSliderItem } from '../rabbit-slider/RabbitSlider'
import RabbitHp from '../rabbit-hp/RabbitHp'

import styles from './RabbitSliderCard.module.scss'

type TRabbitSliderCardProps = {
  item: TRabbitSliderItem;
};

const RabbitSliderCard = ({ item }: TRabbitSliderCardProps) => {
  const l10n = useL10n()
  const life = useMotionValue(item.power)

  const targetLabels: Record<string, string> = {
    [EGamePrice.PRODUCTION]: l10n('UI.PRODUCTION_COST'),
    [EGamePrice.SELLING]: l10n('UI.SELLING'),
    [EGameUnit.REPUTATION]: l10n('UI.REPUTATION')
  }

  return (
    <div className={ styles.card }>
      <div className={ styles.cardHeader }>
        <h3 className={ styles.cardTitle }>{ l10n(item.name) }</h3>
        <RabbitHp className={ styles.cardHp } life={ life } length={ 6 } reduce />
      </div>
      <p className={ styles.cardDescription }>{ l10n(item.description) }</p>
      <div className={ styles.cardValues }>
        { item.values
          .filter((value) => value.target !== EGameUnit.KARMA)
          .map((value, index) => (
            <div key={ value.target } className={ styles.cardValuesItem }>
              <h5 className={ styles.cardValuesTitle }>{ targetLabels[value.target] ?? value.target }</h5>
              <h6 className={ styles.cardValuesLabel }>
                +
                { value.value.toString() }
                { value.target === EGameUnit.REPUTATION
                  ? l10n('UNITS.PERCENT')
                  : l10n('UNITS.EURO') }
              </h6>
            </div>
          )) }
      </div>
    </div>
  )
}

export default RabbitSliderCard
