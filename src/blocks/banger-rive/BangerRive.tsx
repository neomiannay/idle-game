import React, { useEffect, useCallback } from 'react'

import { Alignment, Event, Fit, RiveProps } from 'rive-react'
import { Layout, EventType, useRive } from '@rive-app/react-canvas'

type BangerRiveProps = {
  id?: string;
  onEvent?: (event: Event) => void;
  onStateChange?: (event: Event) => void;
  autoplay?: boolean;
  animations?: RiveProps['animations'];
  save?: boolean;
  stateMachine?: string;
} & RiveProps;

const DEFAULT_PROPS: Partial<BangerRiveProps> = {
  stateMachine: 'StateMachine',
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.TopCenter }),
  autoplay: true,
  save: true
}

/**
 * Banger Rive Component
 * @param {BangerRiveProps} props - The props for the Banger Rive component
 * @returns {React.ReactNode} The Banger Rive component
 */
function BangerRive ({
  id,
  onEvent,
  onStateChange,
  animations,
  save,
  stateMachine,
  ...props
}: BangerRiveProps) {
  const { RiveComponent, rive } = useRive({ ...DEFAULT_PROPS, ...props })

  stateMachine ??= DEFAULT_PROPS.stateMachine ?? ''
  id ??= props.src
  save ??= DEFAULT_PROPS.save
  const storageKey = `rive-${id}`
  let animationName: string | undefined

  // Handlers
  const handleStateChange = useCallback((e: Event) => onStateChange?.(e), [onStateChange])
  const handleEvent = useCallback((e: Event) => onEvent?.(e), [onEvent])

  useEffect(() => {
    if (!rive) return

    rive.setupRiveListeners()

    // Enable Rive listeners for interactions
    rive.on(EventType.StateChange, handleStateChange)
    rive.on(EventType.RiveEvent, handleEvent)

    return () => {
      rive.off(EventType.StateChange, handleStateChange)
      rive.off(EventType.RiveEvent, handleEvent)
    }
  }, [rive, handleStateChange, handleEvent])

  useEffect(() => {
    if (!animations || !rive) return

    const inputList = rive.stateMachineInputs(stateMachine)
    animationName = animations[0]
    const input = inputList?.find(input => input.name === animationName)
    input?.fire()
  }, [animations, rive])

  return <RiveComponent />
}

export default BangerRive
