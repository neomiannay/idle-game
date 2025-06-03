import React from 'react'

import { EGameSector, EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import classNames from 'classnames'
import { TSearchGameItem } from 'blocks/search-game/SearchGame'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useSearchPublicityContext } from 'provider/SearchPublicityProvider'

import styles from './SearchStart.module.scss'

export type SearchStartProps = {
  children: React.ReactNode;
  price: {
    unit: EGameUnit;
    value: number;
  };
  duration: number;
  items: TSearchGameItem[];
  setSearchState: (searchState: number) => void;
  startProgress: (duration: number, callback: () => void) => void;
  setNewItem: (item: TSearchGameItem) => void;
  sectorId: EGameSector;
};

const SearchStart = ({
  children,
  price,
  duration,
  items,
  setSearchState,
  startProgress,
  setNewItem,
  sectorId
}: SearchStartProps) => {
  const { hasEnoughUnits, modifyUnitValue } = useGameProviderContext()
  const { complexComposition } = useSearchLaboratoryContext()
  const { tips } = useSearchPublicityContext()

  let filteredItems: TSearchGameItem[] = items
  if (sectorId === EGameSector.LABORATORY && complexComposition)
    filteredItems = items.filter(item => !complexComposition.some(addedItem => addedItem.id === item.id))
  else if (sectorId === EGameSector.PUBLICITY && tips)
    filteredItems = items.filter(item => !tips.some(addedItem => addedItem.id === item.id))

  const handleClick = () => {
    if (!hasEnoughUnits(price.value, price.unit)) return

    setSearchState(1)
    startProgress(duration, () => setSearchState(2))
    modifyUnitValue(price.unit, -price.value)

    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)]
    setNewItem(randomItem)
  }

  const disabled = !hasEnoughUnits(price.value, price.unit)

  return (
    <button
      className={ classNames(styles.button, {
        [styles.disabled]: disabled
      }) }
      disabled={ disabled }
      onClick={ handleClick }
    >
      { children }
    </button>
  )
}

export default SearchStart
