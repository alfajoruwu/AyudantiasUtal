import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarMarcela'
import TablaCoordinador2 from '../../Componentes/Tablaejemplo/TablaCoordinador2'
import axiosInstance from '../../utils/axiosInstance'
import { useState, useEffect } from 'react'
import FiltroModulo from '../../Componentes/Filtros/FiltroModulo'
import FiltroProfesor from '../../Componentes/Filtros/FiltroProfesor'
import FiltroEstado from '../../Componentes/Filtros/FiltroEstado'
import FiltroFecha from '../../Componentes/Filtros/FiltroFecha'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal, Button } from 'react-bootstrap'

const Difusion = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [modulos, setModulos] = useState([])
  const [moduloSeleccionado, setModuloSeleccionado] = useState('Todos')
  const [profesores, setProfesores] = useState([])
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('Todos')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos')
  const [fechaInicio, setFechaInicio] = useState(null)
  const [fechaFin, setFechaFin] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const obtenerDatos = async () => {
    try {
      const response = await axiosInstance.get('Ofertas/')
      const newData = response.data.map(item => ({
        Estado: item.estado ? 'Publicado' : 'Pendiente',
        Asignatura: item.modulo,
        NombreProfesor: item.profesor,
        HorasTotales: item.horas_ayudantia,
        FechaCreacion: item.fecha_modificacion,
        id: item.id
      }))
      setData(newData)
      setModulos(['Todos', ...new Set(newData.map(item => item.Asignatura))])
      setProfesores(['Todos', ...new Set(newData.map(item => item.NombreProfesor))])
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    obtenerDatos()
  }, [])

  const handleModuloSeleccionado = (modulo) => setModuloSeleccionado(modulo)
  const handleProfesorSeleccionado = (profesor) => setProfesorSeleccionado(profesor)
  const handleEstadoSeleccionado = (estado) => setEstadoSeleccionado(estado)
  const handleFechaSeleccionada = (start, end) => {
    setFechaInicio(start)
    setFechaFin(end)
  }

  const actualizarFiltros = () => {
    const filteredData = aplicarFiltros(data, {
      moduloSeleccionado: (item) => moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado,
      profesorSeleccionado: (item) => profesorSeleccionado === 'Todos' || item.NombreProfesor === profesorSeleccionado

    })
    setModulos(['Todos', ...new Set(filteredData.map(item => item.Asignatura))])
    setProfesores(['Todos', ...new Set(filteredData.map(item => item.NombreProfesor))])
  }

  useEffect(() => {
    actualizarFiltros()
  }, [moduloSeleccionado, profesorSeleccionado])

  const filtros = {
    moduloSeleccionado: (item) => moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado,
    profesorSeleccionado: (item) => profesorSeleccionado === 'Todos' || item.NombreProfesor === profesorSeleccionado,
    estadoSeleccionado: (item) => estadoSeleccionado === 'Todos' || item.Estado === estadoSeleccionado,
    fechaSeleccionada: (item) => {
      if (!fechaInicio && !fechaFin) return true
      const itemFechaCreacion = new Date(item.FechaCreacion)
      if (fechaInicio && !fechaFin) return itemFechaCreacion >= fechaInicio
      if (!fechaInicio && fechaFin) return itemFechaCreacion <= fechaFin
      return itemFechaCreacion >= fechaInicio && itemFechaCreacion <= fechaFin
    }
  }

  const aplicarFiltros = (data, filtros) => {
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

  const cambiarEstado = async () => {
    const ids = filteredData.map(item => item.id)
    for (const id of ids) {
      try {
        const response = await axiosInstance.patch(`Ofertas/${id}/`, { estado: false })
        console.log(response)
        if (response.status === 200) {
          toast.success('Estado actualizado correctamente', { position: 'bottom-right' })
        } else {
          toast.error('Error al cambiar el estado', { position: 'bottom-right' })
        }
      } catch (error) {
        console.log(error)
        toast.error('Error al cambiar el estado', { position: 'bottom-right' })
      }
    }
    obtenerDatos()
  }

  const confirmarCambioEstado = () => {
    handleClose()
    cambiarEstado()
  }

  const titulos = {
    estado: 'Estado',
    Asignatura: 'Módulo',
    Nprofesor: 'Nombre profesor',
    HorasTotales: 'Horas totales',
    FechaCreacion: 'Fecha de modificación',
    Vacio: 'Observaciones',
    publicar: 'Publicar'
  }

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mb-3'>
          <FiltroModulo
            modulos={modulos}
            moduloSeleccionado={moduloSeleccionado}
            handleModuloSeleccionado={handleModuloSeleccionado}
          />
          <FiltroProfesor
            profesores={profesores}
            profesorSeleccionado={profesorSeleccionado}
            handleProfesorSeleccionado={handleProfesorSeleccionado}
          />
          <FiltroEstado
            estadoSeleccionado={estadoSeleccionado}
            handleEstadoSeleccionado={handleEstadoSeleccionado}
          />
          <FiltroFecha
            handleFechaSeleccionada={handleFechaSeleccionada}
          />
        </div>
        <div className='d-flex mb-3'>
          <button className='btn btn-danger ms-auto' onClick={handleShow}>Despublicar ofertas en pantalla</button>
        </div>
        <TablaCoordinador2 titulos={titulos} rows={filteredData} actualizarDatos={obtenerDatos} />
        <div className='row justify-content-center mt-3' />
        <ToastContainer />
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas despublicar las ofertas en pantalla?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={confirmarCambioEstado}>
            Despublicar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Difusion
