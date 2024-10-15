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

  const AlertaError = () => {
  
    toast.error('Error, falta completar datos', { position: 'bottom-right' })

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
      toast.error('Error, falta completar datos personales', { position: 'bottom-right' })
      console.error('Error al enviar la solicitud:', error)
    }
  }

  const ObtenerValores = async (rowIndex, row) => {
    console.log('Botón de la fila', rowIndex, 'presionado')
    console.log(row)

    try {
      const valorNota = document.querySelector('input[name="' + rowIndex + 'Nota"]').value
      const comentario = document.querySelector('textarea[name="' + rowIndex + 'Comentario"]').value

      console.log(comentario)
      console.log(valorNota)

      valorNota.length !== 0 && comentario.length !== 0 ? LlenarDatos(comentario, valorNota, row.id, 24144757, row.Asignatura) : AlertaError()

      // LlenarDatos()
    } catch (error) {
      toast.error('Error, falta completar datos', { position: 'bottom-right' })


      
      
        
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
        <textarea
          name={rowIndex + 'Comentario'}
          style={{ height: '4rem', resize: 'none', width: '95%', padding: '5px', fontSize: '0.9rem', border: '1px solid #1ECCCC', borderRadius: '5px' }}
          onClick={(e) => { e.stopPropagation() }} 
          placeholder='comentario'
          />
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
        setError(error)
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
