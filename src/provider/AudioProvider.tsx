import React, { createContext, useState, useContext, useEffect, useRef } from 'react'

import { animate } from 'motion'
import { SOUNDS } from 'data/constants'

import { BaseProviderProps, useGlobalContext } from './GlobalProvider'

type AudioContextType = {
  audioEnabled: boolean | null
  setAudioEnabled: (enabled: boolean) => void
  playSound: (category: string, name: string, loop?: boolean) => void
  stopSound: (category: string, name: string) => void
  setVolume: (category: string, name: string, volume: number) => void
  setLoop: (category: string, name: string, loop: boolean) => void
}

type AudioFiles = {
  [key: string]: {
    [key: string]: {
      light: HTMLAudioElement
      dark: HTMLAudioElement
    }
  }
}

export const AudioContext = createContext<AudioContextType | null>(null)

let context: AudioContextType

const FADE_DURATION = 3

export const AudioProvider = ({ children }: BaseProviderProps) => {
  const { darkMode } = useGlobalContext()

  const [audioEnabled, setAudioEnabled] = useState<boolean | null>(null) // TODO: Change to null PROD
  const [sounds, setSounds] = useState<AudioFiles>({})
  const currentAmbianceRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audioFiles: AudioFiles = {
      ambiance: {
        main: {
          light: new Audio(`fx/${SOUNDS.AMBIANCE.CATEGORY}/light_main.mp3`),
          dark: new Audio(`fx/${SOUNDS.AMBIANCE.CATEGORY}/dark_main.mp3`)
        }
      },
      actions: {
        hover_basic: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_hover_basic.mp3`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_hover_basic.mp3`)
        },
        hold: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_hold.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_hold.wav`)
        },
        hold_end: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_hold_end.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_hold_end.wav`)
        },
        buy_shop: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_buy_shop.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_buy_shop.wav`)
        },
        buy_basic: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_buy_basic.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_buy_basic.wav`)
        },
        click_basic: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_click_basic.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_click_basic.wav`)
        },
        disabled: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/disabled.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/disabled.wav`)
        },
        arrow: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/arrow.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/arrow.wav`)
        },
        click_2: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_click_2.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_click_2.wav`)
        },
        click_success: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_click_success.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_click_success.wav`)
        },
        click_fail: {
          light: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/light_click_fail.wav`),
          dark: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/dark_click_fail.wav`)
        },
      }
    }
    setSounds(audioFiles)
  }, [])

  // Fonction pour récupérer le son en fonction du thème
  const getThemeSound = (category: string, name: string) => {
    const sound = sounds[category]?.[name]
    if (!sound) return null
    return darkMode ? sound.dark : sound.light
  }

  // Utilitaire pour ajuster progressivement le volume d'un audio.
  const fadeVolume = (audio: HTMLAudioElement, from: number, to: number, durationSec = FADE_DURATION) => {
    if (!audio) return

    animate(from, to, {
      duration: durationSec,
      ease: 'linear',
      onUpdate: latest => { audio.volume = latest },
      onComplete: () => {
        if (to === 0) {
          audio.pause()
          audio.currentTime = 0
        }
      }
    })
  }

  // Fonction pour jouer un son
  const playSound = (category: string, name: string, loop = false) => {
    const sound = getThemeSound(category, name)
    if (audioEnabled && sound) {
      // Spécifique à l'ambiance principale : crossfade quand on change de thème
      if (category === SOUNDS.AMBIANCE.CATEGORY && name === SOUNDS.AMBIANCE.MAIN) {
        const previous = currentAmbianceRef.current
        if (previous && previous !== sound) {
          sound.volume = 0
          sound.loop = true
          sound.play()
          fadeVolume(previous, previous.volume ?? 1, 0, FADE_DURATION)
          fadeVolume(sound, 0, 1, FADE_DURATION)
        } else if (previous == null) {
          sound.loop = loop
          sound.volume = 1
          sound.play()
        }
        currentAmbianceRef.current = sound
        return
      }

      if (loop) {
        // Sons à boucle (ex. musique) : on se contente de (re)jouer/réinitialiser
        sound.loop = true
        sound.currentTime = 0
        sound.play()
      } else {
        // Sons ponctuels (clics, hover, etc.) : on veut pouvoir les déclencher en rafale.
        // On clone l'élément audio pour permettre la superposition.
        const instance = sound.cloneNode(true) as HTMLAudioElement
        instance.volume = sound.volume
        instance.play()
        // Évite les fuites mémoire : on retire l'instance quand elle est terminée.
        instance.addEventListener('ended', () => {
          instance.remove()
        })
      }
    }
  }

  // Fonction pour arrêter un son
  const stopSound = (category: string, name: string) => {
    const sound = getThemeSound(category, name)
    if (sound) {
      sound.pause()
      sound.currentTime = 0
    }
  }

  // Fonction pour définir le volume d'un son
  const setVolume = (category: string, name: string, volume: number) => {
    const sound = getThemeSound(category, name)
    if (sound) sound.volume = volume
  }

  // Fonction pour activer ou désactiver la boucle d'un son
  const setLoop = (category: string, name: string, loop: boolean) => {
    const sound = getThemeSound(category, name)
    if (sound) sound.loop = loop
  }

  context = {
    audioEnabled,
    setAudioEnabled,
    playSound,
    stopSound,
    setVolume,
    setLoop // Ajout de la fonction pour contrôler la boucle
  }

  return (
    <AudioContext.Provider value={ context }>
      { children }
    </AudioContext.Provider>
  )
}

export function useAudioContext () {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudioContext must be used inside a `AudioProvider`')
  return context
}
