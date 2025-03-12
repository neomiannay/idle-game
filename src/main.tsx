import * as React from 'react'

import { createRoot } from 'react-dom/client'

import './styles/globals.scss'
import Root from './components/root/Root'
import { GlobalProvider } from './provider/GlobalProvider'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <GlobalProvider>
    <Root />
  </GlobalProvider>
)
