import { useEffect, useState } from 'react'

const useTimings = (timings: Record<string, number>, initialControl: boolean = false) => {
  const getInitialState = () => {
    return Object.keys(timings).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, boolean>)
  }

  const [control, setControl] = useState<boolean>(initialControl)
  const [state, setState] = useState<Record<string, boolean>>(getInitialState())

  useEffect(() => {
    if (!control) return
    const timeout = Object.keys(timings).reduce((acc, key: string) => {
      acc[key] = setTimeout(() => {
        setState((prevState) => ({ ...prevState, [key]: true }))
      }, timings[key] * 1000)
      return acc
    }, {} as Record<string, any>)

    return () => {
      Object.keys(timeout).forEach((key) => clearTimeout(timeout[key]))
    }
  }, [control])

  const reset = () => {
    setState(getInitialState())
    setControl(false)
  }

  return [state, () => setControl(true), reset, control] as const
}

export default useTimings
