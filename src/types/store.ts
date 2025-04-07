interface BaseValue {
  unitId: string;
  value: number;
}

export interface Item {
  _type: string;
  _id: string;
  unitId: string;
  name: string;
  unitByTime: number;
  apparitionCondition: BaseValue,
  cost: BaseValue;
}

export interface ItemsData {
  [category: string]: Item[];
}

export interface Upgrade {
  _type: string;
  _id: string;
  unitId: string;
  name: string;
  valueByAction: number;
  apparitionCondition: BaseValue,
  cost: BaseValue;
}

export interface UpgradesData {
  [category: string]: Upgrade[];
}

export interface Unit {
  _type: string;
  _id: string;
  count: number;
  name: string;
  action: {
    valueByAction: number;
    name: string;
    gesture: string;
    duration: number | null;
    animationDirection: string | null;
  },
  apparitionCondition: BaseValue,
  cost: BaseValue,
  items: Item[] | null;
  upgrades: Upgrade[] | null;
}

export interface UnitsState {
  units: Record<string, Unit>;

  getUnit: (unitId: string) => Unit;
  getAllUnitsId: () => string[];
  updateUnitCount: (unitId: string, amount: number) => void;

  updateValueByAction: (unitId: string, newValue: number) => void;
  updateActionDuration: (unitId: string, duration: number) => void;

  addItem: (unitId: string, item: Item) => void;
  addUpgrade: (unitId: string, upgrade: Upgrade) => void;

  canBuyUnitSelector: (unitId: string) => (state: UnitsState) => boolean;
  performAction: (unitId: string) => void;

  resetStore: () => void;
}
