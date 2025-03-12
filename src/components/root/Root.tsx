import React, { memo } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/L10nProvider'
import Count from 'components/count/Count'
import Button from 'components/button/Button'
import useGameState from 'store/gameState'

import styles from './Root.module.scss'

type RootProps = {
  className?: string
}

function Root ({ className, ...props }: RootProps) {
  const l10n = useL10n()

  const { count, increment, reset } = useGameState()

  return (
    <main className={ classNames(styles.wrapper, className) }>
      <Count count={ count } unit='🌸' />
      <div className={ styles.buttons }>
        <Button title={ l10n('button.cueillir') } onClick={ increment } />
        <Button title={ l10n('button.reset') } onClick={ reset } />
      </div>
    </main>
  )
}

export default memo(Root)
