import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ModalConfirmacion = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  nombrePostulante, 
  nombreModulo,
  isLoading 
}) => {
  if (!isOpen) return null

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-check me-2"></i>
              Confirmar Selección de Ayudante
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="text-center mb-4">
              <div className="alert alert-info">
                <strong>Candidato seleccionado:</strong><br />
                <span className="h6">{nombrePostulante}</span><br />
                <small className="text-muted">Para el módulo: {nombreModulo}</small>
              </div>
            </div>
            
            <h6 className="mb-3">Al confirmar esta selección:</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Se seleccionará como ayudante oficial
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope text-primary me-2"></i>
                Se enviará correo de <strong>confirmación</strong> al estudiante seleccionado
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-dash text-secondary me-2"></i>
                Se enviará correo de <strong>notificación</strong> a los demás postulantes
              </li>
            </ul>
            
            <div className="alert alert-warning mt-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Nota:</strong> Esta acción no se puede deshacer fácilmente. 
              Los correos se enviarán inmediatamente.
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  Confirmar y Enviar Correos
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion
