import React from 'react'

import { useL10n } from 'provider/L10nProvider'
import { EGameUnit } from 'types/store'

export type SearchStartProps = {
  children: React.ReactNode;
  disabled: boolean;
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchStart = ({
  children,
  disabled,
  duration
}: SearchStartProps) => {
  const l10n = useL10n()
  return (
    <div>
      { children }
    </div>
  )
}

export default SearchStart
