const Tablaejemplo = () => {
  return (
    <div>
      <table className='table'>
        {/* cabecera */}
        <thead>
          <tr>
            <th scope='col'>id</th>
            <th scope='col'>columna 1</th>
            <th scope='col'>columna 2</th>
            <th scope='col'>columna 3</th>
          </tr>
        </thead>

        <tbody>
          {/* cada tr es una fila */}
          <tr>
            <td />
            <td />
            <td>No hay datos</td>
            <td />
          </tr>

          {/*
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
      */}
        </tbody>
      </table>
    </div>
  )
}

export default Tablaejemplo
