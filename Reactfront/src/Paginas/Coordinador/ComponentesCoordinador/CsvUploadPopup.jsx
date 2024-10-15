import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import * as XLSX from 'xlsx'
import axiosinstance from '../../../utils/axiosInstance'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CsvUploadPopup = ({ show, onClose, updateModules }) => {
  const [jsonData, setJsonData] = useState([])
  const [error, setError] = useState(null)
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [fileSelected, setFileSelected] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (evt) => {
      const data = evt.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      // Filtrar solo las columnas de "Curso", "Sección" y "Horas"
      jsonData = jsonData.map(row => ({
        Curso: row[1], // Columna "Curso"
        Seccion: row[2],
        Horas: row[3], // Columna "Horas"
        historial: '- Horas iniciales: ' + row[3] + '\r\n'
      }))

      jsonData = jsonData.slice(1)
      // Eliminar filas donde "Curso" es undefined
      jsonData = jsonData.filter(row => row.Curso !== undefined)

      setJsonData(jsonData)
      setFileSelected(true) // Indicar que un archivo ha sido seleccionado
      setError(null) // Reset error state when a new file is selected
      toast.success('Archivo leído correctamente', { position: 'bottom-right' })
      console.log(jsonData)
    }

    reader.onerror = () => {
      setError('Error al leer el archivo')
      toast.error('Error al leer el archivo', { position: 'bottom-right' })
    }

    reader.readAsBinaryString(file)
  }

  const handleYearChange = (e) => {
    const value = e.target.value
    // Validar que el año sea un número de 4 dígitos
    if (/^\d{0,4}$/.test(value)) {
      setYear(value)
    }
  }

  const handleUpload = () => {
    if (year.length !== 4) {
      toast.error('El año debe tener 4 dígitos', { position: 'bottom-right' })
      return
    }

    const dataToUpload = jsonData.map(row => ({
      ...row,
      anio: year,
      semestre: semester
    }))
    console.log('Data to upload:', dataToUpload)

    axiosinstance.post('Modulos/', dataToUpload)
      .then(response => {
        console.log('Data uploaded successfully:', response.data)
        updateModules()
        onClose()
        toast.success('Datos subidos exitosamente', { position: 'bottom-right' })
      })
      .catch(error => {
        console.error('Error uploading data:', error)
        toast.error('Ha ocurrido un error al subir el archivo. Por favor, intenta nuevamente.', { position: 'bottom-right' })
      })
  }

  const isFormValid = year.length === 4 && semester !== '' && fileSelected

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subir archivo Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant='danger'>{error}</Alert>}
        <input type='file' accept='.xlsx' onChange={handleFileChange} />
        <Form.Group controlId='formYear'>
          <Form.Label>Año</Form.Label>
          <Form.Control
            type='text'
            value={year}
            onChange={handleYearChange}
            placeholder='Ingrese el año (XXXX)'
          />
        </Form.Group>
        <Form.Group controlId='formSemester'>
          <Form.Label>Semestre</Form.Label>
          <Form.Control
            as='select'
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value=''>Seleccione el semestre</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Cerrar
        </Button>
        <Button variant='primary' onClick={handleUpload} disabled={!isFormValid}>
          Subir
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CsvUploadPopup
