import React from 'react'
import { Modal } from '../Modal'

interface SessionExpiredModalProps {
  isOpen: boolean
  onConfirm: () => void
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onConfirm}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Sessão Expirada</h2>
        <p className="mb-6">A sua sessão expirou. Por favor, faça login novamente.</p>
        <button
          onClick={onConfirm}
          className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-800 transition-colors"
        >
          Fazer Login
        </button>
      </div>
    </Modal>
  )
}
