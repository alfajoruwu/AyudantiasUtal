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

function Row (props) {
  const { row, mostrarBoton } = props
  const [open, setOpen] = React.useState(false)

  const [ayudantes, setAyudantes] = React.useState(1)

  const cambiarAyudantes = (e) => {
    setAyudantes(e.target.value)
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
        {Object.keys(row).map((key, index) => (
          <TableCell key={index}>{key === 'Nayudantes' ? <input type='number' onClick={(e) => { e.stopPropagation() }} value={ayudantes} onChange={cambiarAyudantes} /> : row[key]}</TableCell>
        ))}
        {mostrarBoton && (
          <TableCell>
            <button className='btn color-btn' onClick={(e) => { e.stopPropagation() }}>Solicitar Horas</button>
          </TableCell>
        )}
      </TableRow>
    </>
  )
}

export default function Tabla ({ rows, titulos, mostrarBoton = true }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            {Object.keys(titulos).map((titulo, index) => (
              <TableCell key={index}>{titulos[titulo]}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.Asignatura} row={row} mostrarBoton={mostrarBoton} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
