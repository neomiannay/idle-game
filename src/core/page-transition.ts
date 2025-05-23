import { Transition, Variants } from 'motion/react'
import { bezier } from 'helpers/easing'

import { baseTransition, frameToS } from './animation'

export const PageTransitions = {
  leftToRight: 'left-to-right',
  rightToLeft: 'right-to-left',
  bottomOverlayExit: 'bottom-overlay-exit',
  bottomOverlayEnter: 'bottom-overlay-enter',
  topOverlayExit: 'top-overlay-exit',
  topOverlayEnter: 'top-overlay-enter',
  horizontal: 'horizontal',
  none: 'none'
} as const

export type PageTransitionType = typeof PageTransitions[keyof typeof PageTransitions]
export type PageTransitionCustom = { type?: PageTransitionType }

const vertical = (d: PageTransitionType) => {
  return d === PageTransitions.bottomOverlayEnter || d === PageTransitions.bottomOverlayExit || d === PageTransitions.topOverlayEnter || d === PageTransitions.topOverlayExit
}

const inverted = (d: PageTransitionType) => {
  return d === PageTransitions.rightToLeft || d === PageTransitions.bottomOverlayExit || d === PageTransitions.bottomOverlayEnter
}

const axe = (d: PageTransitionType) => {
  return vertical(d) ? 'y' : 'x'
}

const adapt = (d: PageTransitionType, rawValue: string | number) => {
  const value = parseFloat(rawValue.toString())
  const unit = rawValue.toString().replace(value.toString(), '').trim() || 'px'
  if (inverted(d)) return `${value}${unit}`
  return `${-value}${unit}`
}

const unit = (d: PageTransitionType) => {
  if (d === PageTransitions.leftToRight || d === PageTransitions.rightToLeft) return 'vw'
  return 'vh'
}

const initial = ({ type = PageTransitions.leftToRight }:PageTransitionCustom = {}) => {
  if (type === PageTransitions.none) {
    return {
      visibility: 'visible',
      '--overlay': 0
    }
  }

  if (type === PageTransitions.rightToLeft || type === PageTransitions.leftToRight) {
    return {
      visibility: 'visible',
      opacity: 0,
      x: adapt(type, '-30vw')
    }
  }

  if (type === PageTransitions.bottomOverlayExit || type === PageTransitions.topOverlayExit) { // Behind
    return {
      [axe(type)]: 0,
      '--overlay': 1,
      visibility: 'visible',
      zIndex: 10
    }
  } else if (type === PageTransitions.bottomOverlayEnter || type === PageTransitions.topOverlayEnter) {
    return {
      visibility: 'visible',
      [axe(type)]: adapt(type, '100' + unit(type)),
      zIndex: 50,
      '--clip-progress': 0
    }
  } else { // In front
    return {
      visibility: 'visible',
      [axe(type)]: adapt(type, '100' + unit(type)),
      zIndex: 50,
      '--clip-progress': 0
    }
  }
}

const animate = ({ type = PageTransitions.leftToRight }:PageTransitionCustom = {}) => {
  if (type === PageTransitions.none) return { '--overlay': 0 }

  let transition : Transition = { ...baseTransition }
  if (type === PageTransitions.rightToLeft || type === PageTransitions.leftToRight)
    transition = transitions.animate.horizontal

  if (type === PageTransitions.bottomOverlayEnter || type === PageTransitions.topOverlayEnter)
    transition = transitions.animate.topOverlay

  return {
    x: 0, // Force override
    y: 0, // Force override
    '--overlay': 0,
    opacity: 1,
    [axe(type)]: 0,
    '--clip-progress': 1,
    transition

  }
}

const exit = ({ type = PageTransitions.leftToRight }:PageTransitionCustom = {}) => {
  if (type === PageTransitions.none) return { '--overlay': 0 }

  if (type === PageTransitions.rightToLeft || type === PageTransitions.leftToRight) {
    return {
      visibility: 'visible',
      opacity: 0,
      x: adapt(type, '30vw'),
      transition: {
        ...transitions.exit.horizontal
      }
    }
  }

  if (type !== PageTransitions.bottomOverlayExit && type !== PageTransitions.topOverlayExit) { // Behind
    return {
      [axe(type)]: 0,
      '--overlay': 1,
      zIndex: 10
    }
  } else { // In front
    return {
      [axe(type)]: adapt(type, '100' + unit(type)),
      zIndex: 50,
      '--clip-progress': 0

    }
  }
}

export const pageTransition = {
  variants: {
    initial,
    animate,
    exit
  } as Variants,
  // transformTemplate: ({ x = 0, y = 0 }: DirectionalTransform) => x !== 0 ? `translate3d(${x}, ${y}, 0)` : 'none',
  transition: baseTransition
}

const transitions = {
  initial: {},
  animate: {
    topOverlay: {
      '--clip-progress': {
        ...baseTransition
        // ease: bezier.quadEaseOut
      },
      y: {
        ...baseTransition
        // delay: .1
      }
    },
    horizontal: {
      x: {
        ...baseTransition,
        duration: frameToS(35),
        delay: frameToS(5)
      },
      opacity: {
        ...baseTransition,
        duration: frameToS(20),
        delay: frameToS(20)
      }
    }
  },
  exit: {
    horizontal: {
      x: {
        ease: bezier.quintEaseIn,
        duration: frameToS(35)
      },
      opacity: {
        ease: bezier.quintEaseIn,
        duration: frameToS(20)
      }
    }
  }
}
