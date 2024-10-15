import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CsvUploadPopup from './CsvUploadPopup'
import React, { useState } from 'react'
import './Ayudante.css'

function Buscador () {
  const [showPopup, setShowPopup] = useState(false)

  const handleOpenPopup = () => {
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }
  return (
    <Navbar className='justify-content-between'>
      <Row className='align-items-center'>
        <Col xs='auto'>
          <div>
            <Button variant='primary' className='color-btn' onClick={handleOpenPopup}>
              Subir CSV
            </Button>
            <CsvUploadPopup show={showPopup} onClose={handleClosePopup} />
          </div>
        </Col>
      </Row>
    </Navbar>
  )
}

export default Buscador
