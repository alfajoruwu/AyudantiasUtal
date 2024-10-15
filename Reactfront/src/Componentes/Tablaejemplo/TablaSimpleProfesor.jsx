import React from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

import './TablaSimpleProfesor.css'

function handleButtonClick (funcion) {
  funcion()
}

export default function TablaSimple ({ rows, titulos }) {
  return (
    <TableContainer>
      <Table className='custom-table' aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            {titulos.map((titulo) => (
              <>
                <TableCell key={titulo}>{titulo}
                  <div className='linea' />
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            let isFirstCell = true
            return (
              <TableRow key={row.id}>
                {Object.keys(row).map((key) => {
                  if (key === 'id') return null
                  if (key === 'BotonPostulantes') {
                    return (
                      <TableCell key={key}>
                        <button className={row[key].estado ? 'btn color-btn Activo' : 'btn color-btn '} onClick={() => row[key].funcion()}>{row[key].titulo}</button>
                      </TableCell>

                    )
                  }
                  if (key === 'BotonSeleccionar') {
                    return (
                      <TableCell key={key}>
                        <button className={row[key].estado ? 'btn color-btn Activo' : 'btn color-btn '} onClick={() => row[key].funcion()}>{row[key].titulo}</button>
                      </TableCell>
                    )
                  }

                  if (key.startsWith('Boton')) {
                    return (
                      <TableCell key={key}>
                        <button className='btn color-btn  ' onClick={() => row[key].funcion()}>{row[key].titulo}</button>
                      </TableCell>
                    )
                  }
                  if (key.startsWith('EntradaTexto')) {
                    return (
                      <TableCell key={key}>
                        <input type='text' id={key} placeholder={row[key]}>aa</input>
                      </TableCell>
                    )
                  }
                  const cellClass = isFirstCell ? 'primero container justify-content-center align-items-center d-flex ' : 'd-flex  demas container justify-content-center align-items-center' // Determina la clase de la celda
                  isFirstCell = false // Actualiza isFirstCell después de procesar el primer elemento
                  return (
                    <TableCell key={key}>
                      <div className={cellClass}>{row[key]}</div>
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
