import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom'
import NavbarLogin from '../../Componentes/navbar/NavbarLogin'
import './Login.css'
import axiosInstance from '../../utils/axiosInstance'
import authService from '../../utils/authService'
import { DataContext } from '../../Datos/DataContext'
import VerifyCode from './VerifyCode'

export default function Login (props) {
  const { setUsuariofinal } = useContext(DataContext)
  const [authMode, setAuthMode] = useState('signin')
  const [run, setUsuario] = useState('')
  const [password, setContraseña] = useState('')
  const [email, setEmail] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('') // Estado para el correo registrado
  const navigate = useNavigate()

  const changeAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
    setErrorMessage('')
  }

  const logearUsuario = async (event) => {
    event.preventDefault()
    try {
      if (!email) throw new Error('El nombre de usuario es requerido.')
      if (!password) throw new Error('La contraseña es requerida.')

      await authService.login(email, password)
      setErrorMessage('')
      mandarAVista()
    } catch (error) {
      setErrorMessage('Nombre de usuario o contraseña incorrecta. Inténtalo de nuevo.')
      console.error(error)
    }
  }

  const mandarAVista = () => {
    axiosInstance.get('/TipoUsuario/').then((response) => {
      console.log(response.data.tipo)
      switch (response.data.tipo) {
        case 'Profesor':
          sessionStorage.setItem('tipo', 'Profesor')
          navigate('/PublicarAyudantias')
          break
        case 'Coordinador':
          sessionStorage.setItem('tipo', 'Coordinador')
          navigate('/HorasAsignadas')
          break
        default:
          sessionStorage.setItem('tipo', 'Estudiante')
          navigate('/OfertasAyudantias')
      }
    })
  }

 

  const crearUsuario = (event) => {
    event.preventDefault()

    try {
      if (!run || !email || !password || !nombreCompleto) {
        throw new Error('Todos los campos son obligatorios.')
      }

      if (!email.endsWith('@utalca.cl') && !email.endsWith('@alumnos.utalca.cl')) {
        throw new Error('El correo electrónico debe ser de dominio @utalca.cl o @alumnos.utalca.cl')
      }

     

      const data = {
        run,
        email,
        password,
        nombre_completo: nombreCompleto
      }

      setUsuariofinal(data)
      setRegisteredEmail(email) // Guardar el correo registrado
      setAuthMode('verificar')

      axiosInstance
        .post('correo_enviar/', { destinatario: email })
        .then((response) => {
          if (response.status === 201) {
            setEmail('')
            setNombreCompleto('')
            changeAuthMode()
          }
        })
        .catch((error) => {
          console.error('Error al enviar correo:', error)
          setErrorMessage('Error al enviar correo electrónico.')
        })
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const formatearRun = (run) => {
    let runFormateado = run.replace(/[^0-9kK]/g, '')
    if (runFormateado.length > 9) {
      runFormateado = runFormateado.slice(0, -1)
    }
    if (runFormateado.length > 1) {
      runFormateado = runFormateado.slice(0, -1) + '-' + runFormateado.slice(-1)
    }
    if (runFormateado.length > 6) {
      runFormateado = runFormateado.slice(0, -5) + '.' + runFormateado.slice(-5)
    }
    if (runFormateado.length > 9) {
      runFormateado = runFormateado.slice(0, -9) + '.' + runFormateado.slice(-9)
    }
    setUsuario(runFormateado)
  }

  const volver = () => {
    setAuthMode('signin')
  }

  return (
    <div className='login-page'>
      <NavbarLogin />
      <div className='Auth-form-container'>
        {authMode === 'signin'
          ? (
            <form className='Auth-form' onSubmit={logearUsuario}>
              <div className='Auth-form-content'>
                <h3 className='Auth-form-title'>Utalca ayudantias</h3>
                <div className='text-center'>
                  No tienes cuenta?{' '}
                  <span className='link-custom' onClick={changeAuthMode}>
                    Registrarse
                  </span>
                </div>
                {errorMessage && (
                  <div className='alert alert-danger' role='alert'>
                    {errorMessage}
                  </div>
                )}
                <div className='form-group mt-3'>
                  <label>Correo</label>
                  <input
                    className='form-control mt-1'
                    placeholder='Correo'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='form-group mt-3'>
                  <label>Contraseña</label>
                  <input
                    type='password'
                    className='form-control mt-1'
                    value={password}
                    placeholder='Contraseña'
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                </div>
                <div className='d-grid gap-2 mt-3'>
                  <button type='submit' className='btn btn-ingresar'>
                    Ingresar
                  </button>
                </div>
                <p className='text-center mt-2'>
                  ¿Olvidaste tu contraseña?{' '}
                  <Link to='/password_request' className='link-custom'>
                    Recuperar
                  </Link>
                </p>
              </div>
            </form>
            )
          : authMode === 'verificar'
            ? (
              <VerifyCode volver={volver} />
              )
            : (
              <form className='Auth-form' onSubmit={crearUsuario}>
                <div className='Auth-form-content'>
                  <h3 className='Auth-form-title'>Utalca ayudantías</h3>
                  <div className='text-center'>
                    Ya tienes cuenta?{' '}
                    <span className='link-custom' onClick={changeAuthMode}>
                      Iniciar sesión
                    </span>
                  </div>
                  {errorMessage && (
                    <div className='alert alert-danger' role='alert'>
                      {errorMessage}
                    </div>
                  )}
                  {registeredEmail && (
                    <div className='alert alert-success' role='alert'>
                      Se ha registrado exitosamente el correo: {registeredEmail}
                    </div>
                  )}
                  <div className='form-group mt-3'>
                    <label>RUN</label>
                    <input
                      value={run}
                      onChange={(e) => formatearRun(e.target.value)}
                      className='form-control mt-1'
                      placeholder='RUN'
                    />
                  </div>
                  <div className='form-group mt-3'>
                    <label>Nombre completo</label>
                    <input
                      className='form-control mt-1'
                      placeholder='Nombre completo'
                      value={nombreCompleto}
                      onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                  </div>
                  <div className='form-group mt-3'>
                    <label>Correo electronico</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      
                      className='form-control mt-1'
                      placeholder='Correo electronico'
                    />
                  </div>
                  <div className='form-group mt-3'>
                    <label>Contraseña</label>
                    <input
                      value={password}
                      onChange={(e) => setContraseña(e.target.value)}
                      type='password'
                      className='form-control mt-1'
                      placeholder='Contraseña'
                    />
                  </div>
                  <div className='d-grid gap-2 mt-3'>
                    <button type='submit' className='btn btn-ingresar'>
                      Crear
                    </button>
                  </div>
                </div>
              </form>
              )}
      </div>
    </div>
  )
}
