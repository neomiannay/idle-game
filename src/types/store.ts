import { TSearchGameItem } from 'blocks/search-game/SearchGame'
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

export enum EChoice {
  ACCEPT = 'accept',
  DECLINE = 'decline',
}

export enum EGameSector {
  PRODUCTION = 'production',
  LABORATORY = 'laboratory',
  PUBLICITY = 'publicity',
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
  defaultDuration?: number
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
  _type: 'item' | 'upgrade' | 'sector' | 'otherShopElement'
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
  darkMode: boolean | null
  units: Record<string, GameStateUnit>
  items?: Record<string, Record<string, GameStateElement>>
  upgrades?: Record<string, Record<string, GameStateElement>>
  sectors?: Record<string, Record<string, GameStateElement>> | null
  otherShopElements?: Record<string, Record<string, GameStateElement>> | null
  prices?: Record<string, GameStatePrice>
  seenMessages?: Array<string> | null
  unlockedSectors?: EGameSector[] | null
  complexComposition?: TSearchGameItem[] | null
  tips?: TSearchGameItem[] | null
  rabbitPrice?: number | null
}

export type ElementType = 'item' | 'upgrade' | 'sector' | 'otherShopElement'

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

export interface SectorType {
  _type: 'sector'
  _id: EGameSector
  unitId: EGameUnit
  name: string
  description: string
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

export interface OtherShopElementType {
  _type: 'otherShopElement'
  _id: string
  sectorId: EGameSector
  name: string
  description: string
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
  sector: SectorType
  otherShopElement: OtherShopElementType
}
