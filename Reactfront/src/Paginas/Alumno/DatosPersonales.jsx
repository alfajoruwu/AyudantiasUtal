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
        console.error('Error al enviar la solicitud:', error)
      }
    }
    ObtenerDatos()
  }, [])

  const validarCampos = () => {
    if (
      !nombre ||
      !correo ||
      !matricula ||
      !tipoCuenta ||
      !NCuenta ||
      !banco ||
      !NContacto ||
      !OtroContacto ||
      !Promedio
    ) {
      toast.error('Por favor, complete todos los campos.', { position: 'bottom-right' })
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
      if (error.response.status === 400) {
        console.log(error.response.data.Promedio[0])
        if (error.response.data.Promedio[0]) {
          toast.error(error.response.data.Promedio[0], { position: 'bottom-right' })
        } else {
          toast.error('Error al enviar la solicitud. Inténtelo de nuevo.', { position: 'bottom-right' })
        }
      } else {
        toast.error('Error. Inténtelo de nuevo.', { position: 'bottom-right' })
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
