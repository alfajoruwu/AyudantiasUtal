import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Collapse, Box } from '@mui/material';
import './TablaSimpleProfesor.css';

function Row({ row, titulos }) {
  const [open, setOpen] = useState(false);

  const handleRowClick = () => {
    setOpen(!open);
  };

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
    <>
      <TableRow onClick={handleRowClick} style={{ cursor: 'pointer' }}>
        {Object.keys(row).map((key, index) => {
          if (key === 'id') return null;
          if (key === 'BotonPostulantes' || key === 'BotonSeleccionar') {
            return (
              <TableCell key={key}>
                <button
                  className={row[key].estado ? 'btn color-btn Activo' : 'btn color-btn'}
                  onClick={() => row[key].funcion()}
                >
                  {row[key].titulo}
                </button>
              </TableCell>
            );
          }
          if (key.startsWith('Boton')) {
            return (
              <TableCell key={key}>
                <button className='btn color-btn' onClick={() => row[key].funcion()}>
                  {row[key].titulo}
                </button>
              </TableCell>
            );
          }
          if (key.startsWith('EntradaTexto')) {
            return (
              <TableCell key={key}>
                <input type='text' id={key} placeholder={row[key]} />
              </TableCell>
            );
          }
          const cellClass = index === 0 ? 'primero container justify-content-center align-items-center d-flex' : 'd-flex demas container justify-content-center align-items-center';
          return (
            <TableCell key={key}>
              <div className={cellClass}>{row[key]}</div>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={Object.keys(row).length}>
          <Collapse in={open} timeout="auto" unmountOnExit>

          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TablaSimplev2({ rows, titulos }) {
  return (
    <TableContainer>
      <Table className='custom-table' aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            {titulos.map((titulo) => (
              <TableCell key={titulo}>{titulo}
                <div className='linea' />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} titulos={titulos} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
