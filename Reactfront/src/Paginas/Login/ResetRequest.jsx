import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axiosInstance from '../../utils/axiosInstance'

function PasswordResetRequest () {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosInstance.post('/password_reset/', {
        email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setMessage(response.data.message)
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
            <h3 className='Auth-form-title'>Correo asignado a la cuenta</h3>
            <div className='form-group mt-3'>
              <label>Email:</label>
              <input
                type='email'
                className='form-control mt-1'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='d-grid gap-2 mt-3'>
              <button type='submit' className='btn btn-primary'>
                Reiniciar contraseña
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

export default PasswordResetRequest
