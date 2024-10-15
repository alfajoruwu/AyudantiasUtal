import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axiosInstance from '../../utils/axiosInstance'

function PasswordReset () {
  const { uid, token } = useParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('Contraseñas no coinciden')
      return
    }

    try {
      const response = await axiosInstance.post(`/reset/${uid}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword
      },
      { headers: { 'Content-Type': 'application/json' } }
      )
      setMessage(response.data.message)
      if (response.status === 200) {
        navigate('/')
      }
    } catch (error) {
      setMessage(error.response.data.error)
    }
  }

  const volver = () => {
    navigate('/')
  }

  return (
    <div className='login-page'>
      <div className='Auth-form-container'>
        <form className='Auth-form' onSubmit={handleSubmit}>
          <div className='Auth-form-content'>
            <h3 className='Auth-form-title'>Recuperar contraseña</h3>
            <div className='form-group mt-3'>
              <label>Nueva contraseña:</label>
              <input
                type='password'
                className='form-control mt-1'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className='form-group mt-3'>
              <label>Confirmar contraseña:</label>
              <input
                type='password'
                className='form-control mt-1'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className='d-grid gap-2 mt-3'>
              <button type='submit' className='btn btn-primary'>
                Asignar nueva contraseña
              </button>
              <button type='button' className='btn btn-secondary' onClick={volver}>
                Cancelar
              </button>
            </div>
            {message && <p className='text-center mt-2'>{message}</p>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordReset
