export default function canAfford (costRequired: number, availableFund: number): boolean {
  return availableFund >= costRequired
}
