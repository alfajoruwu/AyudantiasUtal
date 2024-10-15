import './Navbar.css'
import '../../index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink } from 'react-router-dom'

export const Navbar = ({ children, nombreUsuario }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <nav className='navbar navbar-expand-lg custom-navbar-color'>
        <div className='container-fluid'>
          <button
            className='navbar-toggler'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNavAltMarkup'
            aria-controls='navbarNavAltMarkup'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' >

            
            </span>
          </button>
      
          

          <div
            className='collapse navbar-collapse'
            id='navbarNavAltMarkup'
          >
           
            <div className='navbar-nav'>{children}</div>
            
          </div>

          <div className=''>
            <div className='container'>
              <div className='row colorTexto'>Bienvenido</div>
              <div className='row colorTextoGris'>
                {nombreUsuario}
              </div>
            </div>
          </div>
          <NavLink to='/' className='iconoperfil'> </NavLink>
        </div>
      </nav>

      <div className='lineaCeleste' />
    </div>
  )
}
