import React from 'react'

import { EGameUnit } from 'types/store'

import SearchProgress from '../search-progress/SearchProgress'

export type SearchButtonProps = {
  children: React.ReactNode;
  disabled: boolean;
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchButton: React.FC<SearchButtonProps> = ({
  children,
  disabled,
  duration,
  price
}) => {
  return (
    <SearchProgress
      isPlaying={ false }
      duration={ duration }
      colors={{
        background: 'var(--color-white)',
        progress: '#D5E9E7'
      }}
    />
  )
}

export default SearchButton
