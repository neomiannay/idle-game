import { ButtonHTMLAttributes, memo, RefObject, useRef } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/L10nProvider'
import Cursor from 'components/cursor/Cursor'

import styles from './Holder.module.scss'

type HolderProps = {
  className?: string;
  title: string;
  disabled?: boolean;
  duration?: number;
  onHold?: Function
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Holder = ({
  className,
  title,
  disabled,
  duration = 1000,
  onHold,
  ...props
}: HolderProps) => {
  const l10n = useL10n()
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  let animation: Animation | undefined

  const handleMouseDown = () => {
    if (disabled) return

    animation = ref.current?.animate([{ height: '20%' }, { height: '95%' }], {
      // 20% / 95% because of the font gaps
      duration,
      easing: 'ease-in-out'
    })
    animation!.onfinish = () => {
      console.log('Hold finished !')
      animation = ref.current?.animate([{ height: '95%' }, { height: '20%' }], {
        // 20% / 95% because of the font gaps
        duration: 150,
        easing: 'ease-in-out'
      })
      if (onHold) onHold()
    }
  }

  const handleMouseUp = () => {
    const currentHeight = ref.current?.getBoundingClientRect().height
    animation?.cancel()
    animation = ref.current?.animate(
      [{ height: `${currentHeight}px` }, { height: '20%' }],
      {
        // 20% because of the font gaps
        duration: 150,
        easing: 'ease-in-out'
      }
    )
  }

  console.log('🔘 ' + l10n(title) + ' Holder rendered')

  return (
    <>
      <button
        ref={ buttonRef }
        className={ classNames(styles.wrapper, className, {
          [styles.disabled]: disabled
        }) }
        { ...props }
        onMouseDown={ handleMouseDown }
        onMouseUp={ handleMouseUp }
      >
        <span>{ l10n(title) }</span>
        <div className={ styles.mask__wrapper } ref={ ref }>
          <div className={ styles.mask }>{ l10n(title) }</div>
        </div>
      </button>

      <Cursor
        title='BUTTONS.HOLD'
        disabled={ !!disabled }
        parent={ buttonRef as RefObject<HTMLElement> }
      />
    </>
  )
}

export default memo(Holder)
