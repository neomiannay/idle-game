import values from 'data/units.json'

export type Unit = {
  id: string;
  value: number;
  level: number;
  name: string;
  action: {
    value: string;
    duration?: number;
    direction?: string;
  };
  visible: {
    value: boolean;
    conditions?: {
      value: number;
      unit: string;
    };
  };
  price?: {
    value: number;
    unit: string;
  };
};

export const UNITS_VALUES = values.units as any[]
export default (set: any) => {
  const unitsObject: Record<string, Unit & { increment: () => void }> = {}

  UNITS_VALUES.forEach((unit: Unit) => {
    unitsObject[unit.id] = {
      ...unit,
      increment: () => set((state: any) => ({
        count: unit.id === 'flower' ? state.count + 1 : state.count
      }))
    }
  })

  return unitsObject
}
