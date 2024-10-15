import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const FiltroFecha = ({ handleFechaSeleccionada }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(new Date())

  const handleChangeStart = (date) => {
    setStartDate(date)
    handleFechaSeleccionada(date, endDate)
  }

  const handleChangeEnd = (date) => {
    setEndDate(date)
    handleFechaSeleccionada(startDate, date)
  }

  return (
    <div className='col-md-2'>
      <label>Fecha Inicio:</label>
      <DatePicker
        className='form-control'
        selected={startDate}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        onChange={handleChangeStart}
        isClearable
      />
      <label>Fecha Fin:</label>
      <DatePicker
        className='form-control'
        selected={endDate}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        onChange={handleChangeEnd}
        isClearable
      />
    </div>
  )
}

export default FiltroFecha
