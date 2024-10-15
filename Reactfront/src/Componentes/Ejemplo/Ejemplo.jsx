// React
import { useContext, React } from 'react'
import { NavLink } from 'react-router-dom'

// estilos
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../index.css'

// variables glovales
import { DataContext } from '../../Datos/DataContext'

// componentes
import Tablaejemplo from '../Tablaejemplo/Tablaejemplo'

const Ejemplo = () => {
  const { Variablerandom } = useContext(DataContext)

  return (

    <div className='container Componente'>

      <div className='row' style={{ marginBottom: '1rem' }}>
        Hola soy ejemplo 1 - {Variablerandom}
      </div>

      <div className='row' style={{ marginBottom: '1rem' }}>
        <Tablaejemplo />
      </div>

      <div className='row'>
        <NavLink to='/PaginaEjemplo' className='btn color-btn'> ir a ejemplo </NavLink>
      </div>

    </div>

  )
}

export default Ejemplo
