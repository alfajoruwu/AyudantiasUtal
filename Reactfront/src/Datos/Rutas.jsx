import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// importar componentes
import HorasAsignadas from '../Paginas/Coordinador/HorasAsignadas'
import Difusion from '../Paginas/Coordinador/Difusion'
import Resolucion from '../Paginas/Coordinador/Resolucion'
import DatosProfesor from '../Paginas/Profesor/DatosProfesor'
import VerPostulantes from '../Paginas/Profesor/VerPostulantes'
import Postulantes from '../Paginas/Profesor/Postulantes'
import PublicarAyudantias from '../Paginas/Profesor/PublicarAyudantias'
import Buscador from '../Paginas/Coordinador/ComponentesCoordinador/Buscador'
import Login from '../Paginas/Login/Login'
import OfertasAyudantias from '../Paginas/Alumno/OfertasAyudantias'
import Resultados from '../Paginas/Alumno/Resultados'
import DatosPersonales from '../Paginas/Alumno/DatosPersonales'
import InfAlumno from '../Paginas/Coordinador/AyudantesPag/InfAlumno'
import DatosCuenta from '../Paginas/Coordinador/AyudantesPag/DatosCuenta'
import Extras from '../Paginas/Coordinador/AyudantesPag/Extras'
import ListaProfesores from '../Paginas/Coordinador/ListaProfesores'
import PasswordReset from '../Paginas/Login/PasswordReset'
import PasswordResetRequest from '../Paginas/Login/ResetRequest'
import ProtectedRoute from '../utils/ProtectedRoute'

export const Rutas = () => {
  return (
    <Router>
      <Routes>
        {/* Añadir rutas de componentes */}
        <Route exact path='/' element={<Login />} />
        <Route path='/Buscador' element={<Buscador />} />

        {/* Profesor */}
        <Route element={<ProtectedRoute tipoDeUsuario='Profesor' />}>
          <Route path='/DatosProfesor' element={<DatosProfesor />} />
          <Route path='/VerPostulantes' element={<VerPostulantes />} />
          <Route path='/Postulantes/:oferta' element={<Postulantes />} />
          <Route path='/PublicarAyudantias' element={<PublicarAyudantias />} />
        </Route>

        {/* Coordinador */}
        <Route element={<ProtectedRoute tipoDeUsuario='Coordinador' />}>
          <Route path='/ListaProfesores' element={<ListaProfesores />} />
          <Route path='/Resolucion' element={<Resolucion />} />
          <Route path='/Difusion' element={<Difusion />} />
          <Route path='/HorasAsignadas' element={<HorasAsignadas />} />
          <Route path='/Ayudantes' element={<InfAlumno />} />
          <Route path='/DatosCuenta' element={<DatosCuenta />} />
          <Route path='/Extras' element={<Extras />} />
        </Route>

        {/* Estudiante */}
        <Route element={<ProtectedRoute tipoDeUsuario='Estudiante' />}>
          <Route path='/OfertasAyudantias' element={<OfertasAyudantias />} />
          <Route path='/Resultados' element={<Resultados />} />
          <Route path='/DatosPersonales' element={<DatosPersonales />} />
        </Route>

        {/* Reseteo de contraseña */}
        <Route path='/reset/:uid/:token' element={<PasswordReset />} />
        <Route path='/password_request' element={<PasswordResetRequest />} />
      </Routes>
    </Router>
  )
}

export default Rutas
