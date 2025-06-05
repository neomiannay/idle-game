import React, { useEffect } from 'react'

import { Alignment, EventCallback, EventType, Fit, Layout, RiveProps, StateMachineInput, useRive } from '@rive-app/react-webgl2'
import math from 'helpers/math'

type BangerRiveProps = {
  id?: string;
  onEvent?: EventCallback;
  onStateChange?: EventCallback;
  onInputsChange?: (inputs: StateMachineInput[]) => void;
  autoplay?: boolean;
  animations?: RiveProps['animations'];
  save?: boolean;
  onLoad?: () => void;
} & RiveProps;

const DEFAULT_PROPS: Partial<BangerRiveProps> = {
  stateMachines: ['StateMachine'],
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.TopCenter }),
  autoplay: true,
  save: true
}

/**
 * Banger Rive Component
 * @param {BangerRiveProps} props - The props for the Banger Rive component
 */
function BangerRive ({
  id,
  onEvent,
  onStateChange,
  onInputsChange,
  animations,
  save,
  onLoad,
  ...props
}: BangerRiveProps) {
  props.stateMachines ??= DEFAULT_PROPS.stateMachines ?? ['']

  const { RiveComponent, rive } = useRive({
    ...DEFAULT_PROPS,
    ...props,
    onLoad
  })

  id ??= props.src
  save ??= DEFAULT_PROPS.save
  let animationName: string | undefined
  let inputList: StateMachineInput[] | undefined

  useEffect(() => {
    if (!rive) return

    // Handlers
    const handleStateChange: EventCallback = (e) => onStateChange?.(e)
    const handleEvent: EventCallback = (e) => onEvent?.(e)

    rive.setupRiveListeners()

    // Enable Rive listeners for interactions
    rive.on(EventType.StateChange, handleStateChange)
    rive.on(EventType.RiveEvent, handleEvent)

    return () => {
      rive.off(EventType.StateChange, handleStateChange)
      rive.off(EventType.RiveEvent, handleEvent)
    }
  }, [rive, onStateChange, onEvent])

  useEffect(() => {
    if (!rive) return

    const inputs = rive.stateMachineInputs(math.getFirstElement(props.stateMachines!))
    inputList = inputs
    onInputsChange?.(inputs)
  }, [rive, onInputsChange, props.stateMachines])

  useEffect(() => {
    if (!animations || !rive) return
    animationName = animations[0]

    const input = inputList?.find(input => input.name === animationName)
    input?.fire()
  }, [animations, rive])

  return <RiveComponent />
}

export default BangerRive
