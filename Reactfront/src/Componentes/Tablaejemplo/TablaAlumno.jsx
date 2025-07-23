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
// import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function Row (props) {
  const { row, rowIndex, data } = props
  // Este estado se utiliza para controlar el Collapse de la primera fila.
  const [open, setOpen] = React.useState(false)
  // Este estado controlará el Collapse de las celdas individuales.
  const [openCells, setOpenCells] = React.useState(
    Array.from({ length: row.Nayudantes }, () => false)
  )
  // Estado para seleccionar los ayudantes
  const [ayudantes, setAyudantes] = React.useState(1)

  /// ////////////////////////////////////////////////////////////////////
  const [Nota, SetNota] = React.useState(1)
  const [Comentario, SetComentario] = React.useState('Sin comentarios')

  // Función para mostrar errores específicos según los campos faltantes
  const AlertaError = (camposFaltantes = []) => {
    if (camposFaltantes.length > 0) {
      // Mensaje específico con los campos que faltan
      toast.error(`Error: Falta completar ${camposFaltantes.join(' y ')}`, { position: 'bottom-right' })
    } else {
      // Mensaje genérico en caso de que no se especifiquen los campos
      toast.error('Error, falta llenar datos', { position: 'bottom-right' })
    }
  }

  const AlertaExito = (nombre_ramo) => {
    
    toast.success('se realizo correctamente la postulacion de "' + nombre_ramo + '"', { position: 'bottom-right' })
  }

  const LlenarDatos = async (comentario, nota_aprobacion, id_oferta, postulante, asignatura) => {
    try {
      console.log(postulante)
      const response = await axiosInstance.post('Postulaciones/', {
        comentario,
        nota_aprobacion,
        postulante,
        oferta: id_oferta
      })
      AlertaExito(asignatura)
      console.log(response.data)
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      
      // Verificar si el error tiene una respuesta
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            // Error de validación
            if (data && typeof data === 'object') {
              // Manejo de errores específicos de datos personales
              if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
                const errorMsg = data.non_field_errors[0];
                if (errorMsg.includes("datos personales") || errorMsg.includes("Promedio")) {
                  toast.error('Para postular debes completar tus datos personales en la sección "Mis Datos", incluyendo tu promedio académico.', { position: 'bottom-right' })
                  // Agregar instrucciones adicionales
                  setTimeout(() => {
                    toast.info('Dirígete al menú "Mis Datos" y completa toda tu información personal', { position: 'bottom-right' })
                  }, 1000)
                  return; // Para evitar mostrar errores adicionales
                }
              }
            
              // Manejo de diferentes mensajes de error por campo
              if (data.nota_aprobacion) {
                toast.error(`Nota: ${Array.isArray(data.nota_aprobacion) ? data.nota_aprobacion[0] : data.nota_aprobacion}`, { position: 'bottom-right' })
              }
              if (data.comentario) {
                const errorComentario = Array.isArray(data.comentario) ? data.comentario[0] : data.comentario;
                if (errorComentario.includes("255 caracteres")) {
                  toast.error('El comentario no puede exceder los 255 caracteres', { position: 'bottom-right' })
                  
                  // Mostrar la longitud actual del comentario
                  const comentario = document.querySelector('textarea[name="' + rowIndex + 'Comentario"]')?.value || "";
                  if (comentario) {
                    setTimeout(() => {
                      toast.info(`Tu comentario actual tiene ${comentario.length} caracteres. Por favor, redúcelo a máximo 255.`, { position: 'bottom-right' })
                    }, 1000)
                  }
                } else {
                  toast.error(`Comentario: ${errorComentario}`, { position: 'bottom-right' })
                }
              }
              if (data.postulante) {
                const msgPostulante = Array.isArray(data.postulante) ? data.postulante[0] : data.postulante;
                if (msgPostulante.includes("datos personales") || msgPostulante.includes("Promedio")) {
                  toast.error('Debes completar tus datos personales en la sección "Mis Datos" antes de postular, incluyendo tu promedio académico.', { position: 'bottom-right' })
                } else {
                  toast.error(`Postulante: ${msgPostulante}`, { position: 'bottom-right' })
                }
              }
              if (data.oferta) {
                toast.error(`Oferta: ${Array.isArray(data.oferta) ? data.oferta[0] : data.oferta}`, { position: 'bottom-right' })
              }
              if (data.detail) {
                if (data.detail === "UNIQUE constraint failed: api_postulacion.postulante_id, api_postulacion.oferta_id") {
                  toast.error('Ya has postulado a esta ayudantía anteriormente', { position: 'bottom-right' })
                } else if (data.detail.includes("falta completar")) {
                  toast.error('Debes completar tus datos personales en la sección "Mis Datos" antes de postular. Asegúrate de llenar todos los campos incluyendo el promedio.', { position: 'bottom-right' })
                } else if (data.detail.includes("promedio") || data.detail.includes("Promedio")) {
                  toast.error('Tu promedio académico no cumple con los requisitos mínimos para esta ayudantía o no has registrado tu promedio en la sección "Mis Datos"', { position: 'bottom-right' })
                } else {
                  toast.error(`Error: ${data.detail}`, { position: 'bottom-right' })
                }
              }
              
              // Si no hay mensajes específicos, mostrar un mensaje general
              if (!data.detail && !data.nota_aprobacion && !data.comentario && !data.postulante && !data.oferta) {
                toast.error('Error en la validación de datos', { position: 'bottom-right' })
              }
            } else if (data && typeof data === 'string') {
              toast.error(data, { position: 'bottom-right' })
            } else {
              toast.error('Error en la validación de datos', { position: 'bottom-right' })
            }
            break
            
          case 401:
            toast.error('Sesión expirada. Por favor inicie sesión nuevamente.', { position: 'bottom-right' })
            break
            
          case 403:
            toast.error('No tienes permisos para postular a esta ayudantía', { position: 'bottom-right' })
            break
            
          case 404:
            toast.error('La oferta a la que intentas postular no existe o ya no está disponible', { position: 'bottom-right' })
            break
            
          case 500:
            toast.error('Error en el servidor. Por favor, intenta más tarde.', { position: 'bottom-right' })
            break
            
          default:
            toast.error(`Error (${status}): No se pudo completar la postulación`, { position: 'bottom-right' })
        }
      } else if (error.request) {
        // No se recibió respuesta
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión.', { position: 'bottom-right' })
      } else {
        // Error en la configuración de la solicitud
        toast.error('Error al preparar la solicitud: ' + error.message, { position: 'bottom-right' })
      }
    }
  }
  const ObtenerValores = async (rowIndex, row) => {
    console.log('Botón de la fila', rowIndex, 'presionado')
    console.log(row)

    try {
      const valorNota = document.querySelector('input[name="' + rowIndex + 'Nota"]').value
      const comentario = document.querySelector('textarea[name="' + rowIndex + 'Comentario"]').value
      const notaMinimaRequerida = data.find(item => item.id === row.id)?.nota_minima || 4.0

      console.log(comentario)
      console.log(valorNota)
      console.log('Nota mínima requerida:', notaMinimaRequerida)

      // Verificar qué campos específicos están vacíos
      const camposFaltantes = []
      
      if (!valorNota || valorNota.trim() === '') {
        camposFaltantes.push('la nota de aprobación')
      } else if (isNaN(parseFloat(valorNota)) || parseFloat(valorNota) < 1 || parseFloat(valorNota) > 7) {
        toast.error('La nota debe ser un número entre 1.0 y 7.0', { position: 'bottom-right' })
        return
      } else {
        // Verificar si la nota cumple con la nota mínima requerida para la ayudantía
        if (parseFloat(valorNota) < parseFloat(notaMinimaRequerida)) {
          toast.warning(`Tu nota de aprobación (${valorNota}) es menor que la nota mínima requerida (${notaMinimaRequerida}) para esta ayudantía`, { position: 'bottom-right' })
          // Aún así permitimos continuar, solo es una advertencia
        }
      }
      
      if (!comentario || comentario.trim() === '') {
        camposFaltantes.push('el comentario')
      } else if (comentario.length > 255) {
        toast.error('El comentario no puede exceder los 255 caracteres', { position: 'bottom-right' })
        return
      }
      
      // Si hay campos faltantes, mostrar alerta con detalle
      if (camposFaltantes.length > 0) {
        AlertaError(camposFaltantes)
        return
      }
      
      // Si todos los campos están completos y son válidos, enviar los datos directamente
      LlenarDatos(comentario, valorNota, row.id, 24144757, row.Asignatura)
    } catch (error) {
      console.error('Error al obtener los valores del formulario:', error)
      toast.error('Error al procesar el formulario. Por favor, inténtelo nuevamente.', { position: 'bottom-right' })
    }
  }

  const cambiarAyudantes = (e) => {
    setAyudantes(e.target.value)
  }
  // Función para manejar el clic en una celda individual
  const toggleCell = (index) => {
    setOpenCells(openCells.map((open, cellIndex) => (index === cellIndex ? !open : open)))
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
        {/* esta linea mata el ultimo elemento para guardarlo como id */}
        {Object.keys(row).map((key, index, array) => (
        // Comprobar si el índice actual es el último
          index !== array.length - 1 && (
            <TableCell key={index}>
              <div className={index === 0 ? 'primero container justify-content-center align-items-center d-flex' : 'demas container justify-content-center align-items-center d-flex'}>
                {row[key]}
              </div>
            </TableCell>
          )
        ))}

        <TableCell>
          <input   type="number"
           style={{ 
              height: '3rem', 
              width: '95%', 
              padding: '5px', 
              fontSize: '0.9rem', 
              border: '1px solid #1ECCCC', 
            borderRadius: '5px' 
           }}  name={rowIndex + 'Nota'}  onClick={(e) => { e.stopPropagation() }} placeholder='Nota aprobacion' />
        </TableCell>

        <TableCell>
          <div style={{ position: 'relative', width: '100%' }}>
            <textarea
              name={rowIndex + 'Comentario'}
              style={{ 
                height: '4rem', 
                resize: 'none', 
                width: '95%', 
                padding: '5px', 
                fontSize: '0.9rem', 
                border: '1px solid #1ECCCC', 
                borderRadius: '5px' 
              }}
              onClick={(e) => { e.stopPropagation() }} 
              placeholder='comentario (máximo 255 caracteres)'
              maxLength={255}
              onChange={(e) => {
                const count = e.target.value.length;
                const countDisplay = document.getElementById(`charCount-${rowIndex}`);
                if (countDisplay) {
                  countDisplay.textContent = `${count}/255`;
                  if (count > 230) {
                    countDisplay.style.color = count >= 255 ? 'red' : 'orange';
                  } else {
                    countDisplay.style.color = 'grey';
                  }
                }
              }}
            />
            <div 
              id={`charCount-${rowIndex}`}
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '25px',
                fontSize: '0.8rem',
                color: 'grey',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '0 5px',
                borderRadius: '3px'
              }}
            >
              0/255
            </div>
          </div>
        </TableCell>

        <TableCell>
          <button className='btn color-btn' onClick={(e) => { e.stopPropagation(); ObtenerValores(rowIndex, row) }}>Postular</button>
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
                      <div className='col' style={{ height: '7rem' }}>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Disponibilidad</div>
                        <div>{data.find(item => item.id === row.id)?.disponibilidad}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='container interior'>
                      <div className='col' style={{ height: '7rem' }}>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Nota minima</div>
                        <div>{data.find(item => item.id === row.id)?.nota_minima} </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='container interior'>
                      <div className='col' style={{ height: '7rem' }}>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Tareas</div>
                        <div>{data.find(item => item.id === row.id)?.tareas}</div>

                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='container interior'>
                      <div className='col' style={{ height: '7rem' }}>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Otros</div>
                        <div>{data.find(item => item.id === row.id)?.otros}</div>
                      </div>
                    </div>
                  </TableCell>


                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function TablaAlumno ({ rows, titulos }) {
  const [error, setError] = React.useState(null)
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Ofertas/')
        console.log(response.data)
        const newData = response.data.map(item => ({
          disponibilidad: item.disponibilidad,
          nota_minima: item.nota_mini,
          tareas: item.tareas,
          otros: item.otros,
          id: item.id
        }))
        setData(newData)
      } catch (error) {
        console.error('Error al obtener detalles de las ofertas:', error)
        setError(error)
        
        // Mostrar mensajes de error específicos
        if (error.response) {
          if (error.response.status === 404) {
            toast.error('No se encontraron detalles para las ofertas', { position: 'bottom-right' })
          } else if (error.response.status === 401) {
            toast.error('Sesión expirada. Por favor inicie sesión nuevamente.', { position: 'bottom-right' })
          } else {
            toast.error(`Error al cargar los detalles de las ofertas (${error.response.status})`, { position: 'bottom-right' })
          }
        } else {
          toast.error('Error al cargar los detalles de las ofertas. Compruebe su conexión.', { position: 'bottom-right' })
        }
      }
    }

    ObtenerDatos()
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
            <Row key={row.id} row={row} data={data} rowIndex={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
