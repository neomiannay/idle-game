import { Variant, Variants } from 'motion/react'
import easing, { bezier } from 'helpers/easing'

type DirectionalTransform = {
  x?: string | number;
  y?: string | number;
};
export const frameToMs = (frame: number) => {
  return (frame / 60) * 1000
}
export const frameToS = (frame: number) => {
  return frame / 60
}

export const removeUndefined = (obj: any) => Object.keys(obj).reduce((acc, key) => obj[key] ? { ...acc, [key]: obj[key] } : acc, {})

export const baseVariants = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit'
}

export const baseTransition = { duration: 0.7, ease: bezier.quintEaseOut }

export const appear = {
  variants: {
    initial: ({ invert = false } = {}) => ({ y: invert ? '-100%' : '100%' }),
    animate: { y: '0%' },
    exit: ({ invert = false } = {}) => ({ y: invert ? '100%' : '-100%' })
  } as Variants,
  // transformTemplate: ({ y }) => y !== '0%' ? `translateY(${y}) translateZ(0)` : 'none',
  transition: baseTransition
}

export const fadeAppear = (available: boolean = true) => ({
  variants: {
    initial: ({ invert = false } = {}) => ({ y: invert ? '-30%' : '30%', opacity: 0 }),
    animate: { y: '0%', opacity: available ? 1 : 0.4 },
    exit: ({ invert = false } = {}) => ({ y: invert ? '30%' : '-30%', opacity: 0 })
  } as Variants,
  transition: baseTransition
})

export const simpleFadeAppear = () => ({
  variants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  } as Variants,
  transition: baseTransition
})

export const shopHoverAnimation = (isHovering: boolean, translateYValue = '-100%') => ({
  variants: {
    initial: { y: '0%' },
    animate: { y: isHovering ? translateYValue : '0%' }
  } as Variants,
  transition: baseTransition
})

export const fadeAppearRabbit = {
  variants: {
    initial: ({ invert = false } = {}) => ({
      y: invert ? '-30%' : '30%',
      opacity: 0
    }),
    animate: { y: '0%', opacity: 1 },
    exit: ({ invert = false } = {}) => ({
      y: invert ? '-30%' : '30%',
      opacity: 0
    })
  } as Variants,
  transition: baseTransition
}

export const maskTextVariants = {
  initial: { y: 0 },
  animate: {
    y: '-101%',
    transition: baseTransition
  },
  exit: {
    y: '-202%',
    transition: baseTransition
  }
}

const toggleTransiton = (delay = 0) => {
  return { duration: 0.5, ease: easing.quintEaseInOut, delay }
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
  transformTemplate: ({ x }: DirectionalTransform) => x !== '0%' ? `translateX(${x}) translateZ(0)` : 'none',
  transition: { duration: 0.3, ease: baseTransition.ease }
}

export const toggleY = {
  variants: {
    initial: { y: '10%', opacity: 0 },
    animate: { y: '0%', opacity: 1 },
    exit: { y: '10%', opacity: 0 }
  },
  transformTemplate: ({ y }: DirectionalTransform) => y !== '0%' ? `translateY(${y}) translateZ(0)` : 'none',
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
    duration: 0.3,
    ease: easing.linear
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
    duration: 0.3,
    ease: easing.linear
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

export const rabbitAnimation = () => ({
  variants: {
    initial: { opacity: 1, scale: 0.9, rotate: -5, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' },
    exit: { opacity: 1, scale: 0.9, rotate: 5, filter: 'blur(4px)' }
  } as Variants,
  transition: {
    duration: 0.2,
    type: 'spring',
    filter: { duration: 0.2 }
  }
})

export const tooltipAnimation = () => ({
  variants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  } as Variants,
  transition: baseTransition
})

export const stagger = (stagger: number = .1, delay: number = 0) => ({
  variants: {
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }
})

export const staggerWithReverseExit = (
  stagger = 0.1,
  delay = 0,
  hasReversedDirection: boolean = false
) => ({
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

export const staggerWithExit = (stagger = 0.1, delay = 0) => ({
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

export const conditionalAnimation = (condition: boolean, animateOverride: Variants) => ({
  initial: baseVariants.initial,
  animate: (condition ? animateOverride.animate || baseVariants.animate : baseVariants.initial) as Variant
})

export const delayOrchestration = (state: string | boolean | typeof baseVariants) => {
  if (state === false || state === baseVariants.initial || (state as typeof baseVariants)?.initial === baseVariants.initial)
    return { animate: baseVariants.initial, initial: baseVariants.initial }
  return {}
}
