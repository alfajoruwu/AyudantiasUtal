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
      setYears([...new Set(response.data.map((item) => item.año))])
      setSemestres([...new Set(response.data.map((item) => item.semestre))])
      setearRows(response.data)
    })
  }, [])

  const handleYearChange = (year) => {
    setYearSeleccionado(year)
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
        <TablaSimple rows={filteredData} titulos={titulos} />
      </div>
    </div>
  )
}

export default Postulantes
