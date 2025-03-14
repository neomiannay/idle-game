import React, { memo, useMemo } from 'react'

import { useL10n } from 'provider/L10nProvider'
import Count from 'components/count/Count'
import classNames from 'classnames'
import useGameState from 'store/gameState'
import Button from 'components/button/Button'

import styles from './Root.module.scss'

type RootProps = {
  className?: string;
};

function Root ({ className, ...props }: RootProps) {
  const l10n = useL10n()

  const { count, units } = useGameState()
  const data = useMemo(() => units, [])

  return (
    <main className={ classNames(styles.wrapper, className) }>
      <Count count={ count } unit='🌸' />
      <div className={ styles.buttons }>
        { /* <Button title={ l10n('BUTTONS.COLLECT') } onClick={ increment } />
        <Button title={ l10n('BUTTONS.RESET') } onClick={ reset } /> */ }

        { /* UseMemo */ }
        { data.map((unit, key: number) => (
          <Button key={ key } title={ unit.name } onClick={ () => unit.increment() } />
        )) }
      </div>
    </main>
  )
}

export default memo(Root)
