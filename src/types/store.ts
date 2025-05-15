import { UnitMotionValueResult } from 'hooks/useUnitMotionValue'
import { MotionValue } from 'motion'

export interface GameUnit {
  id: string
  rawValue: UnitMotionValueResult
  motionValue: MotionValue<number>
  totalMotionValue: MotionValue<number>
  displayCondition: boolean
  purchaseCondition: boolean
  costUnitId?: string
  costAmount?: number
  duration?: MotionValue<number>
  valueByAction?: MotionValue<number>
}
export interface GamePrice {
  id: string
  rawValue: UnitMotionValueResult
  motionValue: MotionValue<number>
  totalMotionValue: MotionValue<number>
}

export interface GameStateUnit {
  motionValue: number
  totalMotionValue: number
  duration?: number
  valueByAction?: number
}

export interface GameStateElement {
  count: number
  purchased: boolean
}

export interface GameState {
  units: Record<string, GameStateUnit>
  items?: Record<string, Record<string, GameStateElement>>
  upgrades?: Record<string, Record<string, GameStateElement>>
  lastPlayedTime: number
}

export type ElementType = 'item' | 'upgrade'

export interface ItemType {
  _type: 'item'
  _id: string
  unitId: string
  name: string
  unitByTime: number
  apparitionCondition: {
    unitId: string
    value: number
  }
  cost: {
    unitId: string
    value: number
  }
  count: MotionValue<number>
  purchased: MotionValue<boolean>
}

export interface UpgradeType {
  _type: 'upgrade'
  _id: string
  unitId: string
  name: string
  valueByAction: number
  apparitionCondition: {
    unitId: string
    value: number
  }
  cost: {
    unitId: string
    value: number
  }
  count: MotionValue<number>
  purchased: MotionValue<boolean>
}

export interface ElementTypes {
  item: ItemType
  upgrade: UpgradeType
}
