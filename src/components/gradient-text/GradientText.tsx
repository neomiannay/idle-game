import React from 'react'

import classNames from 'classnames'

import styles from './GradientText.module.scss'

type GradientTextProps = {
  children: React.ReactNode;
  blur?: number;
  startColor?: string;
  endColor?: string;
  duration?: number;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}

const GradientText = ({
  children,
  blur,
  startColor,
  endColor,
  duration,
  className,
  ...props
}: GradientTextProps) => {
  startColor ??= '#a1d7d1'
  endColor ??= '#133946'
  duration ??= 1.5

  const background = `linear-gradient(90deg, ${startColor} 0%, ${endColor} 50%, ${startColor} 100%)`
  const backgroundBlur = `linear-gradient(90deg, ${startColor + '00'} 0%, ${endColor} 50%, ${startColor + '00'} 100%)`

  return (
    <div
      { ...props }
      className={ classNames(styles.gradient, className) }
    >
      <div
        className={ classNames(styles.gradientOverlay, styles.gradientItem) }
        style={{
          background,
          animationDuration: `${duration}s`
        }}
      >
        { children }
      </div>
      { blur && (
        <div
          className={ classNames(styles.gradientBlur, styles.gradientItem) }
          style={{
            filter: `blur(${blur}px)`,
            background: backgroundBlur,
            animationDuration: `${duration}s`
          }}
        >
          { children }
        </div>
      ) }
    </div>
  )
}

export default GradientText
