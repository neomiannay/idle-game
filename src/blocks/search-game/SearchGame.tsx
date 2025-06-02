import React from 'react'

import { EGamePrice, EGameSector, EGameUnit } from 'types/store'
import { useL10n } from 'provider/L10nProvider'
import classNames from 'classnames'
import Translatable from 'components/translatable/Translatable'
import { getRoundedTime } from 'helpers/units'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useSearchPublicityContext } from 'provider/SearchPublicityProvider'

import styles from './SearchGame.module.scss'
import SearchContainer from './components/search-container/SearchContainer'

export type TSearchGameItemValue = {
  value: number;
  target: EGameUnit | EGamePrice;
};

export type TSearchGameItem = {
  id: string;
  disabled: boolean;
  name: string;
  description: string;
  acceptValues: TSearchGameItemValue[];
  declineValues: TSearchGameItemValue[];
};

export type TSearchGameLayoutInfos = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  new: string;
  list: string;
  probability: string;
  duration: string;
  decline: string;
  accept: string;
};

export type SearchGameProps = {
  duration: number; // In seconds
  price: number; // In euros
  efficiency: number; // In percentage
  layoutInfos: TSearchGameLayoutInfos;
  items: TSearchGameItem[];
  sectorId: EGameSector
};

const SearchGame: React.FC<SearchGameProps> = ({
  duration,
  price,
  efficiency,
  layoutInfos,
  items,
  sectorId
}) => {
  const l10n = useL10n()
  const { complexComposition } = useSearchLaboratoryContext()
  const { tips } = useSearchPublicityContext()

  const roundedTime = getRoundedTime(duration)

  let itemList

  switch (sectorId) {
    case EGameSector.LABORATORY:
      itemList = complexComposition
      break

    case EGameSector.PUBLICITY:
      itemList = tips
      break

    default:
      itemList = complexComposition
      break
  }

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n(layoutInfos.name) }</h3>
      <hr className={ styles.divider } />
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
        <div
          className={ classNames(
            styles.gameInfosItem,
            styles.gameInfosItemComposition
          ) }
        >
          <div
            style={{
              transform: 'rotate(5deg)',
              zIndex: 1
            }}
          >
            <Translatable>
              <div className={ styles.gameInfosCard }>
                <h4 className={ styles.gameInfosCardValue }>
                  { efficiency + l10n('UNITS.PERCENT') }
                </h4>
                <p className={ styles.gameInfosCardDesc }>
                  { l10n(layoutInfos.probability) }
                </p>
              </div>
            </Translatable>
          </div>
          <div
            style={{
              transform: 'translate(-10px, -5px) rotate(-4deg)'
            }}
          >
            <Translatable>
              <div className={ styles.gameInfosCard }>
                <h4 className={ styles.gameInfosCardValue }>
                  { roundedTime.value + l10n(roundedTime.unit) }
                </h4>
                <p className={ styles.gameInfosCardDesc }>
                  { l10n(layoutInfos.duration) }
                </p>
              </div>
            </Translatable>
          </div>
        </div>
      </div>
      <SearchContainer
        layoutInfos={ layoutInfos }
        duration={ duration }
        price={{
          unit: EGameUnit.BENEFITS,
          value: price
        }}
        items={ items }
        sectorId={ sectorId }
      />
      { itemList && (
        <>
          <hr className={ styles.divider } />
          <div className={ styles.itemsContainer }>
            <h6 className={ styles.subTitle }>
              { l10n(layoutInfos.list) }
            </h6>
            <small className={ styles.itemsWrapper }>
              { itemList?.map((item, index) => (
                <span key={ item.id }>
                  { l10n(item.name) }
                  { index !== items.length - 1 ? ', ' : '.' }
                </span>
              )) }
            </small>
          </div>
        </>
      ) }
    </div>
  )
}

export default SearchGame
