import React, { useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { StudentSidebar } from '@renderer/components/StudentSidebar'
import { Header } from '@renderer/components/Header'

export const StudentPayments: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <StudentSidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl text-zinc-400">Pagamentos</h2>
                <p className="text-zinc-600 mt-1">Mantém controlo das contribuições dos alunos</p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
