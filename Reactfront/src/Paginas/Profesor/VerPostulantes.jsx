import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarProfesor'
import TablaSimple from '../../Componentes/Tablaejemplo/TablaSimpleProfesor2'
import axiosInstance from '../../utils/axiosInstance'
import { FiltroSemestre, FiltroYear } from '../../Componentes/Filtros/FiltroSemestre'

const Postulantes = () => {
  const titulos = ['Ayudantias', 'Horas Asignadas', 'Postulantes', 'Ver postulantes']
  const navigate = useNavigate()

  const [rows, setRows] = useState([])
  const [years, setYears] = useState([])
  const [semestres, setSemestres] = useState([])
  
  // Estados con selección automática del año y semestre más actuales
  const [yearSeleccionado, setYearSeleccionado] = useState('Todos')
  const [semestreSeleccionado, setSemestreSeleccionado] = useState('Todos')

  const setearRows = (data) => {
    const rows = data.map((oferta) => {
      return {
        id: oferta.id,
        Ayudantia: oferta.modulo,
        HorasAsignadas: oferta.horas_ayudantia,
        Postulantes: oferta.postulantes,
        año: oferta.año,
        semestre: oferta.semestre,
        BotonPostulantes: {
          estado: !!oferta.ayudante,
          titulo: 'Ver Postulantes',
          funcion: () => {
            navigate(`/Postulantes/${oferta.id}`)
          }
        }
      }
    })
    setRows(rows)
  }
  useEffect(() => {
    axiosInstance.get('/Ofertas/').then((response) => {
      // Obtener años únicos y ordenarlos de mayor a menor
      const yearsArray = [...new Set(response.data.map((item) => item.año))].sort((a, b) => b - a)
      setYears(yearsArray)
      
      // Seleccionar automáticamente el año más reciente
      const yearMasReciente = yearsArray.length > 0 ? yearsArray[0].toString() : 'Todos'
      
      // Obtener semestres disponibles para el año más reciente
      const semestresDelYearMasReciente = [...new Set(
        response.data
          .filter(item => item.año === parseInt(yearMasReciente))
          .map(item => item.semestre)
      )].sort((a, b) => b - a) // Ordenar de mayor a menor (2, 1)
      
      setSemestres([...new Set(response.data.map((item) => item.semestre))])
      
      // Seleccionar automáticamente el semestre más reciente del año más reciente
      const semestreMasReciente = semestresDelYearMasReciente.length > 0 ? 
        semestresDelYearMasReciente[0].toString() : 'Todos'
      
      // Establecer automáticamente los filtros más actuales
      setYearSeleccionado(yearMasReciente)
      setSemestreSeleccionado(semestreMasReciente)
      
      setearRows(response.data)
      
      console.log(`Año más reciente seleccionado automáticamente: ${yearMasReciente}`)
      console.log(`Semestre más reciente seleccionado automáticamente: ${semestreMasReciente}`)
    })
  }, [])

  const handleYearChange = (year) => {
    setYearSeleccionado(year)
    
    // Si se selecciona un año específico, actualizar los semestres disponibles para ese año
    if (year !== 'Todos') {
      const semestresDelYear = [...new Set(
        rows
          .filter(item => item.año === parseInt(year))
          .map(item => item.semestre)
      )].sort((a, b) => b - a) // Ordenar de mayor a menor
      
      // Si el semestre actual no existe en el nuevo año, seleccionar el más reciente
      const semestreActual = parseInt(semestreSeleccionado)
      if (!semestresDelYear.includes(semestreActual) && semestresDelYear.length > 0) {
        setSemestreSeleccionado(semestresDelYear[0].toString())
        console.log(`Semestre actualizado automáticamente a ${semestresDelYear[0]} para el año ${year}`)
      }
    }
  }

  const handleSemestreChange = (semestre) => {
    setSemestreSeleccionado(semestre)
  }

  const aplicarFiltros = (rows, filtros) => {
    return rows.filter((row) => {
      for (const key in filtros) {
        if (!filtros[key](row)) {
          return false
        }
      }
      return true
    }
    )
  }

  const filtros = {
    year: (row) => yearSeleccionado === 'Todos' || row.año === parseInt(yearSeleccionado),
    semestre: (row) => semestreSeleccionado === 'Todos' || row.semestre === parseInt(semestreSeleccionado)
  }

  const filteredData = aplicarFiltros(rows, filtros).map((row) => {
    return {
      Ayudantia: row.Ayudantia,
      HorasAsignadas: row.HorasAsignadas,
      Postulantes: row.Postulantes,
      BotonPostulantes: row.BotonPostulantes
    }
  })

  return (
    <div className='principal'>
      <Navbar />

      <div className='container Componente'>
        <div className='row mb-3'>
          <FiltroYear years={['Todos', ...years]} yearSeleccionado={yearSeleccionado} handleYearSeleccionado={handleYearChange} />
          <FiltroSemestre semestres={['Todos', ...semestres]} semestreSeleccionado={semestreSeleccionado} handleSemestreSeleccionado={handleSemestreChange} />
        </div>
        
        {/* Indicador de filtros automáticos aplicados */}
        {(yearSeleccionado !== 'Todos' || semestreSeleccionado !== 'Todos') && (
          <div className='row mb-2'>
            <div className='col-12'>
              <div className='alert alert-success py-2' style={{ fontSize: '0.9em' }}>
                <i className='fas fa-calendar me-2'></i>
                <strong>Filtros automáticos:</strong> 
                {yearSeleccionado !== 'Todos' && ` Año ${yearSeleccionado}`}
                {semestreSeleccionado !== 'Todos' && ` - Semestre ${semestreSeleccionado}`}
                {yearSeleccionado !== 'Todos' && semestreSeleccionado !== 'Todos' && ' (período más reciente)'}.
                <span className='ms-2'>
                  Resultados: {filteredData.length} de {rows.length} elementos.
                </span>
              </div>
            </div>
          </div>
        )}
        
        <TablaSimple rows={filteredData} titulos={titulos} />
      </div>
    </div>
  )
}

export default Postulantes
