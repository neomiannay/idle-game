import React from 'react'

import { EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import classNames from 'classnames'

import styles from './SearchStart.module.scss'

export type SearchStartProps = {
  children: React.ReactNode;
  setSearchState: (searchState: number) => void;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchStart = ({
  children,
  setSearchState,
  price
}: SearchStartProps) => {
  const { hasEnoughUnits, modifyUnitValue } = useGameProviderContext()

  const handleClick = () => {
    if (!hasEnoughUnits(price.value, price.unit)) return

    setSearchState(1)
    modifyUnitValue(price.unit, -price.value)
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
