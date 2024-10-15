// FiltroHoras.js
import React from 'react'

const FiltroHoras = ({ hoursFilter, handleHoursFilterChange }) => {
  return (
    <div className='col-md-2'>
      <label htmlFor='hours-filter' className='form-label'>Filtrar por horas:</label>
      <select
        className='form-control'
        id='hours-filter'
        value={hoursFilter}
        onChange={(e) => handleHoursFilterChange(e.target.value)}
      >
        <option value='all'>Todos</option>
        <option value='non-zero'>Módulos con horas</option>
        <option value='zero'>Módulos sin horas</option>
      </select>
    </div>
  )
}

export default FiltroHoras
