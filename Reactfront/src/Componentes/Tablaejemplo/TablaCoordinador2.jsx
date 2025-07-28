import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import './Tabla.css'
import './TablaSimplev2.css'
import axiosInstance from '../../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

function Row (props) {
  const { row, rowIndex, data, actualizarDatos } = props
  const [open, setOpen] = React.useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [comentario, setComentario] = useState('')
  const [isLoadingObservaciones, setIsLoadingObservaciones] = useState(false)

  // Funciones mejoradas para el manejo de modal
  const handleCloseModal = () => {
    if (!isLoadingObservaciones) {
      const observacionActual = data.find((item) => item.id === row.id)?.observaciones || '';
      setComentario(observacionActual);
      setShowModal(false);
    }
  }
  
  const handleShowModal = () => {
    const observacionActual = data.find((item) => item.id === row.id)?.observaciones || '';
    setComentario(observacionActual);
    setShowModal(true);
  }

  const handleSaveChanges = () => {
    const comentarioLimpio = comentario.trim();
    LlenarDatos(comentarioLimpio, row.id, row.Asignatura);
  }

  // Función mejorada para actualizar datos
  const LlenarDatos = async (comentario, id_oferta, asignatura) => {
    setIsLoadingObservaciones(true)
    try {
      await axiosInstance.patch(`Ofertas/${id_oferta}/`, {
        observaciones: comentario,
        estado: false
      })
      
      if (comentario.trim()) {
        try {
          const response = await axiosInstance.post('correo/observaciones_oferta/', {
            oferta_id: id_oferta,
            observaciones: comentario
          })
          const profesorNotificado = response.data.profesor_notificado || 'el profesor';
          toast.success(`Observaciones enviadas exitosamente para "${asignatura}". Se ha notificado a ${profesorNotificado} para que realice las correcciones solicitadas.`, { 
            position: 'bottom-right',
            autoClose: 5000
          })
        } catch (emailError) {
          console.error('Error enviando correos:', emailError)
          toast.warning(`Observaciones guardadas para "${asignatura}", pero hubo un problema enviando la notificación al profesor.`, { 
            position: 'bottom-right',
            autoClose: 5000
          })
        }
      } else {
        toast.success(`Observaciones actualizadas correctamente para "${asignatura}"`, { 
          position: 'bottom-right' 
        })
      }
      
      setShowModal(false);
      
      // Actualización robusta de datos
      if (actualizarDatos) {
        try {
          await actualizarDatos();
        } catch (updateError) {
          console.error('Error actualizando datos del padre:', updateError);
        }
      }
      
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      toast.error(`Error al actualizar las observaciones para "${asignatura}"`, { 
        position: 'bottom-right' 
      })
    } finally {
      setIsLoadingObservaciones(false)
    }
  }

  const publicar = async (id_oferta) => {
    try {
      await axiosInstance.patch(`Ofertas/${id_oferta}/`, {
        estado: true
      })
      toast.success('Estado actualizado correctamente', { position: 'bottom-right' })

      if (actualizarDatos) {
        try {
          await actualizarDatos();
        } catch (updateError) {
          console.error('Error actualizando datos:', updateError);
        }
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      toast.error('Error al publicar la oferta', { position: 'bottom-right' })
    }
  }

  const despublicar = async (id_oferta) => {
    try {
      await axiosInstance.patch(`Ofertas/${id_oferta}/`, {
        estado: false
      })
      toast.success('Estado actualizado correctamente', { position: 'bottom-right' })

      if (actualizarDatos) {
        try {
          await actualizarDatos();
        } catch (updateError) {
          console.error('Error actualizando datos:', updateError);
        }
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      toast.error('Error al despublicar la oferta', { position: 'bottom-right' })
    }
  }

  const ObtenerValores = (rowIndex, row) => {
    setModalContent(`Ingrese una observación para ${row.Asignatura} del profesor: ${row.NombreProfesor} y de la ayudantía de: ${row.HorasTotales} horas.`)
    handleShowModal()
  }

  const ObtenerValores2 = async (rowIndex, row) => {
    publicar(row.id)
  }

  const SetObserbaciones = (comentario) => {
    setComentario(comentario)
  }

  // Función para obtener datos seguros
  const obtenerDatoSeguro = (campo) => {
    const item = data.find((item) => item.id === row.id);
    if (!item) return 'Cargando...';
    return item[campo] || 'No disponible';
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)} className="seleccionable">
        {Object.keys(row).map((key, index, array) => (
          index !== array.length - 1 && (
            <TableCell key={index}>
              <div className={index === 0 ? 'primero container justify-content-center align-items-center d-flex' : 'demas container justify-content-center align-items-center d-flex'}>
                {row[key]}
              </div>
            </TableCell>
          )
        ))}
        <TableCell>
          <button 
            className={obtenerDatoSeguro('observaciones') !== 'no hay observación' && obtenerDatoSeguro('observaciones') !== 'No disponible' ? 'btn btn-amarillo' : 'btn color-btn'} 
            onClick={(e) => { e.stopPropagation(); ObtenerValores(rowIndex, row) }}
          >
            Observaciones
          </button>
        </TableCell>
        <TableCell>
          {row.Estado === 'Pendiente'
            ? (
              <button className='btn color-btn' onClick={(e) => { e.stopPropagation(); ObtenerValores2(rowIndex, row) }}>Publicar</button>
              )
            : (
              <button className='btn btn-rojo' onClick={(e) => { e.stopPropagation(); despublicar(row.id) }}>Despublicar</button>
              )}
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className='container interior'>
                        <div className='col'>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Disponibilidad</div>
                          <div>{obtenerDatoSeguro('disponibilidad')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container interior'>
                        <div className='col'>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Nota mínima</div>
                          <div>{obtenerDatoSeguro('nota_minima')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container interior'>
                        <div className='col'>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Tareas</div>
                          <div>{obtenerDatoSeguro('tareas')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container'>
                        <div className='col interior'>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Otros</div>
                          <div>{obtenerDatoSeguro('otros')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container'>
                        <div className='col interior'>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Observación</div>
                          <div>{obtenerDatoSeguro('observaciones')}</div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Observaciones</strong></Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Body>
          <textarea
            value={comentario}
            onChange={(e) => SetObserbaciones(e.target.value)}
            style={{ 
              width: '100%', 
              height: '5rem', 
              resize: 'none', 
              padding: '5px', 
              fontSize: '0.9rem', 
              border: '1px solid #1ECCCC', 
              borderRadius: '5px' 
            }}
            disabled={isLoadingObservaciones}
            placeholder="Ingrese sus observaciones aquí..."
            maxLength="500"
          />
          <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
            {comentario.length}/500 caracteres
          </div>
          
          {comentario.trim() && (
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '10px', 
              borderRadius: '5px', 
              marginTop: '15px',
              fontSize: '0.9em',
              border: '1px solid #c3e6c3'
            }}>
              <strong>Al enviar estas observaciones:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>Se enviará un correo al <strong>profesor responsable</strong> con las correcciones solicitadas</li>
                <li>Usted recibirá una <strong>copia de confirmación</strong> del envío</li>
                <li>La oferta será marcada como <strong>"Pendiente"</strong> hasta que el profesor realice las correcciones</li>
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant='secondary' 
            onClick={handleCloseModal}
            disabled={isLoadingObservaciones}
          >
            Cerrar
          </Button>
          <Button 
            variant='primary' 
            onClick={handleSaveChanges}
            disabled={isLoadingObservaciones}
          >
            {isLoadingObservaciones ? 'Enviando...' : 'Guardar cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default function TablaAlumno ({ rows, titulos, actualizarDatos }) {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axiosInstance.get('Ofertas/')
        const newData = response.data.map(item => ({
          disponibilidad: item.disponibilidad || 'No especificada',
          nota_minima: item.nota_mini || 'No especificada',
          tareas: item.tareas || 'No especificadas',
          otros: item.otros || 'No especificado',
          observaciones: item.observaciones || 'no hay observación',
          id: item.id
        }))
        setData(newData)
      } catch (error) {
        console.error('Error al obtener datos:', error)
        setError(error)
        if (error.response) {
          if (error.response.status === 404) {
            toast.error('No se encontraron ofertas', { position: 'bottom-right' })
          } else if (error.response.status === 401) {
            toast.error('Sesión expirada. Por favor inicie sesión nuevamente.', { position: 'bottom-right' })
          } else {
            toast.error(`Error al cargar los detalles de las ofertas (${error.response.status})`, { position: 'bottom-right' })
          }
        } else {
          toast.error('Error al cargar los detalles de las ofertas. Compruebe su conexión.', { position: 'bottom-right' })
        }
      } finally {
        setLoading(false)
      }
    }

    obtenerDatos()
  }, [rows]) // Dependencia de rows para sincronizar con cambios del padre

  // Mostrar loading o error si es necesario
  if (loading) {
    return (
      <TableContainer>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Cargando datos de las ofertas...
        </div>
      </TableContainer>
    )
  }

  if (error && data.length === 0) {
    return (
      <TableContainer>
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          Error al cargar los datos. Por favor, recargue la página.
        </div>
      </TableContainer>
    )
  }

  return (
    <TableContainer>
      <Table className='custom-table'>
        <TableHead>
          <TableRow>
            {Object.keys(titulos).map((titulo, index) => (
              <TableCell key={index}>
                {titulos[titulo]} 
                <div className='linea' />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row 
              key={`${row.id}-${index}`} 
              row={row} 
              data={data} 
              rowIndex={index} 
              actualizarDatos={actualizarDatos} 
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
