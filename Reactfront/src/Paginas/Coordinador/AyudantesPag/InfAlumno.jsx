// InfAlumno.jsx
import React, { useEffect, useState } from 'react'
import { Col, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

import '../../App/App.css'
import Navbar from '../../../Componentes/navbar/NavbarMarcela'
import Tabla from '../../../Componentes/Tablaejemplo/TablaSimplev2'
import '../ComponentesCoordinador/Ayudante.css'
import axiosInstance from '../../../utils/axiosInstance'
import exportToExcel from '../ComponentesCoordinador/ExportExcel'
import FiltroResolucion from '../../../Componentes/Filtros/FIltroResolucion'
import Busqueda from '../../../Componentes/Filtros/Busqueda'

const InfAlumno = () => {
  const titulos = ['Proceso', 'Nombre', 'RUN', 'Módulo', 'Nota aprobación', 'Promedio', 'N° contacto', 'Correo']

  const [rows2, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroResolucion, setFiltroResolucion] = useState('Todos')
  const [resolucion, setResolucion] = useState([])
  const [busquedaRUN, setBusquedaRUN] = useState('')

  useEffect(() => {
    axiosInstance.get('/Postulaciones')
      .then((res) => {
        console.log(res.data)
        const resoluciones = res.data.map((row) => row.resolucion || 'No asignado')
        setResolucion(['Todos', ...new Set(resoluciones)])
        const rows = res.data.map((row) => ({
          resolucion: row.resolucion ? row.resolucion : 'No asignado',
          Nombre: row.nombre_postulante,
          RUN: row.run_postulante,
          Módulo: row.modulo,
          nota: row.naprobacion,
          Promedio: row.promedio,
          Ncontacto: row.ncontacto,
          Correo: row.correo
        }))
        setRows(rows)
      })
      .catch((err) => {
        setError('Error fetching data')
        setLoading(false)
      })
  }, [])

  const handleFiltroResolucion = (resolucion) => {
    setFiltroResolucion(resolucion)
  }

  const exportData = () => {
    exportToExcel(rows2, 'InfoAlumnos.xlsx', 'InfoAlumnos')
  }

  const aplicarFiltros = (rows, filtros) => {
    return rows.filter((row) => {
      return Object.keys(filtros).every((key) => {
        return filtros[key](row)
      })
    })
  }

  const handleBuscarRUN = (valorBusqueda) => {
    setBusquedaRUN(valorBusqueda)
  }

  const filtros = {
    resolucionSeleccionada: (item) => filtroResolucion === 'Todos' || item.resolucion === filtroResolucion,
    buscarRUN: (item) => busquedaRUN === '' || item.RUN.includes(busquedaRUN)
  }

  const filteredData = aplicarFiltros(rows2, filtros)

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mt-3 justify-content-center'>
          <Col xs='auto' className='d-flex justify-content-center'>
            <NavLink
              to='/Ayudantes'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              Inf. Alumno
            </NavLink>
            <NavLink
              to='/DatosCuenta'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              Datos cuenta
            </NavLink>
            <NavLink
              to='/Extras'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              Extras
            </NavLink>
          </Col>
        </div>
        <div className='row mt-3'>
          <FiltroResolucion
            resoluciones={resolucion}
            resolucionSeleccionada={filtroResolucion}
            handleResolucionSeleccionada={handleFiltroResolucion}
          />
          <Busqueda columna='RUN' onBuscar={handleBuscarRUN} />
        </div>
        <div className='row mt-3'>
          <Tabla titulos={titulos} rows={filteredData} mostrarBoton={false} />
        </div>
        <div className='row mt-3 justify-content-center'>
          <Col xs='auto' className='d-flex justify-content-center'>
            <Button className='btn color-btn' onClick={exportData}>
              Exportar a Excel
            </Button>
          </Col>
        </div>
      </div>
    </div>
  )
}

export default InfAlumno
