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
}

export interface GamePrice {
  id: string
  rawValue: UnitMotionValueResult
  motionValue: MotionValue<number>
  totalMotionValue: MotionValue<number>
}

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
  purchased: MotionValue<boolean>
}

export interface ElementTypes {
  item: ItemType
  upgrade: UpgradeType
}
