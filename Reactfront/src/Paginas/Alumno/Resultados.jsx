import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import NavbarAlumno from '../../Componentes/navbar/NavbarAlumno'
import TablaSimplev2 from '../../Componentes/Tablaejemplo/TablaSimpleAlumno'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { FiltroSemestre, FiltroYear } from '../../Componentes/Filtros/FiltroSemestre'
import FiltroEstadoAlumno from '../../Componentes/Filtros/FiltroEstadoAlumno'

const Resultados = () => {
  const Tablatitulos = ['Módulo', 'Profesor', 'Estado', 'Horas', 'Datos Profesor']

  const [datosResultadospostula2, setdatosResultadospostula2] = useState([])
  const [horas, sethoras] = useState(0)
  const [years, setYears] = useState([])
  const [semestres, setSemestres] = useState([])
  const [yearSeleccionado, setYearSeleccionado] = useState('Todos')
  const [semestreSeleccionado, setSemestreSeleccionado] = useState('Todos')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos')

  useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('/Postulaciones/')
        console.log(response.data)
        setYears([...new Set(response.data.map((item) => item.año))])
        setSemestres([...new Set(response.data.map((item) => item.semestre))])
        
        // Obtener información de todas las ofertas para determinar estados más detallados
        const ofertasResponse = await axiosInstance.get('/Ofertas/')
        const ofertas = ofertasResponse.data
        
        const newData = response.data.map(item => {
          // Buscar la oferta correspondiente usando el ID de la oferta
          const oferta = ofertas.find(o => o.id === item.id_oferta)
          
          let estadoTexto = 'No seleccionado'
          let estadoColor = '#6c757d' // gris por defecto
          
          if (item.estado) {
            estadoTexto = 'Seleccionado'
            estadoColor = '#28a745' // verde
          } else if (oferta && oferta.tiene_ayudante) {
            estadoTexto = 'No disponible'
            estadoColor = '#007bff' // azul suave
          }
          
          return {
            id: item.id_postulacion,
            Asignatura: item.modulo,
            Docente: item.profesor,
            Estado: (
              <span style={{ 
                color: estadoColor, 
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: estadoColor + '20', // agregar transparencia
                fontSize: '0.9em'
              }}>
                {estadoTexto}
              </span>
            ),
            EstadoTexto: estadoTexto, // Guardamos el texto para filtrar
            Horas: item.horas,
            BotonPostulantes: {
              titulo: 'Comunicarse',
              funcion: () => {
                alert('correo profesor: ' + item.correo_profesor)
              }
            },
            año: item.año,
            semestre: item.semestre
          }
        })
        setdatosResultadospostula2(newData)
        console.log(newData)
      } catch (error) {
        console.error('Error al obtener datos:', error)
        // Si falla obtener las ofertas, usar solo la información básica
        const newData = response.data.map(item => ({
          id: item.id_postulacion,
          Asignatura: item.modulo,
          Docente: item.profesor,
          Estado: (
            <span style={{ 
              color: item.estado ? '#28a745' : '#6c757d', 
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: (item.estado ? '#28a745' : '#6c757d') + '20',
              fontSize: '0.9em'
            }}>
              {item.estado ? 'Seleccionado' : 'No seleccionado'}
            </span>
          ),
          EstadoTexto: item.estado ? 'Seleccionado' : 'No seleccionado',
          Horas: item.horas,
          BotonPostulantes: {
            titulo: 'Comunicarse',
            funcion: () => {
              alert('correo profesor: ' + item.correo_profesor)
            }
          },
          año: item.año,
          semestre: item.semestre
        }))
        setdatosResultadospostula2(newData)
      }
    }

    const ObtenerDatosHoras = async () => {
      try {
        const response = await axiosInstance.get('/HorasAceptadas/')
        console.log(response.data.horas_aceptadas)
        sethoras(response.data.horas_aceptadas ? response.data.horas_aceptadas : 0)
      } catch (error) {
        setError(error)
      }
    }

    ObtenerDatosHoras()
    ObtenerDatos()
  }, [])

  const handleYearChange = (year) => {
    setYearSeleccionado(year)
  }

  const handleSemestreChange = (semestre) => {
    setSemestreSeleccionado(semestre)
  }

  const handleEstadoChange = (estado) => {
    setEstadoSeleccionado(estado)
  }

  const aplicarFiltros = (rows, filtros) => {
    return rows.filter((row) => {
      for (const key in filtros) {
        if (!filtros[key](row)) {
          return false
        }
      }
      return true
    })
  }

  const filtros = {
    year: (row) => yearSeleccionado === 'Todos' || row.año === parseInt(yearSeleccionado),
    semestre: (row) => semestreSeleccionado === 'Todos' || row.semestre === parseInt(semestreSeleccionado),
    estado: (row) => estadoSeleccionado === 'Todos' || row.EstadoTexto === estadoSeleccionado
  }

  const filteredData = aplicarFiltros(datosResultadospostula2, filtros).map((row) => {
    return {
      Asignatura: row.Asignatura,
      Docente: row.Docente,
      Estado: row.Estado,
      Horas: row.Horas,
      BotonPostulantes: row.BotonPostulantes
    }
  })

  return (
    <>
      <div className='principal'>
        <NavbarAlumno />
        <div className='container Componente '>
          <div className='row mb-3'>
            <FiltroYear years={['Todos', ...years]} yearSeleccionado={yearSeleccionado} handleYearSeleccionado={handleYearChange} />
            <FiltroSemestre semestres={['Todos', ...semestres]} semestreSeleccionado={semestreSeleccionado} handleSemestreSeleccionado={handleSemestreChange} />
            <FiltroEstadoAlumno estadoSeleccionado={estadoSeleccionado} handleEstadoSeleccionado={handleEstadoChange} />
          </div>
          <TablaSimplev2 rows={filteredData} titulos={Tablatitulos} />
        </div>

        <div className='container Componente '>
          <div className='row'>
            <div className='col-2'>
              <h6 className='letra'>Horas aceptadas</h6>
              <div className='linea' />
            </div>

            <div className='col'>
              <div className='muestradatos d-flex justify-content-center align-items-center'>{horas}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Resultados
