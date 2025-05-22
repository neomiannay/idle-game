import React, { memo } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { useL10n } from 'provider/L10nProvider'
import useMotionState from 'hooks/useMotionState'
import { usePricesContext } from 'provider/PricesProvider'
import { EGamePrice, EGameUnit } from 'types/store'
import ReputationIndicator from 'components/reputation-indicator/ReputationIndicator'
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

  return (
    <>
      { canDisplayUnit(EGameUnit.BENEFITS) && (

        <div className={ classNames(styles.wrapper, className) }>

          <div className={ classNames(styles.benefits, styles.blurContainer) }>
            <div className={ styles.clearText }>{ formatBenefits(benefitsCount) } €</div>
            <div className={ styles.blurredText }>{ formatBenefits(benefitsCount) } €</div>
          </div>

          <div className={ styles.information }>
            <div className={ styles.prices }>
              <div className={ styles.price }>
                <span className={ styles.title }>{ l10n('PRICES.PRODUCTION') }</span>
                <span className={ styles.count }>{ productionCount } €</span>
              </div>
              <div className={ styles.price }>
                <span className={ styles.title }>{ l10n('PRICES.SELLING') }</span>
                <span className={ styles.count }>{ sellingCount } €</span>
              </div>
            </div>
            <ReputationIndicator />
          </div>

        </div>
      ) }
    </>
  )
}

export default memo(Header)
