import { ElementType, forwardRef, HTMLAttributes, ReactNode, useMemo, useRef } from 'react'

import classNames from 'classnames'
import { useResizeObserver } from 'hooks/useResizeObserver'
import { isString } from 'lodash-es'
import { useViewportContext } from 'provider/ViewportProvider'

import styles from './AdaptativeText.module.scss'

type AdaptativeTextProps = {
  className?: string
  tag?: ElementType
  children?: ReactNode
} & HTMLAttributes<HTMLDivElement>

const AdaptativeText = ({ className, tag: Tag = 'span', children, ...props } : AdaptativeTextProps, outerRef?: any) => {
  const { mq } = useViewportContext()
  const ref = outerRef || useRef<HTMLSpanElement>(null)
  const ruler = useRef<HTMLSpanElement>(null)

  useResizeObserver(ref, () => {
    if (!ruler.current || !ref.current) return

    const letterSpacing = parseFloat(window.getComputedStyle(ruler.current).letterSpacing)
    const rulerWidth = ruler.current.offsetWidth - (isNaN(letterSpacing) ? 0 : letterSpacing)
    const refWidth = ref.current.offsetWidth
    const fontSize = (refWidth / rulerWidth) * 100
    const minFontSize = mq.tabletPortrait ? 15 : 12

    const useEllipsis = fontSize < minFontSize

    ref.current.classList.toggle(styles.overflow, useEllipsis)

    ref.current.style.fontSize = Math.max(fontSize, minFontSize) + 'px'
  })

  const rulerContent = useMemo(() => isString(children) ? children : children?.toString(), [children])

  return (
    <>
      <Tag className={ classNames(styles.wrapper, className) } { ...props } ref={ ref }>
        { children }
      </Tag>
      <span className={ classNames(className, styles.ruler) } ref={ ruler } aria-hidden>
        { rulerContent }
      </span>
    </>
  )
}

export default forwardRef(AdaptativeText)
