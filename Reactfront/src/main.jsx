import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { DataContextProvider } from './Datos/DataContext'
import Rutas from './Datos/Rutas.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <DataContextProvider>
      <Rutas />
    </DataContextProvider>
  </React.StrictMode>
)
