import React from 'react'

import classNames from 'classnames'
import { EGameUnit } from 'types/store'
import GradientText from 'components/gradient-text/GradientText'

import styles from './SearchButton.module.scss'

export type SearchButtonProps = {
  children: React.ReactNode;
  disabled: boolean;
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchButton: React.FC<SearchButtonProps> = ({ children, disabled, duration, price }) => {
  return (
    <div className={ styles.buttonContainer }>
      <div className={ styles.buttonWrapper }>
        <button
          className={ classNames(styles.button, {
            [styles.disabled]: disabled
          }) }
          disabled={ disabled }
        >
          <GradientText blur={ 1 }>
            toto
          </GradientText>
        </button>
      </div>
    </div>
  )
}
export default SearchButton
