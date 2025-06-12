import React, { createContext, useState, useContext, useEffect } from 'react'

import { SOUNDS } from 'data/constants'

import { BaseProviderProps } from './GlobalProvider'

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
    [key: string]: HTMLAudioElement
  }
}

export const AudioContext = createContext<AudioContextType | null>(null)

let context: AudioContextType

export const AudioProvider = ({ children }: BaseProviderProps) => {
  const [audioEnabled, setAudioEnabled] = useState<boolean | null>(null)
  const [sounds, setSounds] = useState<AudioFiles>({})

  useEffect(() => {
    const audioFiles: AudioFiles = {
      ambiance: {
        light_main: new Audio(`fx/${SOUNDS.AMBIANCE.CATEGORY}/${SOUNDS.AMBIANCE.LIGHT_MAIN}.mp3`),
        dark_main: new Audio(`fx/${SOUNDS.AMBIANCE.CATEGORY}/${SOUNDS.AMBIANCE.DARK_MAIN}.mp3`)
      }
      // actions: {
      //   click: new Audio(`fx/${SOUNDS.ACTIONS.CATEGORY}/${SOUNDS.ACTIONS.CLICK}.mp3`)
      // }
    }
    setSounds(audioFiles)
  }, [])

  // Fonction pour jouer un son
  const playSound = (category: string, name: string, loop = false) => {
    if (audioEnabled && sounds[category] && sounds[category][name]) {
      sounds[category][name].loop = loop // Définit la boucle du son
      sounds[category][name].play()
    }
  }

  // Fonction pour arrêter un son
  const stopSound = (category: string, name: string) => {
    if (sounds[category] && sounds[category][name]) {
      sounds[category][name].pause()
      sounds[category][name].currentTime = 0
    }
  }

  // Fonction pour définir le volume d'un son
  const setVolume = (category: string, name: string, volume: number) => {
    if (sounds[category] && sounds[category][name])
      sounds[category][name].volume = volume
  }

  // Fonction pour activer ou désactiver la boucle d'un son
  const setLoop = (category: string, name: string, loop: boolean) => {
    if (sounds[category] && sounds[category][name])
      sounds[category][name].loop = loop
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
