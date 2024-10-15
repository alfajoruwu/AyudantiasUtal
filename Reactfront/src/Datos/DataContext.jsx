import { createContext, useState } from 'react'

export const DataContext = createContext()

export function DataContextProvider (props) {
  // aqui van las variables que quieren que sean glovales
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [usuario, setUsuariofinal] = useState({
    run: '',
    email: '',
    contraseña:'',
    nombre_completo: '',
  })

  // recuerden exportarlas
  return (
    <DataContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken,usuario,setUsuariofinal }}>
      {props.children}
    </DataContext.Provider>
  )
}

// forma de usarlo facilito,
// importas esto:
// import { DataContext } from '../variables/DataContext';

// forma de llamarlo (recomendable)
//     const {valorFermona} = useContext(DataContext);
// llamar la variable del datacontext y usarlo tal cual
