import { createContext, useContext, useState } from 'react'

import { UpgradesData } from 'types/store'

import upgradesData from 'data/upgrades.json'

import { BaseProviderProps } from './GlobalProvider'

type UpgradesContextType = {
  items: UpgradesData;
  getAllUpgrades: () => UpgradesData;
  getUpgradesByUnit: (unitId: string) => UpgradesData;
}

export const UpgradesContext = createContext<UpgradesContextType | null>({} as UpgradesContextType)

let context: UpgradesContextType

export const UpgradesProvider = ({ children }: BaseProviderProps) => {
  const [upgrades, setUpgrades] = useState<UpgradesData>(upgradesData.upgrades as UpgradesData)

  const getAllUpgrades = (): UpgradesData => {
    return upgrades
  }

  const getUpgradesByUnit = (unitId: string): UpgradesData => {
    const result: UpgradesData = {}

    Object.keys(upgrades).forEach((key) => {
      if (upgrades[key] && Array.isArray(upgrades[key])) {
        const filtered = upgrades[key].filter(item => item.unitId === unitId)
        if (filtered.length > 0)
          result[key] = filtered
      }
    })

    return result
  }

  context = {
    items: upgrades,
    getAllUpgrades,
    getUpgradesByUnit
  }

  return (
    <UpgradesContext.Provider
      value={ context }
    >
      { children }
    </UpgradesContext.Provider>
  )
}

export const useUpgradesContext = (): UpgradesContextType => {
  const context = useContext(UpgradesContext)
  if (!context) throw new Error('useUpgradesContext must be used within a UpgradesProvider')
  return context
}
