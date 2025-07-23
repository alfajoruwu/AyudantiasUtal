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
        console.error('Error al obtener ofertas de ayudantías:', error)
        
        if (error.response) {
          const { status, data } = error.response
          
          switch (status) {
            case 401:
              toast.error('Su sesión ha expirado. Por favor inicie sesión nuevamente.', { position: 'bottom-right' })
              setError({ message: 'Sesión expirada. Inicie sesión nuevamente.' })
              break
              
            case 403:
              toast.error('No tiene permisos para acceder a estas ofertas.', { position: 'bottom-right' })
              setError({ message: 'Sin permisos para acceder a los datos.' })
              break
              
            case 404:
              toast.error('No se encontraron ofertas disponibles.', { position: 'bottom-right' })
              setError({ message: 'No hay ofertas disponibles.' })
              break
              
            case 500:
              toast.error('Error en el servidor. Intente más tarde.', { position: 'bottom-right' })
              setError({ message: 'Error del servidor. Intente más tarde.' })
              break
              
            default:
              if (data && data.detail) {
                toast.error(`Error: ${data.detail}`, { position: 'bottom-right' })
                setError({ message: data.detail })
              } else {
                toast.error(`Error (${status}): Problema al cargar las ofertas.`, { position: 'bottom-right' })
                setError({ message: `Error ${status}: No se pudieron cargar las ofertas.` })
              }
          }
        } else if (error.request) {
          // No se recibió respuesta del servidor
          toast.error('No se pudo conectar con el servidor. Verifique su conexión.', { position: 'bottom-right' })
          setError({ message: 'Error de conexión. No se pudo contactar con el servidor.' })
        } else {
          // Error en la configuración de la solicitud
          toast.error('Error al preparar la solicitud: ' + error.message, { position: 'bottom-right' })
          setError({ message: `Error en la solicitud: ${error.message}` })
        }       
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
    const resultados = data.filter(item => {
      for (const key in filtros) {
        if (filtros[key] && !filtros[key](item)) {
          return false
        }
      }
      return true
    })
    
    // Si se aplicaron filtros y no hay resultados, mostrar mensaje
    if (resultados.length === 0 && (moduloSeleccionado !== 'Todos' || hourFilter.value)) {
      let mensajeFiltro = ''
      
      if (moduloSeleccionado !== 'Todos') {
        mensajeFiltro += `módulo '${moduloSeleccionado}'`
      }
      
      if (hourFilter.value) {
        const operadorTexto = hourFilter.operator === '=' ? 'igual a' : 
                             hourFilter.operator === '<' ? 'menor que' : 
                             hourFilter.operator === '>' ? 'mayor que' : '';
                             
        mensajeFiltro += mensajeFiltro ? ` y horas ${operadorTexto} ${hourFilter.value}` : 
                                        `horas ${operadorTexto} ${hourFilter.value}`
      }
      
      if (mensajeFiltro) {
        toast.info(`No se encontraron ayudantías con ${mensajeFiltro}`, { position: 'bottom-right' })
      }
    }
    
    return resultados
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
              <h5>No se pudieron cargar las ofertas de ayudantías</h5>
              <p>{error.message}</p>
              <p>Si el problema persiste, contacte al administrador del sistema.</p>
            </div>
            )
          : filteredData.length > 0
            ? (
              <TablaAlumno titulos={titulos} rows={filteredData} />
              )
            : (
              <div className='alert alert-info' role='alert'>
                No se encontraron ayudantías que coincidan con los filtros aplicados.
              </div>
              )}
            <ToastContainer />
      </div>
    </div>
  )
}

export default OfertasAyudantias
