// import { Unit, UnitsState, Upgrade, Item } from 'types/store'
// import { create } from 'zustand'

// import unitsData from 'data/units.json'

// const storeKey = import.meta.env.VITE_LOCAL_STORAGE_KEY

// const getStoredValue = <T>(key: string, defaultValue: T): T => {
//   try {
//     const savedData = localStorage.getItem(storeKey)

//     if (!savedData) return defaultValue

//     const parsed = JSON.parse(savedData)

//     return key in parsed ? parsed[key] : defaultValue
//   } catch (error) {
//     console.error('Error while parsing localStorage data:', error)
//     return defaultValue
//   }
// }

// const initializeUnit = (unitData: Unit): Unit => {
//   const storedUnits = getStoredValue<Record<string, Unit>>('units', {})
//   const storedUnit = storedUnits[unitData._id]

//   if (!storedUnit) return { ...unitData }

//   return {
//     ...unitData,
//     count: storedUnit.count ?? unitData.count,
//     action: {
//       ...unitData.action,
//       valueByAction: storedUnit.action?.valueByAction ?? unitData.action.valueByAction,
//       duration: storedUnit.action?.duration ?? unitData.action.duration
//     },
//     items: storedUnit.items ?? unitData.items,
//     upgrades: storedUnit.upgrades ?? unitData.upgrades
//   }
// }

// const initialUnits = unitsData.units.reduce<Record<string, Unit>>((acc, unit) => {
//   acc[unit._id] = initializeUnit(unit as Unit)

//   return acc
// }, {})

// const useUnitsStore = create<UnitsState>((set, get) => ({
//   units: initialUnits,
//   getUnit: (unitId: string) => get().units[unitId],
//   getAllUnitsId: () => Object.keys(get().units),
//   getActiveItemsByUnit: (unitId: string) => {
//     const unit = get().units[unitId]
//     if (!unit) return {} as Record<string, Item[]>
//     if (!unit.items) return {} as Record<string, Item[]>
//     return unit.items.reduce<Record<string, Item[]>>((acc, item) => {
//       if (!acc[item.unitId]) acc[item.unitId] = []
//       acc[item.unitId].push(item)
//       return acc
//     }, {})
//   },
//   updateUnitCount: (unitId: string, amount: number) => {
//     set((state: any) => ({
//       units: {
//         ...state.units,
//         [unitId]: {
//           ...state.units[unitId],
//           count: (state.units[unitId]?.count || 0) + amount
//         }
//       }
//     }))
//   },
//   updateValueByAction: (unitId: string, newValue: number) => {
//     set((state: any) => ({
//       units: {
//         ...state.units,
//         [unitId]: {
//           ...state.units[unitId],
//           action: {
//             ...state.units[unitId].action,
//             valueByAction: newValue
//           }
//         }
//       }
//     }))
//   },
//   updateActionDuration: (unitId: string, duration: number) => {
//     set((state: any) => ({
//       units: {
//         ...state.units,
//         [unitId]: {
//           ...state.units[unitId],
//           action: {
//             ...state.units[unitId].action,
//             duration
//           }
//         }
//       }
//     }))
//   },
//   buyItem: (unitId: string, item: Item) => {
//     // if the item already exists, update the count by 1
//     set((state) => {
//       const unit = state.units[unitId]
//       if (!unit) return state

//       const items = unit.items || []
//       const itemIndex = items.findIndex(i => i._id === item._id)

//       if (itemIndex !== -1)
//         items[itemIndex].count++
//       else
//         items.push({ ...item, count: 1 })

//       return {
//         units: {
//           ...state.units,
//           [unitId]: {
//             ...unit,
//             items
//           }
//         }
//       }
//     })
//   },
//   resetItems: (unitId: string) => {
//     set((state) => {
//       const unit = state.units[unitId]
//       if (!unit) return state

//       return {
//         units: {
//           ...state.units,
//           [unitId]: {
//             ...unit,
//             items: null
//           }
//         }
//       }
//     })
//   },
//   addUpgrade: (unitId: string, upgrade: Upgrade) => {
//     set((state) => {
//       const unit = state.units[unitId]
//       if (!unit) return state

//       const currentUpgrades = unit.upgrades || []

//       // Vérifier si l'upgrade existe déjà
//       const upgradeExists = currentUpgrades.some(existingUpgrade => existingUpgrade._id === upgrade._id)
//       if (upgradeExists) return state

//       return {
//         units: {
//           ...state.units,
//           [unitId]: {
//             ...unit,
//             upgrades: [...currentUpgrades, upgrade]
//           }
//         }
//       }
//     })
//   },
//   canBuyUnitSelector: (unitId: string) => {
//     return (state: UnitsState) => {
//       const unitToBuy = state.units[unitId]
//       if (!unitToBuy || !unitToBuy.cost) return true

//       if (unitToBuy.cost.value === 0) return true

//       const { unitId: costUnitId, value: costValue } = unitToBuy.cost
//       const costUnit = state.units[costUnitId]

//       if (!costUnit) return false

//       return costUnit.count >= costValue
//     }
//   },
//   performAction: (unitId: string) => {
//     const unit = get().units[unitId]
//     if (!unit) return

//     if (unit.cost && unit.cost.value > 0) {
//       const canBuy = get().canBuyUnitSelector(unitId)(get())

//       if (!canBuy) return

//       const { unitId: costUnitId, value: costValue } = unit.cost
//       get().updateUnitCount(costUnitId, -costValue)
//     }

//     get().updateUnitCount(unitId, unit.action.valueByAction)
//   },
//   resetStore: () => {
//     set({
//       units: unitsData.units.reduce<Record<string, Unit>>((acc, unit) => {
//         acc[unit._id] = { ...unit }
//         return acc
//       }, {})
//     })
//   }
// }))

// export default useUnitsStore
