import { createContext, useContext, useState } from 'react'

import { Item, ItemsData } from 'types/store'

import itemsData from 'data/items.json'

import { BaseProviderProps } from './GlobalProvider'

type ItemsContextType = {
  items: ItemsData;
  getAllItems: () => ItemsData;
  getItemsByUnit: (unitId: string) => ItemsData;
  getItemById: (itemId: string) => Item | null;
  getItemsByCategory: (category: string) => Item[];
}

export const ItemsContext = createContext<ItemsContextType | null>({} as ItemsContextType)

let context: ItemsContextType

export const ItemsProvider = ({ children }: BaseProviderProps) => {
  const [items, setItems] = useState<ItemsData>(itemsData.items as ItemsData)

  const getAllItems = (): ItemsData => {
    return items
  }

  const getItemsByUnit = (unitId: string): ItemsData => {
    const result: ItemsData = {}

    Object.keys(items).forEach((key) => {
      if (items[key] && Array.isArray(items[key])) {
        const filtered = items[key].filter(item => item.unitId === unitId)
        if (filtered.length > 0)
          result[key] = filtered
      }
    })

    return result
  }

  const getItemById = (itemId: string): Item | null => {
    let foundItem: Item | null = null

    Object.keys(items).forEach((key) => {
      if (items[key] && Array.isArray(items[key])) {
        const item = items[key].find(item => item._id === itemId || (item as any).id === itemId
        )
        if (item)
          foundItem = item
      }
    })

    return foundItem
  }

  const getItemsByCategory = (category: string): Item[] => {
    return items[category] || []
  }

  context = {
    items,
    getAllItems,
    getItemsByUnit,
    getItemById,
    getItemsByCategory
  }

  return (
    <ItemsContext.Provider
      value={ context }
    >
      { children }
    </ItemsContext.Provider>
  )
}

export const useItemsContext = (): ItemsContextType => {
  const context = useContext(ItemsContext)
  if (!context) throw new Error('useItemsContext must be used within a ItemsProvider')
  return context
}
