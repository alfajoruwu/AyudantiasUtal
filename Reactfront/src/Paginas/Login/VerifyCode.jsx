import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import axiosInstance from '../../utils/axiosInstance'
import { DataContext } from '../../Datos/DataContext'

export default function VerifyCode (props) {
  const [codigo, setCodigo] = useState('')
  const { usuario } = useContext(DataContext)
  const volver = () => {
    props.volver()
  }

  const verificarCodigo = (event) => {
    event.preventDefault()
    const data = {
      run: usuario.run,
      nombre_completo: usuario.nombre_completo,
      codigo,
      email: usuario.email,
      password: usuario.password
    }

    axiosInstance
      .post('/create/', data)
      .then((response) => {
        if (response.status === 201) {
          console.log('Código válido')
          props.volver()
        } else {
          console.log('Código inválido')
        }
      })
      .catch((error) => {
        console.error('Error al verificar el código:', error)
      })
  }

  return (
    <div className='Auth-form-container'>
      <form className='Auth-form' onSubmit={verificarCodigo}>
        <div className='Auth-form-content'>
          <h3 className='Auth-form-title'>Verificar Código</h3>
          <p className='mt-3'>Registrado con el correo: {usuario.email}</p>
          <div className='form-group mt-3'>
            <label>Código de 6 dígitos</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className='form-control mt-1'
              placeholder='Código de verificación'
              maxLength={6}
            />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button type='submit' className='btn btn-custom'>
              Verificar
            </button>
            <button type='button' className='btn btn-secondary' onClick={volver}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
