import React from 'react'

import { useL10n } from 'provider/L10nProvider'
import { EGamePrice, EGameUnit } from 'types/store'
import { TSearchGameItem, TSearchGameLayoutInfos } from 'blocks/search-game/SearchGame'
import { useGameProviderContext } from 'provider/GameProvider'
import { usePricesContext } from 'provider/PricesProvider'

import styles from './SearchResults.module.scss'

export type SearchResultsProps = {
  newItem: TSearchGameItem | null;
  layoutInfos: TSearchGameLayoutInfos;
  setSearchState: (searchState: number) => void;
  saveNewItem: (item: TSearchGameItem) => void;
};

const SearchResults = ({
  newItem,
  layoutInfos,
  setSearchState,
  saveNewItem
}: SearchResultsProps) => {
  const { modifyUnitValue } = useGameProviderContext()
  const priceContext = usePricesContext()
  const l10n = useL10n()

  const handleChoice = () => {
    const itemEffects = newItem?.values

    if (itemEffects) {
      itemEffects.forEach((effect) => {
        if (effect.target === EGamePrice.SELLING) {
          const sellingPrice = priceContext.getPrice(effect.target as EGamePrice)
          sellingPrice.rawValue.add(effect.value)
        } else if (effect.target === EGamePrice.PRODUCTION) {
          const productionPrice = priceContext.getPrice(effect.target as EGamePrice)
          if (effect.value < 0) {
            const currentValue = productionPrice.rawValue.get()
            if (currentValue + effect.value < 0) return false
            return productionPrice.rawValue.subtract(Math.abs(effect.value))
          } else {
            productionPrice.rawValue.add(effect.value)
          }
        } else {
          // Pour les unités standards (reputation, actif, complex, etc.)
          modifyUnitValue(effect.target as EGameUnit, effect.value)
        }
      })
    }
    if (newItem)
      saveNewItem(newItem)

    setSearchState(0) // Reset to initial state
  }

  const targetLabels: Record<string, string> = {
    production: 'Coût de production',
    selling: 'Prix de vente',
    reputation: 'Réputation'
  }

  return (
    <div className={ styles.wrapper }>
      { newItem && (
        <>
          <h6 className={ styles.subTitle }>
            { l10n(layoutInfos.new) }
          </h6>
          <p className={ styles.name }>{ l10n(newItem.name) }</p>
          <p className={ styles.description }>{ l10n(newItem.description) }</p>
          <div className={ styles.effects }>
            { newItem.values.map((value, index) => (
              <p key={ index }>
                { targetLabels[value.target] ?? value.target }: +{ value.value.toString() }{ value.target === EGameUnit.REPUTATION ? '%' : '€' }
              </p>
            )) }
          </div>
          <div className={ styles.choices }>
            <button onClick={ handleChoice }>{ l10n(layoutInfos.decline) }</button>
            <button onClick={ handleChoice }>{ l10n(layoutInfos.accept) }</button>
          </div>
        </>
      ) }
    </div>
  )
}

export default SearchResults
