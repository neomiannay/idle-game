import React from 'react'

import { useL10n } from 'provider/L10nProvider'
import { EGameUnit } from 'types/store'

export type SearchResultsProps = {
  disabled: boolean;
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchResults = ({
  disabled,
  duration,
  price
}: SearchResultsProps) => {
  const l10n = useL10n()

  return (
    <div />
  )
}

export default SearchResults
