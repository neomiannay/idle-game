import React from 'react'

import { EGameUnit } from 'types/store'
import { SearchGameProps } from 'blocks/search-game/SearchGame'

import SearchProgress from '../search-progress/SearchProgress'

export type SearchContainerProps = {
  layoutInfos: SearchGameProps['layoutInfos']
  disabled: boolean;
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchContainer = ({
  layoutInfos,
  disabled,
  duration,
  price
}: SearchContainerProps) => {
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

export default SearchContainer
