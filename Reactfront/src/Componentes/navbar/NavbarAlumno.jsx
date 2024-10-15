import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import './NavbarMarcela.css'
import logo from './logo.png'
import cerrarSesion from './cerrarSesion.png'

const NavbarAlumno = () => {
  const [nombre, setNombre] = useState(sessionStorage.getItem('nombre') || 'Estudiante')
  const [error, setError] = useState(null)

  useEffect(() => {
    const obtenerDatos = async () => {
      if (!sessionStorage.getItem('nombre')) {
        try {
          const response = await axiosInstance.get('Datos/')
          const nombreCompleto = response.data.nombre_completo
          setNombre(nombreCompleto)
          sessionStorage.setItem('nombre', nombreCompleto)
          sessionStorage.setItem('tipo', 'Estudiante')
        } catch (error) {
          setError(error)
          console.log(error)
        }
      }
    }

    obtenerDatos()
  }, [])

  const handleLogout = async () => {
    try {
      await axiosInstance.post('logout/')
      sessionStorage.removeItem('nombre')
      sessionStorage.removeItem('tipo')
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <Navbar expand='lg' className='custom-navbar-color'>
        <Container>
          <Navbar.Brand>
            <img
              src={logo}
              alt='Logo'
              height='80'
              width='auto'
              className='d-inline-block align-top'
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/OfertasAyudantias'
              >
                Ofertas Ayudantías
              </NavLink>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/Resultados'
              >
                Resultados
              </NavLink>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/DatosPersonales'
              >
                Datos Personales
              </NavLink>
            </Nav>
            <Nav>
              <div className='colorTextoGris'>{nombre}</div>
              <button onClick={handleLogout} className='iconoperfil'>
                <img
                  src={cerrarSesion}
                  alt='Logout'
                  height='35'
                  width='35'
                  className='logout-icon'
                />
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='lineaCeleste' />
    </div>
  )
}

export default NavbarAlumno
