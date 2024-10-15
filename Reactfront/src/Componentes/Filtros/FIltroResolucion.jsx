import React from 'react'

const FiltroResolucion = ({ resoluciones, resolucionSeleccionada, handleResolucionSeleccionada }) => {
  return (
    <div className='col-md-3'>
      <label htmlFor='resolucion'>Filtro por Proceso:</label>
      <select
        className='form-select'
        id='resolucion'
        value={resolucionSeleccionada}
        onChange={(e) => handleResolucionSeleccionada(e.target.value)}
      >
        {resoluciones.map((resolucion) => (
          <option key={resolucion} value={resolucion}>{resolucion}</option>
        ))}
      </select>
    </div>
  )
}

export default FiltroResolucion
