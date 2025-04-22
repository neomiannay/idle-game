import React, { memo } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { useL10n } from 'provider/L10nProvider'
import useMotionState from 'hooks/useMotionState'
import { usePricesContext } from 'provider/PricesProvider'

import styles from './Header.module.scss'

type HeaderProps = {
  className?: string
}

const Header = ({ className }: HeaderProps) => {
  const { getUnit, canDisplayUnit } = useGameProviderContext()
  const { getPrice } = usePricesContext()

  const benefits = getUnit('benefits')
  const productionPrice = getPrice('production')
  const sellingPrice = getPrice('selling')

  const l10n = useL10n()

  const benefitsCount = benefits ? useMotionState(benefits.motionValue, (value) => value) : 0
  const productionCount = useMotionState(productionPrice.motionValue, (value) => value)
  const sellingCount = useMotionState(sellingPrice.motionValue, (value) => value)

  return (
    <>
      { canDisplayUnit('benefits') && (

        <div className={ classNames(styles.wrapper, className) }>
          <div className={ styles.price }>
            <span className={ styles.label }>{ l10n('PRICES.PRODUCTION') }</span>
            <span className={ styles.count }>{ productionCount } €</span>
          </div>

          <div className={ styles.benefits }>
            { benefitsCount } €
          </div>

          <div className={ styles.price }>
            <span className={ styles.label }>{ l10n('PRICES.SELLING') }</span>
            <span className={ styles.count }>{ sellingCount } €</span>
          </div>
        </div>
      ) }
    </>
  )
}

export default memo(Header)
