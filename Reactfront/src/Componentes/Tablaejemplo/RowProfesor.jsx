import React, { useCallback, useEffect, useState } from 'react'
import { TableCell, TableRow } from '@mui/material'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'

import '../../Paginas/App/App.css'
import './Tabla.css'
import './TablaSimplev2.css'
import axiosInstance from '../../utils/axiosInstance'

export default function Row ({ modulo }) {
  const [Nayudantes, setNayudantes] = useState(modulo.ofertas.length)
  const [inputValue, setInputValue] = useState(modulo.ofertas.length.toString())
  const [ofertas, setOfertas] = useState(
    Array.from({ length: Nayudantes }, (_, index) => ({
      disponibilidad: '',
      nota_mini: 5,
      tareas: '',
      otros: '',
      id: null,
      isLoading: false,
      isModified: false
    }))
  )

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [showSolicitudModal, setShowSolicitudModal] = useState(false)
  const [solicitudComentario, setSolicitudComentario] = useState('')
  const [solicitudModuloId, setSolicitudModuloId] = useState(null)
  const [solicitudModuloNombre, setSolicitudModuloNombre] = useState('')
  const [isLoadingSolicitud, setIsLoadingSolicitud] = useState(false)
  
  // Estados para el modal de confirmación de reducción de ayudantes
  const [showConfirmacionModal, setShowConfirmacionModal] = useState(false)
  const [nuevoNumeroAyudantes, setNuevoNumeroAyudantes] = useState(null)
  const [ayudantiasAEliminar, setAyudantiasAEliminar] = useState([])

  const handleShowModal = (mensaje) => {
    setModalContent(mensaje)
    setShowModal(true)
  }

  // Función para manejar el cambio de número de ayudantes con confirmación
  const handleCambioNumeroAyudantes = (nuevoNumero) => {
    const numeroActual = modulo.ofertas.length
    const nuevoNum = parseInt(nuevoNumero)
    
    // Actualizar el valor del input inmediatamente
    setInputValue(nuevoNumero)
    
    // Si el valor no es válido, no procesar
    if (isNaN(nuevoNum) || nuevoNum < 0) {
      return
    }
    
    // Si el número no ha cambiado, actualizar Nayudantes directamente
    if (nuevoNum === numeroActual) {
      setNayudantes(nuevoNum)
      return
    }
    
    // Si se está aumentando el número, proceder directamente
    if (nuevoNum > numeroActual) {
      setNayudantes(nuevoNum)
      return
    }
    
    // Si se está reduciendo, mostrar modal de confirmación
    if (nuevoNum < numeroActual) {
      const ayudantiasQueSeEliminaran = modulo.ofertas.slice(nuevoNum)
      setNuevoNumeroAyudantes(nuevoNum)
      setAyudantiasAEliminar(ayudantiasQueSeEliminaran)
      setShowConfirmacionModal(true)
      return
    }
  }

  // Función para confirmar la reducción de ayudantes
  const confirmarReduccionAyudantes = () => {
    setNayudantes(nuevoNumeroAyudantes)
    setShowConfirmacionModal(false)
    setNuevoNumeroAyudantes(null)
    setAyudantiasAEliminar([])
  }

  // Función para cancelar la reducción de ayudantes
  const cancelarReduccionAyudantes = () => {
    setShowConfirmacionModal(false)
    setNuevoNumeroAyudantes(null)
    setAyudantiasAEliminar([])
    // Restaurar el valor original en el campo
    setInputValue(Nayudantes.toString())
  }

  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleCloseModal = () => {
    setModalContent('')
    setShowModal(false)
  }

  const guardarOfertas = (newOfertas) => {
    setOfertas(newOfertas)
    modulo.ofertas = newOfertas
  }

  const mandarAlBack = (oferta) => {
    if (oferta.isLoading) {
      return
    }
    if (oferta.id === null) {
      if (
        oferta.horas_ayudantia === null ||
        oferta.disponibilidad === '' ||
        oferta.nota_mini === null ||
        oferta.tareas === ''
      ) {
        alert('Complete todos los campos antes de enviar')
        return
      }

      oferta.isLoading = true
      axiosInstance
        .post('Ofertas/', {
          modulo: modulo.id,
          horas_ayudantia: oferta.horas_ayudantia,
          disponibilidad: oferta.disponibilidad,
          nota_mini: oferta.nota_mini,
          tareas: oferta.tareas,
          otros: oferta.otros
        })
        .then((response) => {
          oferta.id = response.data.id
          oferta.isLoading = false
          oferta.isModified = false
          alert('¡Oferta creada correctamente!')
        })
        .catch((error) => {
          console.log(error)
          oferta.isLoading = false
          alert('Error al crear la oferta.')
        })
    } else {
      debouncedActualizarOferta(oferta)
    }
  }

  const actualizarOferta = (oferta) => {
    axiosInstance
      .put(`Ofertas/${oferta.id}/`, {
        modulo: modulo.id,
        horas_ayudantia: oferta.horas_ayudantia,
        disponibilidad: oferta.disponibilidad,
        nota_mini: oferta.nota_mini,
        tareas: oferta.tareas,
        otros: oferta.otros
      })
      .then(() => {
        oferta.isModified = false
        alert('¡Oferta actualizada correctamente!')
      })
      .catch((error) => {
        console.log(error)
        const errorMessage = error.response
          ? error.response.data.detail
          : 'Error desconocido'
        alert(errorMessage)
      })
  }

  const debouncedActualizarOferta = useCallback(debounce(actualizarOferta, 1000), [])

  const crearOferta = () => {
    setOfertas([
      ...modulo.ofertas,
      ...Array.from(
        { length: Nayudantes - modulo.ofertas.length },
        () => ({
          disponibilidad: '',
          nota_mini: 4,
          tareas: '',
          otros: '',
          id: null,
          isModified: false
        })
      )
    ])
  }

  const borrarOfertas = () => {
    modulo.ofertas.slice(Nayudantes).forEach((oferta) => {
      if (oferta.id !== null) {
        axiosInstance
          .delete('Ofertas/' + oferta.id)
          .then((response) => {
            alert('Oferta eliminada')
          })
          .catch((error) => {
            console.log(error)
            alert('Error al eliminar la oferta')
          })
        oferta.id = null
      }
    })
    setOfertas(modulo.ofertas.slice(0, Nayudantes))
  }

  useEffect(() => {
    if (Nayudantes > modulo.ofertas.length) {
      crearOferta()
    } else {
      borrarOfertas()
    }
    setDesplegarOferta(
      Array.from({ length: Nayudantes }, (_, index) => desplegarOferta[index] || false)
    )
  }, [Nayudantes, modulo.ofertas])

  const [desplegarOferta, setDesplegarOferta] = useState(
    Array.from({ length: modulo.ofertas.length }, () => false)
  )
  const [desplegarModulo, setDesplegarModulo] = useState(false)

  const toggleModulo = () => {
    setDesplegarModulo(!desplegarModulo)
  }
  const toggleOferta = (index) => {
    setDesplegarOferta(
      desplegarOferta.map((open, cellIndex) =>
        index === cellIndex ? !open : open
      )
    )
  }
  const cambiarDisponibilidad = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].disponibilidad = e.target.value
    newAyudantes[index].isModified = true
    guardarOfertas(newAyudantes)
  }
  const cambiarNota = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].nota_mini = e.target.value
    newAyudantes[index].isModified = true
    guardarOfertas(newAyudantes)
  }
  const cambiarTareas = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].tareas = e.target.value
    newAyudantes[index].isModified = true
    guardarOfertas(newAyudantes)
  }
  const cambiarOtros = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].otros = e.target.value
    newAyudantes[index].isModified = true
    guardarOfertas(newAyudantes)
  }

  const cambiarHoras = (horas, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].horas_ayudantia = parseInt(horas)
    newAyudantes[index].isModified = true
    guardarOfertas(newAyudantes)
  }

  const enviarSolicitud = () => {
    if (solicitudComentario.trim()) {
      setIsLoadingSolicitud(true)
      
      // Primero actualizar el módulo con la solicitud
      axiosInstance
        .patch(`Modulos/${solicitudModuloId}/`, {
          solicitud_horas: solicitudComentario
        })
        .then((response) => {
          // Luego enviar los correos
          return axiosInstance.post('correo/solicitud_horas/', {
            modulo_id: solicitudModuloId,
            solicitud_horas: solicitudComentario
          })
        })
        .then((response) => {
          const coordinadoresNotificados = response.data.coordinadores_notificados || 1;
          toast.success(`Solicitud enviada exitosamente. Se han enviado correos de notificación a ${coordinadoresNotificados} coordinador(es) y confirmación a usted.`, { 
            position: 'bottom-right',
            autoClose: 5000
          })
          handleCloseSolicitudModal()
        })
        .catch((error) => {
          console.error('Error al enviar la solicitud:', error)
          if (error.response?.data?.correos_enviados) {
            toast.warning('Solicitud guardada, pero hubo un problema enviando algunos correos de notificación.', { 
              position: 'bottom-right',
              autoClose: 5000 
            })
            handleCloseSolicitudModal()
          } else {
            toast.error(error.response?.data?.error || 'Error al enviar la solicitud', { 
              position: 'bottom-right' 
            })
          }
        })
        .finally(() => {
          setIsLoadingSolicitud(false)
        })
    } else {
      toast.error('Por favor, escriba un comentario para enviar la solicitud', { 
        position: 'bottom-right' 
      })
    }
  }

  const handleShowSolicitudModal = (id, nombre) => {
    setSolicitudModuloId(id)
    setSolicitudModuloNombre(nombre)
    setShowSolicitudModal(true)
  }

  const handleCloseSolicitudModal = () => {
    if (!isLoadingSolicitud) {
      setSolicitudComentario('')
      setSolicitudModuloId(null)
      setSolicitudModuloNombre('')
      setShowSolicitudModal(false)
    }
  }

  const SolicitarHoras = (id, nombre) => {
    handleShowSolicitudModal(id, nombre)
  }
  const guardarInformacion = () => {
    ofertas.forEach((oferta) => {
      if (oferta.id !== null) {
        actualizarOferta(oferta)
      } else {
        mandarAlBack(oferta)
      }
    })
  }

  return (
    <>
      <TableRow className='module-header table-row-margin seleccionable' onClick={toggleModulo}>

        <TableCell>
          <div className='primero container justify-content-center align-items-center d-flex'> {modulo.Asignatura} </div>
        </TableCell>
        <TableCell className='selector '>
          <label htmlFor={`Nayudantes_${modulo.id}`} />
          <TextField
            id={`Nayudantes_${modulo.id}`}
            name={`Nayudantes_${modulo.id}`}
            type='number'
            value={inputValue}
            onChange={(e) => handleCambioNumeroAyudantes(e.target.value)}
            onClick={(e) => { e.stopPropagation() }}
            variant='outlined'
            size='small'
            inputProps={{ min: 0 }}
          />
        </TableCell>
        <TableCell>
          <div className='demas container justify-content-center align-items-center d-flex'>
            {modulo.HorasTotales}
          </div>
        </TableCell>
        <TableCell className=' '>
          <button
            onClick={(e) => {
              e.stopPropagation() // Detiene la propagación del evento
              SolicitarHoras(modulo.id, modulo.Asignatura)
            }}
            className='final btn color-btn'
          >
            Más horas
          </button>
        </TableCell>

      </TableRow>

      {desplegarModulo && (
        <>
          {ofertas.map((oferta, index) => (
            <React.Fragment key={index}>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className='offer-header seleccionable' onClick={() => toggleOferta(index)}>

                <TableCell>
                  <div style={{ backgroundColor: '#018d8d' }} className=' primero container justify-content-center align-items-center d-flex'>

                    Oferta para el ayudante {index + 1}
                  </div>

                </TableCell>

                <TableCell>
                  <div className='container d-flex'>
                    <label htmlFor={`Estado_${index}`}>Estado:</label>

                    <div
                      className='demas container d-flex justify-content-center align-items-center'

                    >
                      {oferta.estado ? 'Publicada' : 'Pendiente'}
                    </div>
                  </div>
                </TableCell>

                <TableCell className='selector container'>
                  <label htmlFor={`horas_ayudantia_${index}`}>Horas Ayudantía:</label>
                  <TextField
                    id={`horas_ayudantia_${index}`}
                    name={`horas_ayudantia_${index}`}
                    type='number'
                    value={oferta.horas_ayudantia || ''}
                    onChange={(e) => cambiarHoras(e.target.value, index)}
                    onClick={(e) => { e.stopPropagation() }}
                    variant='outlined'
                    size='small'
                    inputProps={{ min: 0 }}
                  />
                </TableCell>

                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // Detiene la propagación del evento
                      handleShowModal(oferta.observaciones ? oferta.observaciones : 'no hay observaciones')
                    }}
                    className={oferta.observaciones ? 'btn btn-amarillo' : 'final btn color-btn'}
                  >
                    Observaciones
                  </button>
                </TableCell>

              </TableRow>
              {desplegarOferta[index] && (
                <>
                  <TableRow>

                    <TableCell className=''>

                      <div className='col interior interno' style={{ height: '6rem' }}>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Disponibilidad </div>
                        <div className='titulo container justify-content-center align-items-center'>
                          <label htmlFor={`disponibilidad_${index}`} className='sr-only' />
                          <textarea
                            id={`disponibilidad_${index}`}
                            name={`disponibilidad_${index}`}
                            className='textoarea'
                            value={oferta.disponibilidad}
                            onChange={(e) => cambiarDisponibilidad(e, index)}
                          />
                        </div>
                      </div>

                    </TableCell>
                    <TableCell>
                      <div className='container ' style={{ width: '10rem' }}>
                        <div className='col interior ' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Nota mínima</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <label htmlFor={`nota_mini_${index}`} className='sr-only' />
                            <TextField
                              id={`nota_mini_${index}`}
                              name={`nota_mini_${index}`}
                              style={{ backgroundColor: 'white' }}
                              type='number'
                              value={oferta.nota_mini}
                              onChange={(e) => cambiarNota(e, index)}
                              onClick={(e) => { e.stopPropagation() }}
                              variant='outlined'
                              size='small'
                              inputProps={{ min: 0 }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container '>
                        <div className='col interior' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Tareas</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <label htmlFor={`tareas_${index}`} className='sr-only' />
                            <textarea
                              id={`tareas_${index}`}
                              name={`tareas_${index}`}
                              className='textoarea'
                              value={oferta.tareas}
                              onChange={(e) => cambiarTareas(e, index)}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container '>
                        <div className='col interior' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Otros</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <label htmlFor={`otros_${index}`} className='sr-only' />
                            <textarea
                              id={`otros_${index}`}
                              name={`otros_${index}`}
                              className='textoarea'
                              value={oferta.otros}
                              onChange={(e) => cambiarOtros(e, index)}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <Button variant='final btn color-btn' onClick={guardarInformacion}>
                      Guardar
                    </Button>

                  </TableRow>
                </>
              )}
            </React.Fragment>
          ))}
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Observaciones</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: 'bold', textDecoration: 'underline' }}> Cambios solicitados por cordinador </Modal.Body>
        <Modal.Body>{modalContent}</Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Cerrar
          </Button>

        </Modal.Footer>
      </Modal>

      <Modal show={showSolicitudModal} onHide={handleCloseSolicitudModal}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitar Más Horas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>¿Deseas solicitar más horas para el módulo <strong>{solicitudModuloNombre}</strong>?</p>
            <TextField
              fullWidth
              variant='outlined'
              label='Comentario'
              value={solicitudComentario}
              onChange={(e) => setSolicitudComentario(e.target.value)}
              multiline
              rows={4}
              disabled={isLoadingSolicitud}
              inputProps={{ maxLength: 500 }}
            />
            <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
              {solicitudComentario.length}/500 caracteres
            </div>
            
            <div style={{ 
              backgroundColor: '#e3f2fd', 
              padding: '10px', 
              borderRadius: '5px', 
              marginTop: '15px',
              fontSize: '0.9em' 
            }}>
              <strong>Al enviar esta solicitud:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>Se enviará un correo a <strong>todos los coordinadores</strong> con los detalles</li>
                <li>Recibirá un correo de <strong>confirmación</strong></li>
                <li>Los coordinadores revisarán su solicitud a la brevedad</li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant='secondary' 
            onClick={handleCloseSolicitudModal}
            disabled={isLoadingSolicitud}
          >
            Cancelar
          </Button>
          <Button 
            variant='primary' 
            onClick={enviarSolicitud}
            disabled={isLoadingSolicitud || !solicitudComentario.trim()}
          >
            {isLoadingSolicitud ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para reducción de ayudantes */}
      <Modal show={showConfirmacionModal} onHide={cancelarReduccionAyudantes}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#d32f2f' }}>
            <strong>⚠️ Confirmar Reducción de Ayudantes</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>¿Está seguro que desea reducir el número de ayudantes?</strong></p>
            <p>
              Está intentando cambiar de <strong>{modulo.ofertas.length} ayudantes</strong> a{' '}
              <strong>{nuevoNumeroAyudantes} ayudantes</strong> para el módulo{' '}
              <strong>{modulo.Asignatura}</strong>.
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#ffebee', 
            padding: '15px', 
            borderRadius: '5px', 
            border: '1px solid #ffcdd2',
            marginBottom: '15px'
          }}>
            <h6 style={{ color: '#d32f2f', marginBottom: '10px' }}>
              <strong>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente:</strong>
            </h6>
            <ul style={{ marginBottom: '10px', paddingLeft: '20px' }}>
              <li><strong>Todas las postulaciones</strong> de estudiantes a estas ayudantías</li>
              <li><strong>Datos de las ofertas</strong> (disponibilidad, tareas, requisitos, etc.)</li>
              <li><strong>Observaciones</strong> y comentarios realizados</li>
              <li><strong>Estado de publicación</strong> de las ofertas</li>
            </ul>
            <p style={{ color: '#d32f2f', marginBottom: '0', fontWeight: 'bold' }}>
              Esta información NO se puede recuperar una vez eliminada.
            </p>
          </div>

          {ayudantiasAEliminar.length > 0 && (
            <div style={{ 
              backgroundColor: '#fff3e0', 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #ffcc02' 
            }}>
              <h6 style={{ color: '#f57c00', marginBottom: '8px' }}>
                <strong>Ayudantías que se eliminarán:</strong>
              </h6>
              {ayudantiasAEliminar.map((oferta, index) => (
                <div key={index} style={{ fontSize: '0.9em', marginBottom: '5px' }}>
                  • <strong>Ayudantía {modulo.ofertas.length - ayudantiasAEliminar.length + index + 1}</strong>
                  {oferta.disponibilidad && (
                    <span style={{ color: '#666' }}> - Disponibilidad definida</span>
                  )}
                  {oferta.tareas && (
                    <span style={{ color: '#666' }}> - Tareas definidas</span>
                  )}
                  {oferta.observaciones && (
                    <span style={{ color: '#666' }}> - Con observaciones</span>
                  )}
                  {oferta.estado && (
                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}> - PUBLICADA</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '5px',
            fontSize: '0.9em',
            textAlign: 'center'
          }}>
            <strong>Si está seguro, haga clic en "Sí, Eliminar Ayudantías"</strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant='secondary' 
            onClick={cancelarReduccionAyudantes}
          >
            Cancelar
          </Button>
          <Button 
            variant='danger' 
            onClick={confirmarReduccionAyudantes}
          >
            Sí, Eliminar Ayudantías
          </Button>
        </Modal.Footer>
      </Modal>
     
    </>
  )
}
