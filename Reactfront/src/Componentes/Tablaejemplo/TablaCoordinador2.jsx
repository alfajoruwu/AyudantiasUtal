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

  const handleCloseModal = () => {
    setComentario(data.find((item) => item.id === row.id)?.observaciones)
    setShowModal(false)
  }
  const handleShowModal = () => setShowModal(true)

  const handleSaveChanges = () => {
    if (comentario) {
      LlenarDatos(comentario, row.id, row.Asignatura)
      handleCloseModal()
    } else {
      LlenarDatos("", row.id, row.Asignatura)
      handleCloseModal()
    }
  }

  const AlertaError = () => {
    alert('Comentario vacío')
  }

  const AlertaExito = (nombre_ramo) => {
    toast.success('Se realizó correctamente el comentario a "' + nombre_ramo + '"', { position: 'bottom-right' })
  }

  const LlenarDatos = async (comentario, id_oferta, asignatura) => {
    try {
      await axiosInstance.patch(`Ofertas/${id_oferta}/`, {
        observaciones: comentario,
        estado: false
      })
      AlertaExito(asignatura)
      actualizarDatos()
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
    }
  }

  const publicar = async (id_oferta) => {
    try {
      await axiosInstance.patch(`Ofertas/${id_oferta}/`, {
        estado: true
      })
      toast.success('Estado actualizado correctamente', { position: 'bottom-right' })

      actualizarDatos()
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
    }
  }

  const despublicar = async (id_oferta) => {
    try {
      await axiosInstance.patch(`Ofertas/${id_oferta}/`, {
        estado: false
      })
      toast.success('Estado actualizado correctamente', { position: 'bottom-right' })

      actualizarDatos()
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
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
    // data.observaciones = comentario
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
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
          <button className='btn color-btn' onClick={(e) => { e.stopPropagation(); ObtenerValores(rowIndex, row) }}>Observaciones</button>
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
                  <TableCell>
                    <div className='container interior'>
                      <div className='col'>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Disponibilidad</div>
                        <div>{data.find((item) => item.id === row.id)?.disponibilidad}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='container interior'>
                      <div className='col'>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Nota mínima</div>
                        <div>{data.find((item) => item.id === row.id)?.nota_minima}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='container interior'>
                      <div className='col'>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Tareas</div>
                        <div>{data.find((item) => item.id === row.id)?.tareas}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='container'>
                      <div className='col interior'>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Otros</div>
                        <div>{data.find((item) => item.id === row.id)?.otros}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='container'>
                      <div className='col interior'>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Observación</div>
                        <div>{comentario || data.find((item) => item.id === row.id)?.observaciones}</div>
                      </div>
                    </div>
                  </TableCell>
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
            style={{ width: '100%', height: '5rem', resize: 'none', padding: '5px', fontSize: '0.9rem', border: '1px solid #1ECCCC', borderRadius: '5px' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant='primary' onClick={handleSaveChanges}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default function TablaAlumno ({ rows, titulos, actualizarDatos }) {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Ofertas/')
        const newData = response.data.map(item => ({
          disponibilidad: item.disponibilidad,
          nota_minima: item.nota_mini,
          tareas: item.tareas,
          otros: item.otros,
          observaciones: item.observaciones || 'no hay observación',
          id: item.id
        }))
        setData(newData)
      } catch (error) {
        console.error('Error al obtener datos:', error)
      }
    }

    obtenerDatos()
  }, [])

  return (
    <TableContainer>
      <Table className='custom-table'>
        <TableHead>
          <TableRow>
            {Object.keys(titulos).map((titulo, index) => (
              <TableCell key={index}>{titulos[titulo]} <div className='linea' /></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={row.id} row={row} data={data} rowIndex={index} actualizarDatos={actualizarDatos} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
