import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import NavbarAlumno from '../../Componentes/navbar/NavbarAlumno'
import axiosInstance from '../../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DatosPersonales = () => {
  const [Promedio, SetPromedio] = useState('')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [matricula, setMatricula] = useState('')
  const [tipoCuenta, setTipoCuenta] = useState('')
  const [NCuenta, setNCuenta] = useState('')
  const [banco, setBanco] = useState('')
  const [NContacto, setNContacto] = useState('')
  const [OtroContacto, setOtroContacto] = useState('')
  const [riesgo, setRiesgo] = useState('')
  const [charlagenero, setCharlagenero] = useState('')
  
  // Función para mostrar los errores del backend
  const mostrarErroresBackend = (errorData) => {
    if (typeof errorData !== 'object' || !errorData) {
      toast.error('Error desconocido. Inténtelo de nuevo.', { position: 'bottom-right' })
      return
    }

    // Mostrar cada mensaje de error en una notificación separada
    Object.keys(errorData).forEach(campo => {
      const mensaje = Array.isArray(errorData[campo]) 
        ? errorData[campo][0] 
        : errorData[campo]
      
      toast.error(`${campo}: ${mensaje}`, { position: 'bottom-right' })
    })
  }

  useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Datos/')
        console.log(response)
        setNombre(response.data.nombre_completo)
        SetPromedio(response.data.Promedio)
        setCorreo(response.data.email)
        setMatricula(response.data.matricula)
        setTipoCuenta(response.data.tipo_cuenta)
        setNCuenta(response.data.n_cuenta)
        setBanco(response.data.banco)
        setNContacto(response.data.n_contacto)
        setOtroContacto(response.data.otro_contacto)
        setRiesgo(response.data.riesgo_academico)
        setCharlagenero(response.data.charla)
      } catch (error) {
        console.error('Error al obtener los datos:', error)
        if (error.response && error.response.data) {
          // Si el backend envía un mensaje específico
          if (typeof error.response.data === 'string') {
            toast.error(`Error: ${error.response.data}`, { position: 'bottom-right' })
          } else if (error.response.data.detail) {
            toast.error(`Error: ${error.response.data.detail}`, { position: 'bottom-right' })
          } else {
            mostrarErroresBackend(error.response.data)
          }
        } else if (error.response) {
          toast.error(`Error ${error.response.status}: No se pudieron cargar sus datos`, { position: 'bottom-right' })
        } else {
          toast.error('Error al cargar sus datos. Compruebe su conexión.', { position: 'bottom-right' })
        }
      }
    }
    ObtenerDatos()
  }, [])

  const validarCampos = () => {
    const camposFaltantes = []
    
    if (!nombre) camposFaltantes.push('Nombre')
    if (!correo) camposFaltantes.push('Correo')
    if (!matricula) camposFaltantes.push('Matrícula')
    if (!tipoCuenta) camposFaltantes.push('Tipo de cuenta')
    if (!NCuenta) camposFaltantes.push('Número de cuenta')
    if (!banco) camposFaltantes.push('Banco')
    if (!NContacto) camposFaltantes.push('Número de contacto')
    if (!OtroContacto) camposFaltantes.push('Otro contacto')
    if (!Promedio) camposFaltantes.push('Promedio')
    
    if (camposFaltantes.length > 0) {
      if (camposFaltantes.length > 2) {
        toast.error(`Por favor, complete los siguientes campos: ${camposFaltantes.join(', ')}.`, { position: 'bottom-right' })
      } else {
        toast.error(`Por favor, complete el campo ${camposFaltantes.join(' y ')}.`, { position: 'bottom-right' })
      }
      return false
    }
    return true
  }

  const LlenarDatos = async () => {
    if (!validarCampos()) {
      return
    }
    try {
      const response = await axiosInstance.patch('Datos/uwu/', {
        nombre_completo: nombre,
        email: correo,
        otro_contacto: OtroContacto,
        matricula,
        tipo_cuenta: tipoCuenta,
        n_cuenta: NCuenta,
        banco,
        n_contacto: NContacto,
        riesgo_academico: riesgo,
        charla: charlagenero,
        Promedio
      })

      console.log(response.data)
      toast.success('Datos guardados exitosamente.', { position: 'bottom-right' })
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            // Error de validación de datos
            if (data && typeof data === 'object') {
              console.log('Errores del backend:', data)
              mostrarErroresBackend(data)
            } else {
              toast.error('Error en la validación de datos', { position: 'bottom-right' })
            }
            break
            
          case 401:
            // Error de autenticación
            toast.error('Sesión expirada. Por favor inicie sesión nuevamente.', { position: 'bottom-right' })
            break
            
          case 403:
            // Error de permisos
            toast.error('No tiene permisos para realizar esta acción', { position: 'bottom-right' })
            break
            
          case 404:
            // Recurso no encontrado
            toast.error('No se encontró el recurso solicitado', { position: 'bottom-right' })
            break
            
          case 500:
            // Error interno del servidor
            toast.error('Error interno del servidor. Intente más tarde.', { position: 'bottom-right' })
            break
            
          default:
            // Otros errores
            toast.error(`Error (${status}): ${data?.detail || 'Problema al procesar la solicitud'}`, { position: 'bottom-right' })
        }
      } else if (error.request) {
        // No se recibió respuesta del servidor
        toast.error('No se recibió respuesta del servidor. Verifique su conexión.', { position: 'bottom-right' })
      } else {
        // Error al configurar la solicitud
        toast.error('Error al preparar la solicitud: ' + error.message, { position: 'bottom-right' })
      }
    }
  }

  return (
    <>
      <div className='principal'>
        <NavbarAlumno />
        <div className='container Componente '>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>Nombre</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input name='nombre' className='' onChange={(e) => setNombre(e.target.value)} value={nombre} />
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='row'>
                <div className='col-6'>
                  <h6 className='letra'>Estoy en riesgo académico</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input className='form-check-input' type='checkbox' checked={riesgo} onChange={(e) => setRiesgo(e.target.checked)} id='riesgo' />
                </div>
              </div>
              <div className='row' style={{ marginTop: '1rem' }}>
                <div className='col-6'>
                  <h6 className='letra'>Realicé la charla de género</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input className='form-check-input' type='checkbox' checked={charlagenero} onChange={(e) => setCharlagenero(e.target.checked)} id='charlagenero' />
                </div>
              </div>
            </div>
          </div>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>Matrícula</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input name='matricula' className='' onChange={(e) => setMatricula(e.target.value)} value={matricula} />
                </div>
              </div>
            </div>
            <div className='col' />
          </div>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>Tipo de cuenta</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input name='tipo_cuenta' className='' onChange={(e) => setTipoCuenta(e.target.value)} value={tipoCuenta} />
                </div>
              </div>
            </div>
            <div className='col' />
          </div>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>N° de cuenta</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input name='n_cuenta' className='' onChange={(e) => setNCuenta(e.target.value)} value={NCuenta} />
                </div>
              </div>
            </div>
            <div className='col' />
          </div>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>Banco</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input name='banco' className='' onChange={(e) => setBanco(e.target.value)} value={banco} />
                </div>
              </div>
            </div>
            <div className='col' />
          </div>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>N° de contacto</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input name='n_contacto' placeholder='+56912341234'  className='' onChange={(e) => setNContacto(e.target.value)} value={NContacto} />
                </div>
              </div>
            </div>
            <div className='col' />
          </div>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>Promedio semestre anterior</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                <input 
    name='Promedio' 
    type='text' 
    pattern="^\d*\.?\d*$"  // Regla de patrón para permitir solo números y un punto decimal
    inputMode='decimal'    // Muestra el teclado adecuado en dispositivos móviles
    autoComplete="off" 
    onChange={(e) => {
      const value = e.target.value.replace(',', '.');  // Reemplaza comas por puntos
      SetPromedio(value);
    }} 
    value={Promedio} 
  /></div>
              </div>
            </div>
            <div className='col' />
          </div>
          <div className='row margen'>
            <div className='col'>
              <div className='row'>
                <div className='col-3'>
                  <h6 className='letra'>Otro contacto</h6>
                  <div className='linea' />
                </div>
                <div className='col'>
                  <input name='otro_contacto' className='' onChange={(e) => setOtroContacto(e.target.value)} value={OtroContacto} />
                </div>
              </div>
            </div>
            <div className='col' />
          </div>
        </div>
        <div className='container d-flex justify-content-center align-items-center'>
          <button className='btn color-btn' onClick={LlenarDatos}> Guardar</button>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

export default DatosPersonales
