import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import axiosInstance from '../../utils/axiosInstance';
import './NavbarMarcela.css';
import logo from './logo.png';

const NavbarLogin = () => {
  const [nombre, setNombre] = useState('por defecto');
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Datos/');
        setNombre(response.data.nombre_completo);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };

    obtenerDatos();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('logout/');
      console.log(response.data);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <Navbar expand="lg" className="custom-navbar-color">
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand className="d-flex align-items-center">
            <img
              src={logo}
              alt="Logo"
              height="60"
              width="auto"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <div className="navbar-title">Sistema de gestión de ayudantía</div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="lineaCeleste" />
    </div>
  );
};

export default NavbarLogin;
