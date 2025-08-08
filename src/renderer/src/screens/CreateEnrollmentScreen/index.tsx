import React, { useState } from 'react'
import { Sidebar } from '@renderer/components/Sidebar'
import { Panel } from '@renderer/components/Panel'
import { Header } from '@renderer/components/Header'

export const CreateEnrollmentScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-auto p-4">
          <div className="w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-500">Criar Inscrições</h2>
            <Panel />
          </div>
        </div>
      </div>
    </div>
  )
}
