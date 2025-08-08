import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'
import { Construction } from 'lucide-react'
import React, { useState } from 'react'

// import { Container } from './styles';
export const SettingsScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-auto pt-4">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">Configurações Gerais</h2>
            <main className="flex-1">
              <p className="flex flex-col justify-center items-center w-full h-full text-3xl text-zinc-400">
                <Construction size={140} />
                Tela em Construção
              </p>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
