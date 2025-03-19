import React, { memo } from 'react'

import { useL10n } from 'provider/L10nProvider'
import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'

import styles from './Root.module.scss'

type RootProps = {
  className?: string;
};

function Root ({ className, ...props }: RootProps) {
  const l10n = useL10n()

  const { units } = useUnitsStore()

  console.log('🚀🚀 Root', units)

  // const data = useMemo(() => units, [])

  // console.log(getUnit('actif'))

  return (
    <main className={ classNames(styles.wrapper, className) }>
      { /* <Count count={ getUnit('actif')?.count } unit='🌸' /> */ }
      <div className={ styles.buttons }>
        { /* <Button title={ l10n('BUTTONS.COLLECT') } onClick={ increment } />
        <Button title={ l10n('BUTTONS.RESET') } onClick={ reset } /> */ }

        { /* UseMemo */ }
        { /* { data.map((unit, key: number) => (
          <Button key={ key } title={ unit.name } onClick={ () => unit.increment() } />
        )) } */ }
      </div>
    </main>
  )
}

export default memo(Root)
