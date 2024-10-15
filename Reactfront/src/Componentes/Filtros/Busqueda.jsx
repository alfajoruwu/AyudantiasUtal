// Componente Busqueda.jsx
import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const Busqueda = ({ columna, onBuscar }) => {
  const [busqueda, setBusqueda] = useState('')

  const handleBusqueda = (e) => {
    const valorBusqueda = e.target.value
    setBusqueda(valorBusqueda)
    onBuscar(valorBusqueda)
  }

  return (
    <div className='col-md-3'>
      <label htmlFor='Busqueda'>Busqueda RUN:</label>
      <Form.Group>
        <Form.Control
          type='text'
          placeholder={`Buscar por ${columna}`}
          value={busqueda}
          onChange={handleBusqueda}
        />
      </Form.Group>
    </div>
  )
}

export default Busqueda
