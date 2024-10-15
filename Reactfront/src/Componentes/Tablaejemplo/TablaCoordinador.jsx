import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Row(props) {
  const { row, mostrarBoton } = props;
  const [open, setOpen] = React.useState(false);
  const [openCells, setOpenCells] = React.useState(Array.from({ length: row.HorasTotales }, () => false));

  const toggleRow = () => {
    setOpen(!open);
  };

  const toggleCell = (index) => {
    setOpenCells(
      openCells.map((open, cellIndex) =>
        index === cellIndex ? !open : false
      )
    );
  };

  return (
    <>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' } }}
        onClick={toggleRow}
      >
        {Object.keys(row).map((key, index) => (
          <TableCell key={index}>
            {key !== 'HorasTotales' ? (
              row[key]
            ) : null}
          </TableCell>
        ))}
        {mostrarBoton && (
          <TableCell>
            <button
              className='btn color-btn'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Modificar
            </button>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className='row' >Disponibilidad</div>
                      <div className='row'>
                        <div type='text'>Detalles de la publicación</div>
                      </div>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <div className='row' style={{ color: '#1ECCCC' }}>Nota minima</div>
                      <div className='row'>
                      <div type='text'>Detalles de la publicación</div>
                      </div>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <div className='row' style={{ color: '#1ECCCC' }}>Tareas</div>
                      <div className='row'>
                      <div type='text'>Detalles de la publicación</div>
                      </div>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <div className='row'style={{ color: '#1ECCCC' }}>Otros</div>
                      <div className='row'>
                      <div type='text'>Detalles de la publicación</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TablaCoordinador({ rows, titulos, mostrarBoton = true }) {
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
  );
}
