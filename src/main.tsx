import * as React from 'react'

import './styles/globals.scss'

import { createRoot } from 'react-dom/client'

import Root from './components/root/Root'
import { GlobalProvider } from './provider/GlobalProvider'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <GlobalProvider>
    <Root />
  </GlobalProvider>
)
