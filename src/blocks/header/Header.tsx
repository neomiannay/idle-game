import React, { memo, useMemo } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { useL10n } from 'provider/L10nProvider'
import useMotionState from 'hooks/useMotionState'
import { usePricesContext } from 'provider/PricesProvider'
import { EGamePrice, EGameUnit } from 'types/store'
import ReputationIndicator from 'components/reputation-indicator/ReputationIndicator'
import SectorsTab from 'blocks/sectors/sectors-tab/SectorsTab'
import { AnimatePresence, motion } from 'motion/react'
import { baseVariants, fadeAppear, stagger } from 'core/animation'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'
import { formatBenefits } from 'helpers/units'

import styles from './Header.module.scss'

type HeaderProps = {
  className?: string
}

const Header = ({ className }: HeaderProps) => {
  const { getUnit, canDisplayUnit } = useGameProviderContext()
  const { getPrice } = usePricesContext()

  const benefits = getUnit(EGameUnit.BENEFITS)
  const productionPrice = getPrice(EGamePrice.PRODUCTION)
  const sellingPrice = getPrice(EGamePrice.SELLING)

  const l10n = useL10n()

  const benefitsCount = benefits ? useMotionState(benefits.motionValue, (value) => value) : 0
  const productionCount = useMotionState(productionPrice.motionValue, (value) => value)
  const sellingCount = useMotionState(sellingPrice.motionValue, (value) => value)

  const benefitsMemo = useMemo(() => formatBenefits(benefitsCount), [benefitsCount])

  return (
    <>
      <AnimatePresence>
        { canDisplayUnit(EGameUnit.BENEFITS) && (
          <motion.div
            className={ classNames(styles.wrapper, className) }
            { ...baseVariants }
            { ...stagger() }
          >
            <div className={ styles.pricesContainer }>
              <motion.div className={ styles.prices } { ...fadeAppear }>
                <div className={ styles.price }>
                  <span className={ styles.title }>{ l10n('PRICES.PRODUCTION') }</span>
                  <span className={ styles.count }>{ productionCount } €</span>
                </div>
                <div className={ styles.price }>
                  <span className={ styles.title }>{ l10n('PRICES.SELLING') }</span>
                  <span className={ styles.count }>{ sellingCount } €</span>
                </div>
              </motion.div>

              <motion.div { ...fadeAppear }>
                <SectorsTab />
              </motion.div>

              <motion.div { ...fadeAppear }>
                <ReputationIndicator />
              </motion.div>
            </div>

            <div className={ classNames(styles.benefits) }>
              <motion.div { ...fadeAppear }>
                <AdaptativeText className={ classNames(styles.money, styles.blur) }>{ benefitsMemo } €</AdaptativeText>
                <AdaptativeText className={ styles.money }>{ benefitsMemo } €</AdaptativeText>
              </motion.div>
            </div>

          </motion.div>
        ) }
      </AnimatePresence>
    </>
  )
}

export default memo(Header)
