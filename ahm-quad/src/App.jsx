import React from 'react'
import AppRouter from './AppRouter'
import { ClientStateContextProvider } from './context/ClientStateContext'
import { BrowserRouter } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <ClientStateContextProvider>
        <AppRouter />
      </ClientStateContextProvider>
    </BrowserRouter>
  )
}

export default App