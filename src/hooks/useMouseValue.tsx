import { RefObject, useEffect } from 'react'

import { useViewportContext } from 'provider/ViewportProvider'

import useObjectMotionValue from './useObjectMotionValue'

type MouseValueProps = {
  ref?: RefObject<any>
  absolute?: boolean
}

const useMouseValue = ({
  ref,
  absolute = false
}: MouseValueProps) => {
  const mouse = useObjectMotionValue({ x: 0, y: 0 })
  const { sizes } = useViewportContext()

  useEffect(() => {
    const target = ref?.current || window

    const onMouseMove = (e : MouseEvent) => {
      if (absolute) {
        mouse.set({
          x: e.clientX,
          y: e.clientY
        })
      } else {
        mouse.set({
          x: e.clientX / sizes.width.get(),
          y: e.clientY / sizes.height.get()
        })
      }
    }

    target.addEventListener('mousemove', onMouseMove as any)

    return () => {
      target.removeEventListener('mousemove', onMouseMove as any)
    }
  }, [ref, absolute])

  return {
    x: mouse.x,
    y: mouse.y
  }
}

export default useMouseValue
