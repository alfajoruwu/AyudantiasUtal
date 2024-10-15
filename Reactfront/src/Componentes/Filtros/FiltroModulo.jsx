// FiltroModulo.js
import React from 'react'

const FiltroModulo = ({ modulos, moduloSeleccionado, handleModuloSeleccionado }) => {
  return (
    <div className='col-md-4'>
      <label htmlFor='filtro-modulo' className='form-label'>Filtrar por módulo:</label>
      <select
        className='form-select'
        id='filtro-modulo'
        value={moduloSeleccionado}
        onChange={(e) => handleModuloSeleccionado(e.target.value)}
      >
        {modulos.map((modulo, index) => (
          <option key={index} value={modulo}>{modulo}</option>
        ))}
      </select>
    </div>
  )
}

export default FiltroModulo
