import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
  
  // Estados con selección automática del año y semestre más actuales
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
              // Obtener años únicos y ordenarlos de mayor a menor
              const yearsArray = [...new Set(response.data.map(item => item.anio))].sort((a, b) => b - a)
              setYears(yearsArray)
              
              // Seleccionar automáticamente el año más reciente
              const yearMasReciente = yearsArray.length > 0 ? yearsArray[0].toString() : 'Todos'
              
              // Obtener semestres disponibles para el año más reciente
              const semestresDelYearMasReciente = [...new Set(
                response.data
                  .filter(item => item.anio === parseInt(yearMasReciente))
                  .map(item => item.semestre)
              )].sort((a, b) => b - a) // Ordenar de mayor a menor (2, 1)
              
              setSemestres([...new Set(response.data.map(item => item.semestre))])
              
              // Seleccionar automáticamente el semestre más reciente del año más reciente
              const semestreMasReciente = semestresDelYearMasReciente.length > 0 ? 
                semestresDelYearMasReciente[0].toString() : 'Todos'
              
              // Establecer automáticamente los filtros más actuales
              setYearSeleccionado(yearMasReciente)
              setSemestreSeleccionado(semestreMasReciente)
              
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
              
              console.log(`Año más reciente seleccionado automáticamente: ${yearMasReciente}`)
              console.log(`Semestre más reciente seleccionado automáticamente: ${semestreMasReciente}`)
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
    
    // Si se selecciona un año específico, actualizar los semestres disponibles para ese año
    if (year !== 'Todos') {
      const semestresDelYear = [...new Set(
        modulos
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
                  Resultados: {filteredData.length} de {modulos.length} elementos.
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className='row'>
          <Tabla titulos={titulos} rows={filteredData} rowRefs={rowRefs} mostrarBoton />
        </div>
      </div>
      <ToastContainer />
    </div>

  )
}

export default PublicarAyudantias
