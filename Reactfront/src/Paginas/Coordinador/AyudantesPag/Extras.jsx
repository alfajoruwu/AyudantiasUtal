import React, { useState, useEffect } from 'react'

import { Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import axiosInstance from '../../../utils/axiosInstance'
import Button from 'react-bootstrap/Button'

import Navbar from '../../../Componentes/navbar/NavbarMarcela'
import Tabla from '../../../Componentes/Tablaejemplo/TablaSimplev2'
import '../ComponentesCoordinador/Ayudante.css'
import '../../App/App.css'
import exportToExcel from '../ComponentesCoordinador/ExportExcel'
import FiltroResolucion from '../../../Componentes/Filtros/FIltroResolucion'
import Busqueda from '../../../Componentes/Filtros/Busqueda'

const Extras = () => {
  const titulos = ['Proceso', 'Nombre', 'RUN', 'Charla de género', 'Fecha inicio', 'Fecha término', 'Riesgo académico']

  const [rows2, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroResolucion, setFiltroResolucion] = useState('Todos')
  const [resolucion, setResolucion] = useState([])
  const [busquedaRUN, setBusquedaRUN] = useState('')

  useEffect(() => {
    axiosInstance.get('/Postulaciones')
      .then((res) => {
        const resoluciones = res.data.map((row) => row.resolucion || 'No asignado')
        setResolucion(['Todos', ...new Set(resoluciones)])
        const rows = res.data.map((row) => {
          return {
            resolucion: row.resolucion ? row.resolucion : 'No asignado',
            Nombre: row.nombre_postulante,
            RUN: row.run_postulante,
            Charla: row.charla == true ? 'Sí' : 'No',
            fechaInicio: row.fecha_inicio,
            fechaFin: row.fecha_termino,
            Riesgo: row.riesgo_academico == true ? 'Sí' : 'No',
          }
        })
        setRows(rows)
        setLoading(false)
      })
      .catch((err) => {
        setError('Error fetching data')
        setLoading(false)
      })
  }, [])

  const exportData = () => {
    exportToExcel(rows2, 'Extras.xlsx', 'Extras')
  }

  const handleFiltroResolucion = (resolucion) => {
    setFiltroResolucion(resolucion)
  }

  const handleBusquedaRUN = (busqueda) => {
    setBusquedaRUN(busqueda)
  }

  const filtros = {
    resolucion: (row) => filtroResolucion === 'Todos' || row.resolucion === filtroResolucion,
    RUN: (row) => row.RUN.includes(busquedaRUN)
  }

  const aplicarFiltros = (rows, filtros) => {
    return rows.filter((row) => {
      return Object.keys(filtros).every((key) => {
        return filtros[key](row)
      })
    })
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
              {' '}
              Inf. Alumno{' '}
            </NavLink>
            <NavLink
              to='/DatosCuenta'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              {' '}
              Datos cuenta{' '}
            </NavLink>
            <NavLink
              to='/Extras'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              {' '}
              Extras{' '}
            </NavLink>
          </Col>
        </div>
        <div className='row mt-3'>
          <FiltroResolucion
            resoluciones={resolucion}
            resolucionSeleccionada={filtroResolucion}
            handleResolucionSeleccionada={handleFiltroResolucion}
          />
          <Busqueda columna='RUN' onBuscar={handleBusquedaRUN} />
        </div>
        <div className='row mt-3'>
          <Tabla titulos={titulos} rows={filteredData} mostrarBoton={false} />
        </div>
        <div className='row mt-3 justify-content-center'>
          <Col xs='auto' className='d-flex justify-content-center'>
            <Button className='btn color-btn' onClick={() => exportData()}>Exportar a Excel</Button>
          </Col>
        </div>
      </div>
    </div>
  )
}

export default Extras
