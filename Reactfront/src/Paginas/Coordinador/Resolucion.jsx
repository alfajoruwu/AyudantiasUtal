import { useEffect, useState, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Modal, Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'

import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarMarcela'
import Tabla from '../../Componentes/Tablaejemplo/TablaSimplev2'
import './ComponentesCoordinador/Ayudante.css'
import axiosInstance from '../../utils/axiosInstance'
import '../../Componentes/Spinner.css'
import exportToExcel from './ComponentesCoordinador/ExportExcel'
import FiltroResolucion from '../../Componentes/Filtros/FIltroResolucion'
import FiltroFecha from '../../Componentes/Filtros/FiltroFecha'

const Resolucion = () => {
  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const titulos = ['Módulo', 'Nombre', 'RUN', 'N° Meses', 'Horas Mensuales', 'Pago Mensual', 'Proceso', 'Fecha de postulación']
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newProceso, setNewProceso] = useState({ id: '', precio: 7000, f_inicio: getCurrentDate(), f_termino: getCurrentDate(), n_meses: 4 })
  const [procesos, setProcesos] = useState([])
  const [procesoSeleccionado, setProcesoSeleccionado] = useState('Todos')
  const [resolucion, setResolucion] = useState([])
  const [filtroResolucion, setFiltroResolucion] = useState('Todos')
  const [fechaInicio, setFechaInicio] = useState(null)
  const [fechaFin, setFechaFin] = useState(null)

  // Referencias que le paso a la tablaSimplev2 (no se si es la mejor forma de hacerlo pero funciona)
  const procesoSeleccionadoRef = useRef(procesoSeleccionado)
  useEffect(() => {
    procesoSeleccionadoRef.current = procesoSeleccionado
  }, [procesoSeleccionado])

  const rowsRef = useRef(rows)
  useEffect(() => {
    rowsRef.current = rows
  }, [rows])

  const procesosRef = useRef(procesos)
  useEffect(() => {
    procesosRef.current = procesos
  }, [procesos])

  useEffect(() => {
    setLoading(true)
    axiosInstance.get('/Postulaciones').then((res) => {
      const resoluciones = res.data.map((row) => row.resolucion || 'No asignado')
      setResolucion(['Todos', ...new Set(resoluciones)])
      const rows = res.data.map((row) => {
        return {
          Módulo: row.modulo,
          Nombre: row.nombre_postulante,
          RUN: row.run_postulante,
          CantidadMes: row.cantidad_meses ? row.cantidad_meses : 'No asignado',
          HorasMensuales: row.horas_mensuales,
          PagoMensual: row.pago_mensual ? `$${row.pago_mensual}` : 'No asignado',
          Proceso: row.resolucion ? row.resolucion : 'No asignado',
          id: row.id_oferta,
          FechaPostulacion: row.fecha_postulacion,
          BotonSeleccionarProceso: {
            titulo: 'Asignar proceso',
            titulo2: 'Cambiar proceso',
            funcion: () => {
              asignarPeriodo(row.id_oferta)
            }
          }
        }
      })
      setRows(rows)
      setLoading(false)
    }).catch((err) => {
      console.log(err)
    })
    ObtenerProcesos()
  }, [])

  const asignarPeriodo = async (seleccionado) => {
    const procesoSeleccionado = procesoSeleccionadoRef.current
    if (procesoSeleccionado === 'Todos') {
      toast.error('Debe seleccionar un proceso', { position: 'bottom-right' })
      return
    }
    const data = {
      resolucion: procesoSeleccionado
    }

    try {
      const response = await axiosInstance.patch('Ofertas/' + seleccionado + '/', data)
      if (response.status === 200) {
        toast.success('Proceso asignado exitosamente', { position: 'bottom-right' })
        const rows = rowsRef.current
        const newRows = rows.map((row) => {
          if (row.id === seleccionado) {
            const procesos = procesosRef.current
            const proceso = procesos.find((proceso) => proceso.id === procesoSeleccionado)
            row.CantidadMes = proceso.n_meses
            row.PagoMensual = `$${proceso.precio * row.HorasMensuales}`
            row.Proceso = procesoSeleccionado
          }
          return row
        })
        setRows(newRows)
      } else {
        console.error('Error al asignar el proceso:', response)
        toast.error('Error al asignar el proceso', { position: 'bottom-right' })
      }
    } catch (error) {
      console.error('Error al asignar el proceso:', error)
      if (error.response.status === 400) {
        if (error.response.data) {
          toast.error(error.response.data.detail, { position: 'bottom-right' })
        }
      } else {
        toast.error('Error al asignar el proceso', { position: 'bottom-right' })
      }
    }
  }

  const exportData = () => {
    exportToExcel(rows, 'Datos resolucion.xlsx', 'Resolucion')
  }

  const ObtenerProcesos = async () => {
    try {
      const response = await axiosInstance.get('Resoluciones/')
      const procesoGeneral = { id: 'Todos' }
      const newProcesos = [procesoGeneral, ...response.data]
      setProcesos(newProcesos)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const data = {
      id: newProceso.id,
      precio: newProceso.precio,
      f_inicio: newProceso.f_inicio,
      f_termino: newProceso.f_termino,
      n_meses: newProceso.n_meses
    }

    try {
      const response = await axiosInstance.post('Resoluciones/', data)
      if (response.status === 201) {
        toast.success('Proceso creado exitosamente', { position: 'bottom-right' })
        setShowModal(false)
        setNewProceso({ id: '', precio: 7000, f_inicio: getCurrentDate(), f_termino: getCurrentDate(), n_meses: 4 })
        ObtenerProcesos()
      } else {
        console.error('Error al crear el proceso:', response)
        toast.error('Error al crear el proceso', { position: 'bottom-right' })
      }
    } catch (error) {
      console.error('Error al crear el proceso:', error)
      if (error.response.status === 400) {
        if (error.response.data) {
          if (error.response.data.id) toast.error('Nombre es requerido', { position: 'bottom-right' })
          else {
            toast.error(error.response.data.detail, { position: 'bottom-right' })
          }
        }
      } else {
        toast.error('Error al crear el proceso', { position: 'bottom-right' })
      }
    }
  }

  const handleChange = (e) => {
    setNewProceso({ ...newProceso, [e.target.name]: e.target.value })
  }

  const handleFiltroResolucion = (resolucion) => {
    setFiltroResolucion(resolucion)
  }

  const handleFechaSeleccionada = (start, end) => {
    setFechaInicio(start)
    setFechaFin(end)
  }

  const filtros = {
    resolucion: (row) => filtroResolucion === 'Todos' || row.Proceso === filtroResolucion,
    fechaSeleccionada: (row) => {
      if (!fechaInicio && !fechaFin) return true
      const itemFechaPostulacion = new Date(row.FechaPostulacion)
      if (fechaInicio && !fechaFin) return itemFechaPostulacion >= fechaInicio
      if (!fechaInicio && fechaFin) return itemFechaPostulacion <= fechaFin
      return itemFechaPostulacion >= fechaInicio && itemFechaPostulacion <= fechaFin
    }
  }

  const aplicarFiltros = (rows, filtros) => {
    return rows.filter(item => {
      for (const key in filtros) {
        if (filtros[key] && !filtros[key](item)) {
          return false
        }
      }
      return true
    })
  }

  const filteredData = aplicarFiltros(rows, filtros)

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mt-3 align-items-center'>
          {/* aqui van los filtros */}
          <div className='row mt-3'>
            <div className='col-md-3'>
              <label htmlFor='resolucion'>Seleccion de Proceso:</label>
              <select
                className='form-select'
                value={procesoSeleccionado}
                onChange={(e) => setProcesoSeleccionado(e.target.value)}
              >
                {procesos.map((proceso, index) => (
                  <option key={index} value={proceso.id}>{proceso.id}</option>
                ))}
              </select>
            </div>
            <div className='col-md-3'>
              <button className='btn color-btn' onClick={() => setShowModal(true)}>Nuevo Proceso</button>
            </div>
            <FiltroResolucion
              resoluciones={resolucion}
              resolucionSeleccionada={filtroResolucion}
              handleResolucionSeleccionada={handleFiltroResolucion}
            />
            <FiltroFecha
              handleFechaSeleccionada={handleFechaSeleccionada}
            />
          </div>
        </div>
        <div className='row mt-3'>
          <Tabla titulos={titulos} rows={filteredData} mostrarBoton={false} />
          {loading && <div className='spinner' />}
        </div>
        <Button className='btn color-btn' onClick={() => exportData()}>Exportar a Excel</Button>
      </div>

      <ToastContainer />
      {/* Modal para crear periodo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Proceso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group controlId='formNombreCompleto'>
              <Form.Label>Nombre </Form.Label>
              <i style={{ fontSize: '14px' }}> Debe ser único, para identificar el proceso</i>
              <Form.Control
                type='text'
                placeholder='Ingrese nombre del proceso'
                name='id'
                value={newProceso.id}
                onChange={handleChange}
                maxLength={25}
                required
                isInvalid={procesos.some((proceso) => proceso.id === newProceso.id)}
              />
              <Form.Control.Feedback type='invalid'>Ya existe un proceso con ese nombre</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='formPrecio'>
              <Form.Label>Valor hora </Form.Label>
              <Form.Control
                type='number'
                placeholder='Ingrese valor hora'
                name='precio'
                value={newProceso.precio}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='formFechaInicio'>
              <Form.Label>Fecha inico</Form.Label>
              <Form.Control
                type='date'
                placeholder='Ingrese fecha inicial'
                name='f_inicio'
                value={newProceso.f_inicio}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='formFechaTermino'>
              <Form.Label>Fecha final</Form.Label>
              <Form.Control
                type='date'
                placeholder='Ingrese fecha final'
                name='f_termino'
                value={newProceso.f_termino}
                onChange={handleChange}
                required
                isInvalid={newProceso.f_termino <= newProceso.f_inicio}
              />
              <Form.Control.Feedback type='invalid'>La fecha de término debe ser mayor a la fecha de inicio</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='formCantidadMeses'>
              <Form.Label>Cantidad de meses</Form.Label>
              <Form.Control
                type='number'
                placeholder='Ingrese cantidad de meses'
                name='n_meses'
                value={newProceso.n_meses}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button
                variant='danger' onClick={() => {
                  setNewProceso({ id: '', precio: 7000, f_inicio: getCurrentDate(), f_termino: getCurrentDate(), n_meses: 4 })
                  setShowModal(false)
                }}
              >
                Cancelar
              </Button>
              <Button variant='primary' type='submit'>
                Crear
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Resolucion
