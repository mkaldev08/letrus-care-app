import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'
import { Github, Info, Mail, Phone, Sparkles, User } from 'lucide-react'
import React, { useState } from 'react'

export const HelpScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 pt-[62px] lg:pt-[70px]">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-auto p-6">
            <div className="flex flex-col gap-3 mb-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-1 text-sm text-zinc-300">
                <Sparkles size={14} />
                Guia rápido
              </div>
              <h2 className="text-3xl text-zinc-400">Ajuda e Informações</h2>
              <p className="text-zinc-500 max-w-3xl">
                O Letrus Care centraliza a gestão do centro de alfabetização, reunindo alunos,
                turmas, pagamentos e indicadores em um único lugar para apoiar decisões rápidas e
                seguras.
              </p>
            </div>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Info size={18} />
                  <h3 className="text-lg font-semibold">Sobre o aplicativo</h3>
                </div>
                <p className="mt-3 text-zinc-400 leading-relaxed">
                  Painel integrado para acompanhar matrículas, frequência, pagamentos e a evolução
                  dos alunos, com foco em organização, transparência e uma melhor experiência no
                  atendimento.
                </p>
              </section>

              <section className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 text-zinc-300">
                  <User size={18} />
                  <h3 className="text-lg font-semibold">Criador</h3>
                </div>
                <p className="mt-3 text-zinc-400">Manuel Kalueka - Software Developer</p>
              </section>

              <section className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Mail size={18} />
                  <h3 className="text-lg font-semibold">Contacto para suporte</h3>
                </div>
                <div className="mt-4 flex flex-col gap-4 text-zinc-400">
                  <a
                    className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm hover:border-zinc-600"
                    href="mailto:pedrokalueca@gmail.com"
                  >
                    <Mail size={16} />
                    pedrokalueca@gmail.com
                  </a>
                  <a
                    className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm hover:border-zinc-600"
                    href="tel:+244933808187"
                  >
                    <Phone size={16} />
                    +244 933 808 187
                  </a>
                  <a
                    className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm hover:border-zinc-600"
                    href="https://github.com/mkaldev08"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Github size={16} />
                    github.com/mkaldev08
                  </a>
                </div>
              </section>

              <section className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Sparkles size={18} />
                  <h3 className="text-lg font-semibold">Outras funcionalidades</h3>
                </div>
                <ul className="mt-4 grid gap-3 text-zinc-400">
                  <li className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2">
                    Indicadores do centro e análise de desempenho
                  </li>
                  <li className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2">
                    Matrículas, turmas e acompanhamento acadêmico
                  </li>
                  <li className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2">
                    Pagamentos, recibos e planos financeiros
                  </li>
                  <li className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2">
                    Frequência e registros de presença
                  </li>
                  <li className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2">
                    Relatórios para apoio à tomada de decisões
                  </li>
                </ul>
              </section>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
