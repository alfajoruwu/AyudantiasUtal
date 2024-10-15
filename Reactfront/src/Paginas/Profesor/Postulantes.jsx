import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarProfesor'
import TablaSimple from '../../Componentes/Tablaejemplo/TablaSimpleProfesor'
import axiosInstance from '../../utils/axiosInstance'

const Postulantes = () => {
  const titulos = ['Postulantes', 'Nota Aprobacion', 'Comentario', 'Contacto', 'Seleccionar']
  const navigate = useNavigate()
  const { oferta } = useParams()
  const [rows, setRows] = useState([])

  const setearRows = (data) => {
    const rows = data.map((postulante) => {
      return {
        id: postulante.id,
        Nombre: postulante.nombre_postulante,
        NotaAprovacion: postulante.nota_aprobacion,
        Comentario: postulante.comentario,
        BotonContacto: {
          titulo: 'Ver Contacto',
          funcion: () => {
            window.alert('Correo: ' + postulante.contacto.correo + '\nTelefono: ' + postulante.contacto.telefono + '\nOtro: ' + postulante.contacto.otro)
          }
        },
        BotonSeleccionar: {
          titulo: 'Seleccionar',
          estado: postulante.estado,
          funcion: () => {
            axiosInstance.patch('/Postulaciones/' + postulante.id + '/', { id: postulante.id, estado: !postulante.estado }).then((response) => {
              if (response.data.estado) {
                navigate('/VerPostulantes')
              } else {
                // actualizar datos
                axiosInstance.get('/Postulaciones/' + oferta + '/').then((response) => {
                  setearRows(response.data)
                }).then(() => {
                  toast.success('Postulante deseleccionado', { position: 'bottom-right' })
                })
              }
            }).catch((error) => {
              console.log(error)
              // si es un error 400 algo (400, 401, 403, 404, 405, 406, 415, 422) es porque el usuario ingreso mal los datos
              if (error.response.status >= 400 && error.response.status < 500) {
                if (error.response.data.detail) {
                  toast.error(error.response.data.detail, { position: 'bottom-right' })
                } else {
                  toast.error('Error al seleccionar postulante', { position: 'bottom-right' })
                }
              } else {
                toast.error('Error al seleccionar postulante', { position: 'bottom-right' })
              }
            })
          }
        }
      }
    })
    setRows(rows)
  }
  useEffect(() => {
    axiosInstance.get('/Postulaciones/' + oferta + '/').then((response) => {
      setearRows(response.data)
    })
  }, [oferta])

  return (
    <div className='principal'>
      <Navbar />

      <div className='container Componente'>
        <TablaSimple rows={rows} titulos={titulos} />

        <div className='row'>
          <NavLink to='/VerPostulantes' className='btn color-btn'>
            {' '}
            Volver{' '}
          </NavLink>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Postulantes
