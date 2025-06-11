import React from 'react'

import { EGameSector, EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import { TSearchGameItem } from 'blocks/search-game/SearchGame'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useSearchPublicityContext } from 'provider/SearchPublicityProvider'
import Button from 'components/button/Button'
import { useL10n } from 'provider/L10nProvider'

export type SearchStartProps = {
  price: {
    unit: EGameUnit;
    value: number;
  };
  duration: number;
  items: TSearchGameItem[];
  setSearchState: (searchState: number) => void;
  startProgress: (duration: number, callback: () => void) => void;
  setNewItem: (item: TSearchGameItem) => void;
  sectorId: EGameSector;
};

const SearchStart = ({
  price,
  duration,
  items,
  setSearchState,
  startProgress,
  setNewItem,
  sectorId
}: SearchStartProps) => {
  const { hasEnoughUnits, modifyUnitValue } = useGameProviderContext()
  const { complexComposition } = useSearchLaboratoryContext()
  const { tips } = useSearchPublicityContext()
  const l10n = useL10n()

  let filteredItems: TSearchGameItem[] = items
  if (sectorId === EGameSector.LABORATORY && complexComposition)
    filteredItems = items.filter(item => !complexComposition.some(addedItem => addedItem.id === item.id))
  else if (sectorId === EGameSector.PUBLICITY && tips)
    filteredItems = items.filter(item => !tips.some(addedItem => addedItem.id === item.id))

  const handleClick = () => {
    if (!hasEnoughUnits(price.value, price.unit)) return

    setSearchState(1)
    startProgress(duration, () => setSearchState(2))
    modifyUnitValue(price.unit, -price.value)

    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)]
    setNewItem(randomItem)
  }

  const disabled = !hasEnoughUnits(price.value, price.unit)

  return (
    <Button
      type='button'
      disabled={ disabled }
      cost={ price }
      action={ l10n('SEARCH_ACTIFS.LAYOUT.BUTTON_LABEL') }
      onClick={ handleClick }
    />
  )
}

export default SearchStart
