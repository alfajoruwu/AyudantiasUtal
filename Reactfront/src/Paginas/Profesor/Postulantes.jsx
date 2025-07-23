import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarProfesor'
import TablaSimple from '../../Componentes/Tablaejemplo/TablaSimpleProfesor'
import axiosInstance from '../../utils/axiosInstance'

const Postulantes = () => {
  const titulos = ['Postulantes', 'Matrícula', 'Nota Aprobacion', 'Estado', 'Comentario', 'Información', 'Seleccionar']
  const navigate = useNavigate()
  const { oferta } = useParams()
  const [rows, setRows] = useState([])
  const [nombreModulo, setNombreModulo] = useState('')

  const setearRows = (data) => {
    const rows = data.map((postulante) => {
      return {
        id: postulante.id,
        Nombre: postulante.nombre_postulante,
        Matricula: postulante.matricula || '-',
        NotaAprovacion: postulante.nota_aprobacion,
        Estado: (
          <div style={{ display: 'flex', gap: '5px' }}>
            {postulante.riesgo_academico && 
              <span title="En riesgo académico" style={{ 
                backgroundColor: '#FFF3CD', 
                color: '#856404', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.8em'
              }}>
                ⚠️ Riesgo
              </span>
            }
            {postulante.charla_genero && 
              <span title="Completó charla de género" style={{ 
                backgroundColor: '#D4EDDA', 
                color: '#155724', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.8em' 
              }}>
                ✓ Charla
              </span>
            }
            {!postulante.riesgo_academico && !postulante.charla_genero && 
              <span style={{ 
                padding: '2px 8px',
                fontSize: '0.8em' 
              }}>
                -
              </span>
            }
          </div>
        ),
        Comentario: postulante.comentario,
        BotonInfo: {
          titulo: 'Ver Info',
          funcion: () => {
            // Crear una ventana modal personalizada con React-Toastify para mostrar información detallada
            toast(
              <div style={{ padding: '10px' }}>
                <h5 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '10px' }}>
                  Información del Postulante
                </h5>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Contacto:</strong><br />
                  <span>📧 Correo: {postulante.contacto.correo}</span><br />
                  <span>📱 Teléfono: {postulante.contacto.telefono}</span><br />
                  {postulante.contacto.otro && <span>📝 Otro: {postulante.contacto.otro}</span>}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Información académica:</strong><br />
                  <span> Promedio: {postulante.promedio || 'No disponible'}</span>
                </div>
              </div>,
              {
                position: "top-center",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                  background: '#fff',
                  color: '#333',
                  minWidth: '320px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                  borderRadius: '8px'
                }
              }
            );
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
    // Obtener datos de los postulantes
    axiosInstance.get('/Postulaciones/' + oferta + '/')
      .then((response) => {
        console.log('Datos de postulantes:', response.data)
        setearRows(response.data)
        
        // Obtener el nombre del módulo
        if (response.data && response.data.length > 0) {
          const nombreModulo = response.data[0]?.modulo || 'Ayudantía';
          setNombreModulo(nombreModulo);
        }
      })
      .catch((error) => {
        console.error('Error al obtener postulantes:', error)
        toast.error('Error al cargar los postulantes', { position: 'bottom-right' })
      })
  }, [oferta])

  return (
    <div className='principal'>
      <Navbar />

      <div className='container Componente'>
        <div className='row mb-4'>
          <div className='col-12'>
            <h3 className='mb-3'>{nombreModulo} - Listado de Postulantes</h3>
          </div>
        </div>
        
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
