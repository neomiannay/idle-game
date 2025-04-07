import { Upgrade } from 'types/store'

export default function upgradeAlreadyPurshased (currentUpgrades: Upgrade[] | null, upgradeToTest: Upgrade): boolean {
  if (!currentUpgrades) return false
  return currentUpgrades.some(existingUpgrade => existingUpgrade._id === upgradeToTest._id)
}
