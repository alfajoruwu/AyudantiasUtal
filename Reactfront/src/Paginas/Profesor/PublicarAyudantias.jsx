import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState, useRef } from 'react'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarProfesor'
import Tabla from '../../Componentes/Tablaejemplo/TablaProfesor'
import axiosInstance from '../../utils/axiosInstance'
import { FiltroYear, FiltroSemestre } from '../../Componentes/Filtros/FiltroSemestre'

const PublicarAyudantias = () => {
  const titulos = {
    Asignatura: 'Módulo',
    Nayudantes: 'N° Ayudantes',
    HorasTotales: 'Horas a repartir',
    Vacio: 'Solicitar horas'

  }

  const [modulos, setModulos] = useState([])
  const rowRefs = useRef([])
  const [years, setYears] = useState([])
  const [semestres, setSemestres] = useState([])
  const [yearSeleccionado, setYearSeleccionado] = useState('Todos')
  const [semestreSeleccionado, setSemestreSeleccionado] = useState('Todos')

  useEffect(() => {
    const ObtenerDatos = () => {
      const OfertasTemp = []
      axiosInstance.get('Ofertas/')
        .then(response => {
          console.log(response)
          response.data.forEach(oferta => {
            OfertasTemp.push({
              id: oferta.id,
              modulo: oferta.modulo,
              horas_ayudantia: oferta.horas_ayudantia,
              disponibilidad: oferta.disponibilidad,
              nota_mini: oferta.nota_mini,
              tareas: oferta.tareas,
              otros: oferta.otros,
              estado: oferta.estado,
              observaciones: oferta.observaciones
            })
          })
          const modulosTemp = []
          axiosInstance.get('Modulos/')
            .then(response => {
              setYears([...new Set(response.data.map(item => item.anio))])
              setSemestres([...new Set(response.data.map(item => item.semestre))])
              response.data.forEach(modulo => {
                modulosTemp.push({
                  id: modulo.id,
                  Asignatura: modulo.nombre,
                  Nayudantes: 1,
                  HorasTotales: modulo.horas_asignadas,
                  ofertas: OfertasTemp.filter(oferta => oferta.modulo === modulo.nombre),
                  año: modulo.anio,
                  semestre: modulo.semestre
                })
              })
              setModulos(modulosTemp)
            })
            .catch(error => {
              console.error('Error al obtener los módulos:', error)
            })
        })
        .catch(error => {
          console.error('Error al obtener las ofertas:', error)
        })
    }
    ObtenerDatos()
  }, [])

  const handleYearChange = (year) => {
    setYearSeleccionado(year)
  }

  const handleSemestreChange = (semestre) => {
    setSemestreSeleccionado(semestre)
  }

  const aplicarFiltros = (rows, filtros) => {
    return rows.filter((row) => {
      return Object.keys(filtros).every((key) => {
        return filtros[key](row)
      })
    })
  }

  const filtros = {
    year: (row) => yearSeleccionado === 'Todos' || row.año === parseInt(yearSeleccionado),
    semestre: (row) => semestreSeleccionado === 'Todos' || row.semestre === parseInt(semestreSeleccionado)
  }

  const filteredData = aplicarFiltros(modulos, filtros)

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mb-3'>
          <FiltroYear years={['Todos', ...years]} yearSeleccionado={yearSeleccionado} handleYearSeleccionado={handleYearChange} />
          <FiltroSemestre semestres={['Todos', ...semestres]} semestreSeleccionado={semestreSeleccionado} handleSemestreSeleccionado={handleSemestreChange} />
        </div>
        <div className='row'>
          <Tabla titulos={titulos} rows={filteredData} rowRefs={rowRefs} mostrarBoton />
        </div>
      </div>
    </div>

  )
}

export default PublicarAyudantias
