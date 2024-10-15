// React
import { React } from 'react'

// estilos
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import '../../index.css'

// variables glovales
import { DataContext } from '../../Datos/DataContext'

// componentes

import Navbar from '../../Componentes/navbar/NavbarMarcela'
import Ejemplo from '../../Componentes/Ejemplo/Ejemplo'

function App () {
  return (
    console.log('Dato de la variable global: ', DataContext.Variablerandom),
      <>
        <div className='principal'>
          <Navbar />
          <Ejemplo />
        </div>
      </>
  )
}

export default App
