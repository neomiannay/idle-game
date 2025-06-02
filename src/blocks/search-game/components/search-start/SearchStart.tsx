import React from 'react'

import { EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import classNames from 'classnames'
import { TSearchGameItem } from 'blocks/search-game/SearchGame'

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
};

const SearchStart = ({
  children,
  price,
  duration,
  items,
  setSearchState,
  startProgress,
  setNewItem
}: SearchStartProps) => {
  const { hasEnoughUnits, modifyUnitValue } = useGameProviderContext()

  const handleClick = () => {
    if (!hasEnoughUnits(price.value, price.unit)) return

    setSearchState(1)
    startProgress(duration, () => setSearchState(2))
    modifyUnitValue(price.unit, -price.value)

    // pick a random item from the items array
    const randomItem = items[Math.floor(Math.random() * items.length)]
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
