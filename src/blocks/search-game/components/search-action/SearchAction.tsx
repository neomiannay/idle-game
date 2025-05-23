import React from 'react'

import { useL10n } from 'provider/L10nProvider'
import { EGameUnit } from 'types/store'

import SearchProgress from '../search-progress/SearchProgress'

export type SearchActionProps = {
  children: React.ReactNode;
  disabled: boolean;
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchAction = ({
  children,
  disabled,
  duration,
  price
}: SearchActionProps) => {
  const l10n = useL10n()

  return (
    <div>
      <SearchProgress
        isPlaying={ false }
        duration={ duration }
        colors={{
          background: 'var(--color-white)',
          progress: '#D5E9E7'
        }}
      />
      { children }
    </div>
  )
}

export default SearchAction
