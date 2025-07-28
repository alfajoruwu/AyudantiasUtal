import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ModalSolicitudHoras = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  nombreModulo,
  horasActuales,
  isLoading 
}) => {
  const [solicitudHoras, setSolicitudHoras] = useState('')

  if (!isOpen) return null

  const handleConfirmar = () => {
    if (solicitudHoras.trim()) {
      onConfirm(solicitudHoras.trim())
    }
  }

  const handleCerrar = () => {
    setSolicitudHoras('')
    onClose()
  }

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              <i className="bi bi-clock me-2"></i>
              Solicitar Horas Adicionales
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCerrar}
              disabled={isLoading}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="alert alert-info">
              <strong>Módulo:</strong> {nombreModulo}<br />
              <strong>Horas actuales:</strong> {horasActuales} horas
            </div>
            
            <div className="mb-3">
              <label htmlFor="solicitudHoras" className="form-label">
                <strong>Describa su solicitud de horas adicionales:</strong>
              </label>
              <textarea
                id="solicitudHoras"
                className="form-control"
                rows="6"
                placeholder="Ejemplo: Solicito 2 horas adicionales debido al aumento en la matrícula del curso. Las horas adicionales serían utilizadas para..."
                value={solicitudHoras}
                onChange={(e) => setSolicitudHoras(e.target.value)}
                disabled={isLoading}
                maxLength="250"
              />
              <div className="form-text">
                {solicitudHoras.length}/250 caracteres
              </div>
            </div>
            
            <div className="alert alert-warning">
              <h6 className="mb-2">Al enviar esta solicitud:</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <i className="bi bi-envelope text-primary me-2"></i>
                  Se enviará un correo al <strong>coordinador</strong> con los detalles
                </li>
                <li>
                  <i className="bi bi-envelope-check text-success me-2"></i>
                  Recibirá un correo de <strong>confirmación</strong>
                </li>
                <li>
                  <i className="bi bi-clock-history text-info me-2"></i>
                  El coordinador revisará su solicitud a la brevedad
                </li>
              </ul>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleCerrar}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn btn-warning" 
              onClick={handleConfirmar}
              disabled={isLoading || !solicitudHoras.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalSolicitudHoras
