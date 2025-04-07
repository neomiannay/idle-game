import { memo, RefObject, useEffect, useRef } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { useL10n } from 'provider/L10nProvider'
import { useSpring, useMotionValue, useAnimationFrame } from 'motion/react'

import styles from './Cursor.module.scss'

const Cursor = ({
  title,
  parent
}: {
  title: string;
  parent: RefObject<any>;
}) => {
  const mouse = useMouseValue({ absolute: true, ref: parent })
  const l10n = useL10n()
  const ttl = l10n(title)
  const ref = useRef<HTMLDivElement>(null)

  const options = {
    stiffness: 50,
    damping: 10,
    mass: 1
  }

  const springX = useSpring(useMotionValue(0), options)
  const springY = useSpring(useMotionValue(0), options)

  mouse.x.on('change', (value) => springX.set(value))
  mouse.y.on('change', (value) => springY.set(value))

  const activeRef = useRef(false)
  const insideRef = useRef(false)
  const animationRef = useRef<Animation | undefined>(undefined)

  useEffect(() => {
    if (!parent.current) return

    const handleMouseEnter = () => {
      insideRef.current = true

      if (animationRef.current)
        animationRef.current.cancel()

      animationRef.current = ref.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 150,
        easing: 'ease-in-out'
      })

      if (animationRef.current) {
        animationRef.current.onfinish = () => {
          activeRef.current = true
          if (ref.current) ref.current.style.opacity = '1'
        }
      }
    }

    const handleMouseLeave = () => {
      insideRef.current = false
    }

    parent.current.addEventListener('mouseenter', handleMouseEnter)
    parent.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      parent.current?.removeEventListener('mouseenter', handleMouseEnter)
      parent.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [parent])

  const unchangedRef = useRef(0)
  useAnimationFrame(() => {
    const hasMouseXChanged = Math.round(mouse.x.get()) !== Math.round(springX.get())
    const hasMouseYChanged = Math.round(mouse.y.get()) !== Math.round(springY.get())
    const hasMouseChanged = hasMouseXChanged || hasMouseYChanged

    unchangedRef.current = hasMouseChanged ? 0 : unchangedRef.current + 1

    if (ref.current) {
      ref.current.style.top = `${springY.get()}px`
      ref.current.style.left = `${springX.get()}px`
    }

    // Hide cursor after 10 frames of no movement
    if (activeRef.current && unchangedRef.current > 10 && insideRef.current) {
      if (animationRef.current)
        animationRef.current.cancel()

      animationRef.current = ref.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 150,
        easing: 'ease-in-out'
      })

      if (animationRef.current) {
        animationRef.current.onfinish = () => {
          activeRef.current = false
          if (ref.current) ref.current.style.opacity = '0'
          unchangedRef.current = 0
        }
      }
    }
  })

  return (
    <div ref={ ref } className={ styles.wrapper } style={{ opacity: 0 }}>
      <span>{ ttl }</span>
    </div>
  )
}

export default memo(Cursor)
