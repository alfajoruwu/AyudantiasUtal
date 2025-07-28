import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ModalObservaciones = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  nombreModulo,
  observacionesActuales = '',
  isLoading 
}) => {
  const [observaciones, setObservaciones] = useState(observacionesActuales)

  if (!isOpen) return null

  const handleConfirmar = () => {
    if (observaciones.trim()) {
      onConfirm(observaciones.trim())
    }
  }

  const handleCerrar = () => {
    setObservaciones(observacionesActuales)
    onClose()
  }

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">
              <i className="bi bi-chat-square-text me-2"></i>
              Agregar Observaciones
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleCerrar}
              disabled={isLoading}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="alert alert-info">
              <strong>Módulo:</strong> {nombreModulo}
            </div>
            
            <div className="mb-3">
              <label htmlFor="observaciones" className="form-label">
                <strong>Observaciones sobre la oferta:</strong>
              </label>
              <textarea
                id="observaciones"
                className="form-control"
                rows="6"
                placeholder="Ejemplo: Es importante que el ayudante tenga conocimientos en programación avanzada. Se requiere disponibilidad los días martes y jueves..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                disabled={isLoading}
                maxLength="500"
              />
              <div className="form-text">
                {observaciones.length}/500 caracteres
              </div>
            </div>
            
            <div className="alert alert-warning">
              <h6 className="mb-2">Al guardar estas observaciones:</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <i className="bi bi-save text-success me-2"></i>
                  Se guardarán en el sistema
                </li>
                <li>
                  <i className="bi bi-envelope text-primary me-2"></i>
                  Se enviará un correo al <strong>coordinador</strong> notificando los cambios
                </li>
                <li>
                  <i className="bi bi-envelope-check text-success me-2"></i>
                  Recibirá un correo de <strong>confirmación</strong>
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
              className="btn btn-info" 
              onClick={handleConfirmar}
              disabled={isLoading || !observaciones.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Guardar Observaciones
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalObservaciones
