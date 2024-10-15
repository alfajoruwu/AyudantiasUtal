import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import './Tabla.css'
import './TablaSimplev2.css'
import Row from './RowProfesor'

export default function Tabla ({ rows, titulos, mostrarBoton = true }) {
  const ofertas = rows.map(row => row.ofertas)

  const modulos = rows.map(row => {
    const { ofertas, ...modulo } = row
    modulo.ofertas = ofertas
    return modulo
  })

  return (
    <TableContainer>
      <Table className='custom-table'>
        <div style={{ height: '10px' }} />
        <TableHead>
          <TableRow>
            {Object.keys(titulos).map((titulo, index) => (
              <TableCell key={index}>
                {titulos[titulo]} <div className='linea' />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {modulos.map((modulo) => (
            <Row key={modulo.Asignatura} modulo={modulo} ofertas={ofertas} mostrarBoton={mostrarBoton} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
