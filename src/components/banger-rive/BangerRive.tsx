import React, { memo, useEffect } from 'react'

import { Alignment, Event, Fit, RiveProps } from 'rive-react'
import { Layout, EventType, useRive } from '@rive-app/react-canvas'

type BangerRiveProps = {
  onEvent?: (event: Event) => void;
  onStateChange?: (event: Event) => void;
  autoplay?: boolean;
} & RiveProps;

const DEFAULT_PROPS: BangerRiveProps = {
  src: 'rive/explore_button.riv',
  stateMachines: 'State Machine 1',
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.TopCenter }),
  autoplay: true
}

function BangerRive ({
  onEvent,
  onStateChange,
  ...props
}: BangerRiveProps = DEFAULT_PROPS) {
  const { RiveComponent, rive } = useRive({ ...DEFAULT_PROPS, ...props })

  useEffect(() => {
    if (!rive) return

    // Enable Rive listeners for interactions
    rive.setupRiveListeners()

    rive.on(EventType.StateChange, (event: Event) => onStateChange?.(event))
    rive.on(EventType.RiveEvent, (event: Event) => onEvent?.(event))
  }, [rive])

  return <RiveComponent />
}

export default memo(BangerRive)
