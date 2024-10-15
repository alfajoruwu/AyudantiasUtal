import React from 'react'

export const FiltroEstado = ({ estadoSeleccionado, handleEstadoSeleccionado }) => (
  <div className='col-md-3'>
    <label htmlFor='filtro-estado' className='form-label'>Filtrar por estado:</label>
    <div className='d-flex align-items-center'>
      <select
        className='form-select'
        id='filtro-estado'
        value={estadoSeleccionado}
        onChange={(e) => handleEstadoSeleccionado(e.target.value)}
      >
        <option value='Todos'>Todos</option>
        <option value='Pendiente'>Pendiente</option>
        <option value='Publicado'>Publicado</option>
      </select>
    </div>
  </div>
)

export default FiltroEstado
