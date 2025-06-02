import React from 'react'

import Droplet from 'components/icons/droplet/Droplet'

import styles from './RabitSliderCard.module.scss'

type TRabitSliderCardProps = {
  power: number
}

const RabitSliderCard = ({ power }: TRabitSliderCardProps) => {
  return (
    <div className={ styles.card }>
      <div className={ styles.cardHeader }>
        <h3 className={ styles.cardTitle }>réaction cutanée</h3>
        <div className={ styles.cardHeaderIconWrapper }>
          { new Array(Math.floor(Math.random() * 10)).fill(0).map((_, index) => (
            <Droplet key={ index } />
          )) }
        </div>
      </div>
      <p className={ styles.cardDescription }>
        Évaluation du potentiel irritant d'une substance chimique sur la peau en
        mesurant les réactions inflammatoires locales
      </p>
      <div className={ styles.cardValues }>
        { new Array(Math.floor(Math.random() * 10)).fill(0).map((_, index) => (
          <div key={ index } className={ styles.cardValuesItem }>
            <h5 className={ styles.cardValuesTitle }>
              Réputation
            </h5>
            <h6 className={ styles.cardValuesLabel }>
              +10%
            </h6>
          </div>
        )) }
      </div>
    </div>
  )
}

export default React.memo(RabitSliderCard)
