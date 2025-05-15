import { useState, useEffect, useRef, FC } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/L10nProvider'
import { useGameProviderContext } from 'provider/GameProvider'

import styles from './HoldButton.module.scss'

interface HoldButtonProps {
  className?: string;
  label: string;
  autoMode?: boolean;
}

const HoldButton: FC<HoldButtonProps> = ({
  className,
  label,
  autoMode
}) => {
  const l10n = useL10n()
  const { getUnit, buyUnit, canBuyUnit } = useGameProviderContext()

  const [progress, setProgress] = useState<number>(100)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const canBuy = canBuyUnit('complex')
  const duration = getUnit('complex')?.duration?.get() ?? 5000

  const handleClick = () => {
    if (isAnimating || !canBuy) return

    setProgress(0)
    setIsAnimating(true)

    const interval = 100
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0
    timerRef.current = setInterval(() => {
      currentProgress += increment

      if (currentProgress >= 100) {
        if (timerRef.current)
          clearInterval(timerRef.current)

        setProgress(100)

        setTimeout(() => {
          buyUnit('complex')
          setIsAnimating(false)
          setProgress(100)
          setTimeout(() => {
            setProgress(0)
          }, 200)
        }, 50)
      } else {
        setProgress(currentProgress)
      }
    }, interval)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current)
        clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!autoMode || isAnimating || !canBuy) return

    handleClick()
  }, [autoMode, isAnimating, canBuy])

  return (
    <div className={ classNames(styles.wrapper, className, {
      [styles.disabled]: !canBuy
    }) }
    >
      <div onClick={ handleClick }>
        <div
          className={ styles.endColor }
          style={{
            clipPath: `inset(0 0 ${progress}% 0)`,
            transition: 'clip-path 0.05s linear'
          }}
        >
          { l10n(label) }
        </div>
        <div className={ styles.startColor }>{ l10n(label) }</div>
      </div>
    </div>
  )
}

export default HoldButton
