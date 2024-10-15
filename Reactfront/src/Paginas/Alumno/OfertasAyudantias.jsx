import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import NavbarAlumno from '../../Componentes/navbar/NavbarAlumno'
import TablaAlumno from '../../Componentes/Tablaejemplo/TablaAlumno'
import React, { useState, useEffect } from 'react'
// import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance'
import FiltroModulo from '../../Componentes/Filtros/FiltroModulo'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const titulos = {
  Asignatura: 'Módulo',
  NombreProfesor: 'Nombre profesor',
  HorasTotales: 'Horas totales',
  Nota: 'Nota de aprobación',
  Comentario:'Comentario',
  '': 'Postular'
}

const OfertasAyudantias = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [hourFilter, setHourFilter] = useState({ value: '', operator: '' })
  const [moduloSeleccionado, setModuloSeleccionado] = useState('Todos')

  useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Ofertas/')
        console.log(response.data)
        const newData = response.data.map(item => ({
          Asignatura: item.modulo,
          NombreProfesor: item.profesor,
          HorasTotales: item.horas_ayudantia,
          id: item.id
        }))
        setData(newData)
      } catch (error) {
        setError(error)        
      }
    }

    ObtenerDatos()
  }, [])

  const handleModuloSeleccionado = (modulo) => {
    setModuloSeleccionado(modulo)
  }

  const handleHourFilterValue = (e) => {
    const value = e.target.value
    setHourFilter({ ...hourFilter, value })
  }

  const handleHourFilterOperator = (e) => {
    const value = e.target.value
    setHourFilter({ ...hourFilter, operator: value })
  }

  // Obtener opciones únicas para el dropdown de módulos
  const uniqueModules = [...new Set(data.map(item => item.Asignatura))]

  const filtros = {
    modulo: (row) => moduloSeleccionado === 'Todos' || row.Asignatura === moduloSeleccionado,
    horas: (row) => {
      if (!hourFilter.value) return true
      switch (hourFilter.operator) {
        case '=':
          return row.HorasTotales === parseInt(hourFilter.value)
        case '<':
          return row.HorasTotales < parseInt(hourFilter.value)
        case '>':
          return row.HorasTotales > parseInt(hourFilter.value)
        default:
          return true
      }
    }
  }

  const aplicarFiltros = (data, filtros) => {
    console.log(data)
    return data.filter(item => {
      for (const key in filtros) {
        if (filtros[key] && !filtros[key](item)) {
          return false
        }
      }
      return true
    })
  }

  const filteredData = aplicarFiltros(data, filtros)

  return (
    <div className='principal'>
      <NavbarAlumno />
      <div className='container Componente'>
        <div className='row mb-3'>
          <FiltroModulo modulos={['Todos', ...uniqueModules]} moduloSeleccionado={moduloSeleccionado} handleModuloSeleccionado={handleModuloSeleccionado} />
          <div className='col-md-6'>
            <label htmlFor='filtro-horas' className='form-label'>Filtrar por horas totales:</label>
            <div className='d-flex align-items-center'>
              <select
                className='form-control me-2'
                value={hourFilter.operator}
                onChange={handleHourFilterOperator}
              >
                <option value=''>Seleccionar</option>
                <option value='='>Igual a</option>
                <option value='<'>Menor que</option>
                <option value='>'>Mayor que</option>
              </select>
              <input
                type='number'
                className='form-control'
                placeholder='Cantidad de horas'
                value={hourFilter.value}
                onChange={handleHourFilterValue}
              />
            </div>
          </div>
        </div>
        {error
          ? (
            <div className='alert alert-danger' role='alert'>
              Error al cargar los datos: {error.message}
            </div>
            )
          : (
            <TablaAlumno titulos={titulos} rows={filteredData} />
            )}
            <ToastContainer />
      </div>
    </div>
  )
}

export default OfertasAyudantias
