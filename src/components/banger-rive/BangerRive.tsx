import React, { memo, useEffect, useCallback } from 'react'

import { Alignment, Event, Fit, RiveProps } from 'rive-react'
import { Layout, EventType, useRive } from '@rive-app/react-canvas'

type BangerRiveProps = {
  onEvent?: (event: Event) => void;
  onStateChange?: (event: Event) => void;
  autoplay?: boolean;
  animations?: RiveProps['animations'];
} & RiveProps;

const DEFAULT_PROPS: Partial<BangerRiveProps> = {
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.TopCenter }),
  autoplay: true
}

function BangerRive ({
  onEvent,
  onStateChange,
  animations,
  ...props
}: BangerRiveProps) {
  const { RiveComponent, rive } = useRive({ ...DEFAULT_PROPS, ...props })

  // Handlers
  const handleStateChange = useCallback((e: Event) => onStateChange?.(e), [onStateChange])
  const handleEvent = useCallback((e: Event) => onEvent?.(e), [onEvent])
  // const handleDance = () => useStateMachineInput(rive, 'StateMachine', animations?.[0])?.fire()

  console.log('animations', animations)

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

    // We can't use hooks inside useEffect, so we need to get the input directly from rive
    const stateMachine = rive.stateMachineInputs('StateMachine')
    const danceInput = stateMachine?.find(input => input.name === animations[0])
    if (danceInput) danceInput.fire()
  }, [animations, rive])

  return <RiveComponent />
}

export default memo(BangerRive)
