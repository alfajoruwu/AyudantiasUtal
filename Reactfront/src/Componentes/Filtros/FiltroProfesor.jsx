// FiltroProfesor.js
import React from 'react'

const FiltroProfesor = ({ profesores, profesorSeleccionado, handleProfesorSeleccionado }) => {
  return (
    <div className='col-md-3'>
      <label htmlFor='filtro-profesor' className='form-label'>Filtrar por profesor:</label>
      <select
        className='form-select'
        id='filtro-profesor'
        value={profesorSeleccionado}
        onChange={(e) => handleProfesorSeleccionado(e.target.value)}
      >
        {profesores.map((profesor, index) => (
          <option key={index} value={profesor}>{profesor}</option>
        ))}
      </select>
    </div>
  )
}

export default FiltroProfesor
