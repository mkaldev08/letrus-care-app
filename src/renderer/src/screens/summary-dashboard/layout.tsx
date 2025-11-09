import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-screen mx-auto w-full lg:w-11/12">
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-auto p-4">
          <button
            onClick={() => navigate(-1)}
            title="Voltar a tela anterior"
            className="bg-orange-700 text-white p-2 flex items-center gap-2 rounded mb-2 hover:opacity-80 transition-all"
          >
            <ChevronLeft /> voltar
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}
