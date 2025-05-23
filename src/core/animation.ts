import { Variants } from 'motion/react'
import easing, { bezier } from 'helpers/easing'

type DirectionalTransform = {
  x?: string | number,
  y?: string | number,
}
export const frameToMs = (frame: number) => {
  return frame / 60 * 1000
}
export const frameToS = (frame: number) => {
  return frame / 60
}

export const baseVariants = {
  initial: 'initial', animate: 'animate', exit: 'exit'
}

export const baseTransition = { duration: .7, ease: bezier.quintEaseOut }

export const appear = {
  variants: {
    initial: ({ invert = false } = {}) => ({ y: invert ? '-100%' : '100%' }),
    animate: { y: '0%' }
  } as Variants,
  // transformTemplate: ({ y }) => y !== '0%' ? `translateY(${y}) translateZ(0)` : 'none',
  transition: baseTransition
}

appear.variants.exit = appear.variants.initial

export const fadeAppear = {
  variants: {
    initial: { opacity: 0, scale: .95 },
    animate: { opacity: 1, scale: 1 }
  } as Variants,
  transition: baseTransition
}

fadeAppear.variants.exit = { opacity: 0, scale: .95 }

const toggleTransiton = (delay = 0) => {
  return ({ duration: .5, ease: easing.quintEaseInOut, delay })
}

export const toggle = {
  variants: {
    initial: ({ reverse = false, offset = '100%' } = {}) => ({
      y: reverse ? offset : '-' + offset,
      opacity: 0
    }),
    animate: ({ delay = 0 } = {}) => ({
      y: '0%',
      opacity: 1,
      transition: toggleTransiton(delay)
    }),
    exit: ({ reverse = false, offset = '100%', delay = 0 } = {}) => ({
      y: !reverse ? offset : '-' + offset,
      opacity: 0,
      transition: toggleTransiton(delay)
    })
  },
  transformTemplate: ({ y }: DirectionalTransform) => y !== '0%' ? `translateY(${y}) translateZ(0)` : 'none'
}

export const reverseToggle = { ...toggle, custom: { reverse: true } }

export const toggleX = {
  variants: {
    initial: { x: '-50%', opacity: 0 },
    animate: { x: '0%', opacity: 1 },
    exit: { x: '50%', opacity: 0 }
  },
  transformTemplate: ({ x } : DirectionalTransform) => x !== '0%' ? `translateX(${x}) translateZ(0)` : 'none',
  transition: { duration: 0.3, ease: baseTransition.ease }
}

export const toggleY = {
  variants: {
    initial: { y: '10%', opacity: 0 },
    animate: { y: '0%', opacity: 1 },
    exit: { y: '10%', opacity: 0 }
  },
  transformTemplate: ({ y } : DirectionalTransform) => y !== '0%' ? `translateY(${y}) translateZ(0)` : 'none',
  transition: baseTransition
}

export const fade = {
  variants: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  },
  transition: {
    duration: .3, ease: easing.linear
  }
}

export const fadeOverlay = {
  variants: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0,
      transition: {
        delay: frameToS(15)
      }
    }
  },
  transition: {
    duration: .3, ease: easing.linear
  }
}

export const cut = {
  variants: {
    initial: { visibility: 'hidden' },
    animate: { visibility: 'visible' },
    exit: { visibility: 'hidden' }
  } as Variants,
  transition: {
    duration: 0
  }
}

export const stagger = (stagger = .1, delay = 0) => ({
  variants: {
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }
})

export const staggerWithReverseExit = (stagger = .1, delay = 0, hasReversedDirection: boolean = false) => ({
  variants: {
    animate: {
      transition: {
        staggerDirection: hasReversedDirection ? -1 : 1,
        staggerChildren: stagger,
        delayChildren: delay
      }
    },
    exit: {
      transition: {
        staggerDirection: hasReversedDirection ? 1 : -1,
        staggerChildren: stagger
      }
    }
  }
})

export const staggerWithExit = (stagger = .1, delay = 0) => ({
  variants: {
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    },
    exit: {
      transition: {
        staggerChildren: stagger
      }
    }
  }
})

export const baseStagger = stagger()

export const delayOrchestration = (state: string | boolean | typeof baseVariants) => {
  if (state === false || state === baseVariants.initial || (state as typeof baseVariants)?.initial === baseVariants.initial)
    return { animate: baseVariants.initial, initial: baseVariants.initial }
  return {}
}
