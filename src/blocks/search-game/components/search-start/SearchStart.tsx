import React from 'react'

import { EGameUnit } from 'types/store'

import styles from './SearchStart.module.scss'

export type SearchStartProps = {
  children: React.ReactNode;
  disabled: boolean;
  duration: number;
  setIsPlaying: (isPlaying: boolean) => void;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchStart = ({
  children,
  disabled,
  duration,
  setIsPlaying
}: SearchStartProps) => {
  return (
    <button
      className={ styles.button }
      disabled={ disabled }
      onClick={ () => setIsPlaying(true) }
    >
      { children }
    </button>
  )
}

export default SearchStart
