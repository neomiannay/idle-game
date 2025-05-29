import { UnitMotionValueResult } from 'hooks/useUnitMotionValue'
import { MotionValue } from 'motion'

export interface MessageType {
  id: string;
  condition: {
    unit: string;
    min: number;
  };
  message: string;
  accept: {
    karma: number;
    reputation?: number;
    selling?: number;
    production?: number;
  };
  decline: {
    karma: number;
  };
}

export enum EGamePrice {
  PRODUCTION = 'production',
  SELLING = 'selling',
}

export enum EGameUnit {
  ACTIF = 'actif',
  COMPLEX = 'complex',
  SALE = 'sale',
  BENEFITS = 'benefits',
  REPUTATION = 'reputation',
  KARMA = 'karma',
}

export enum EStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export enum EGameSector {
  PRODUCTION = 'production',
  LABORATORY = 'laboratoire',
  PUBLICITY = 'publicité',
}

export interface GameUnit {
  id: EGameUnit
  rawValue: UnitMotionValueResult
  motionValue: MotionValue<number>
  totalMotionValue: MotionValue<number>
  displayCondition: boolean
  purchaseCondition: boolean
  costUnitId?: EGameUnit
  costAmount?: number
  duration?: MotionValue<number>
  rawValueByAction?: UnitMotionValueResult
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
  _type: 'item' | 'upgrade'
  _id: string
  count: number
  purchased: boolean
}

export interface GameStatePrice {
  motionValue: number,
  totalMotionValue: number
}

export interface GameState {
  lastPlayedTime: number
  units: Record<string, GameStateUnit>
  items?: Record<string, Record<string, GameStateElement>>
  upgrades?: Record<string, Record<string, GameStateElement>>
  prices?: Record<string, GameStatePrice>
  seenMessages?: Array<string> | null
  unlockedSectors?: EGameSector[] | null
}

export type ElementType = 'item' | 'upgrade'

export interface ItemType {
  _type: 'item'
  _id: string
  unitId: EGameUnit
  name: string
  description: string
  unitByTime: number
  apparitionCondition: {
    unitId: EGameUnit
    value: number
  }
  cost: {
    unitId: EGameUnit
    value: number
  }
  count: MotionValue<number>
  purchased: MotionValue<boolean>
}

export interface UpgradeType {
  _type: 'upgrade'
  _id: string
  unitId: EGameUnit
  name: string
  description: string
  valueByAction: number
  apparitionCondition: {
    unitId: EGameUnit
    value: number
  }
  cost: {
    unitId: EGameUnit
    value: number
  }
  count: MotionValue<number>
  purchased: MotionValue<boolean>
}

export interface ElementTypes {
  item: ItemType
  upgrade: UpgradeType
}

export interface Sector {
  id: EGameSector
  name: string
}

export interface Sectors {
  sectors: Record<EGameSector, Sector>
}
