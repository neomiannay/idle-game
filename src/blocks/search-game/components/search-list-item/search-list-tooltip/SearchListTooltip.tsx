import React from 'react'

import { TSearchGameItem } from 'blocks/search-game/SearchGame'
import { useL10n } from 'provider/L10nProvider'

import styles from './SearchListTooltip.module.scss'

export type SearchListTooltipProps = {
  item: TSearchGameItem;
};

const SearchListTooltip = ({ item }: SearchListTooltipProps) => {
  const l10n = useL10n()

  return (
    <div className={ styles.wrapper }>
      fils de pute
    </div>
  )
}

export default SearchListTooltip
