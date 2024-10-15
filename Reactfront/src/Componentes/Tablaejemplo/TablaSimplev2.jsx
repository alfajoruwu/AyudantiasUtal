import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './TablaSimplev2.css';
import '../../Paginas/App/App.css';

export default function TablaSimplev2({ rows, titulos, onDropdownChange, onHorasChange, color }) {
  const [editingRowId, setEditingRowId] = useState(null);
  const [tempHoras, setTempHoras] = useState('');

  const handleEditClick = (rowId, currentHoras) => {
    setEditingRowId(rowId);
    setTempHoras(currentHoras);
  };

  const handleAcceptClick = (rowId) => {
    onHorasChange(rowId, tempHoras);
    setEditingRowId(null);
  };

  return (
    <TableContainer>
      <Table className="custom-table">
        <TableHead>
          <TableRow>
            {titulos.map((titulo, index) => (
              <TableCell key={index}>
                {titulo !== '' ? (
                  <>
                    {titulo}
                    <div className="linea" />
                  </>
                ) : (
                  <>{titulo}</>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            let isFirstCell = true;
            return (
              <TableRow key={row.id}>
                {Object.keys(row).map((key) => {
                  if (key === 'id') return null;

                  if (key.startsWith('Boton')) {
                    const buttonProps = row[key];
                    const buttonClass = buttonProps.color === 'historial' ? 'azul-button' :
                                        buttonProps.color === 'activo' ? 'yellow-button' : 'color-btn';

                    return (
                      <TableCell key={key}>
                        <button className={`btn ${buttonClass}`} onClick={() => buttonProps.funcion()}>
                          {buttonProps.titulo}
                        </button>
                      </TableCell>
                    );
                  }

                  if (key.startsWith('EntradaTexto')) {
                    return (
                      <TableCell key={key}>
                        <input type="text" id={key} placeholder={row[key]} />
                      </TableCell>
                    );
                  }

                  if (key.startsWith('Dropdown')) {
                    const defaultValue = row[key].default.nombre_completo;
                    return (
                      <TableCell key={key}>
                        <select
                          id={key}
                          name={key}
                          defaultValue={defaultValue}
                          className="form-select"
                          onChange={(e) => onDropdownChange(row.id, e.target.value)}
                        >
                          {row[key].lista_profesor.map((profesor, index) => (
                            <option key={index} value={profesor.nombre_completo}>
                              {profesor.nombre_completo}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    );
                  }

                  if (key === 'HorasTotales') {
                    return (
                      <TableCell key={key}>
                        <div className="input-group">
                          <input
                            type="number"
                            value={editingRowId === row.id ? tempHoras : row[key]}
                            onChange={(e) => setTempHoras(e.target.value)}
                            className="form-control"
                            disabled={editingRowId !== row.id}
                          />
                          <button
                            onClick={() => handleAcceptClick(row.id)}
                            className={`btn btn-success btn-sm ${editingRowId === row.id ? 'd-inline-block' : 'd-none'}`}
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleEditClick(row.id, row[key])}
                            className={`btn btn-outline-primary btn-sm ${editingRowId === row.id ? 'd-none' : 'd-inline-block'}`}
                          >
                            Editar
                          </button>
                        </div>
                      </TableCell>
                    );
                  }

                  const cellClass = isFirstCell ? 'primero container justify-content-center align-items-center d-flex' : 'd-flex demas container justify-content-center align-items-center';
                  isFirstCell = false;
                  return (
                    <TableCell key={key}>
                      <div className={cellClass}>{row[key]}</div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
