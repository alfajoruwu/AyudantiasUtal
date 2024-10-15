import React from 'react'

const FiltroYear = ({ years, yearSeleccionado, handleYearSeleccionado }) => (
  <div className='col-md-2'>
    <label htmlFor='filtro-year' className='form-label'>Filtrar por año:</label>
    <select
      className='form-select'
      id='filtro-year'
      value={yearSeleccionado}
      onChange={(e) => handleYearSeleccionado(e.target.value)}
    >
      {years.map((year, index) => (
        <option key={index} value={year}>{year}</option>
      ))}
    </select>
  </div>
)

const FiltroSemestre = ({ semestres, semestreSeleccionado, handleSemestreSeleccionado }) => (
  <div className='col-md-2'>
    <label htmlFor='filtro-semestre' className='form-label'>Filtrar por semestre</label>
    <select
      className='form-select'
      id='filtro-semestre'
      value={semestreSeleccionado}
      onChange={(e) => handleSemestreSeleccionado(e.target.value)}
    >
      {semestres.map((semestre, index) => (
        <option key={index} value={semestre}>{semestre}</option>
      ))}
    </select>
  </div>
)

export { FiltroYear, FiltroSemestre }
