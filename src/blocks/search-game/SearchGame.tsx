import React from 'react'

import { EGamePrice, EGameUnit } from 'types/store'
import { useL10n } from 'provider/L10nProvider'
import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import useMotionState from 'hooks/useMotionState'
import Translatable from 'components/translatable/Translatable'

import styles from './SearchGame.module.scss'

type TSearchGameItemValue = {
  value: number;
  target: EGameUnit | EGamePrice;
}

type TSearchGameItem = {
  id: string;
  disabled: boolean;
  name: string;
  description: string;
  values: TSearchGameItemValue[];
}

type TSearchGameLayoutInfos = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  composition: string;
  probability: string;
  duration: string;
}

export type SearchGameProps = {
  duration: number; // In seconds
  price: number; // In euros
  efficiency: number; // In percentage
  layoutInfos: TSearchGameLayoutInfos;
  items: TSearchGameItem[];
};

const SearchGame: React.FC<SearchGameProps> = ({ duration, price, efficiency, layoutInfos, items }) => {
  const l10n = useL10n()
  const { getUnit } = useGameProviderContext()

  const benefits = getUnit(EGameUnit.BENEFITS)
  const benefitsCount = benefits ? useMotionState(benefits.motionValue, (v) => v) : 0

  return (
    <div className={ styles.wrapper }>

      <h3 className={ styles.name }>
        { l10n(layoutInfos.name) }
      </h3>
      <div className={ styles.gameInfos }>
        <div className={ styles.gameInfosItem }>
          <h4 className={ styles.gameInfosItemLabel }>
            { l10n(layoutInfos.title) }
          </h4>
          <h5 className={ styles.gameInfosItemValue }>
            { l10n(layoutInfos.subtitle) }
          </h5>
          <p className={ styles.gameInfosItemDesc }>
            { l10n(layoutInfos.description) }
          </p>
        </div>
        <div className={ classNames(styles.gameInfosItem, styles.gameInfosItemComposition) }>
          <div
            style={{
              transform: 'rotate(5deg)',
              zIndex: 1
            }}
          >
            <Translatable>
              <div
                className={ styles.gameInfosCard }
              >
                <h4 className={ styles.gameInfosCardValue }>
                  { efficiency + l10n('UNITS.PERCENT') }
                </h4>
                <p className={ styles.gameInfosCardDesc }>
                  { l10n(layoutInfos.probability) }
                </p>
              </div>
            </Translatable>
          </div>
          <div style={{
            transform: 'translateX(-10px) rotate(-4deg)'
          }}
          >
            <Translatable>
              <div
                className={ styles.gameInfosCard }
              >
                <h4 className={ styles.gameInfosCardValue }>
                  { duration + l10n('UNITS.MIN') }
                </h4>
                <p className={ styles.gameInfosCardDesc }>
                  { l10n(layoutInfos.probability) }
                </p>
              </div>
            </Translatable>
          </div>
        </div>
      </div>
      <div className={ styles.itemsContainer }>
        <h6 className={ classNames(styles.itemsLabel, styles.subTitle) }>
          { l10n(layoutInfos.composition) }
        </h6>
        <small className={ styles.itemsWrapper }>
          { items.map((item, index) => (
            <span key={ item.id }>
              { l10n(item.name) }
              { index !== items.length - 1 ? ', ' : '.' }
            </span>
          )) }
        </small>
      </div>
      { /* <button
        type='button' className={ classNames(styles.button, styles.searchButton, {
          [styles.buttonDisabled]: benefitsCount < price
        }) }
      >
        { `${l10n(layoutInfos.buttonLabel)} (${price}${l10n('UNITS.EURO')})` }
      </button> */ }
    </div>
  )
}

export default SearchGame
