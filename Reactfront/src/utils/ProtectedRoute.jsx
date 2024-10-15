import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = ({
  tipoDeUsuario
}) => {
  const tipo = sessionStorage.getItem('tipo')
  if (tipo === tipoDeUsuario) {
    return <Outlet />
  }
  return <Navigate to='/' replace />
}
export default ProtectedRoute
