import React, { useEffect, useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'
import { getFromStorage } from '@renderer/utils/storage'
import { IAuth } from '@renderer/services/user'

export const UserProfile: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<IAuth | null>()

  useEffect(() => {
    const userStoraged = getFromStorage('user') as IAuth
    setUser(userStoraged)
  }, [])
  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-auto pt-4">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">Perfil</h2>
            <main className="flex-1">
              <div className="mt-10 flex justify-between gap-8">
                <section className="flex items-center justify-center flex-col">
                  <figure className="flex items-center justify-center flex-col w-36">
                    <img src="/avatars/image.png" alt="Imagem do Autor do App" className="w-full" />
                    <figcaption className="rounded-md bg-orange-700 mt-2 flex items-center justify-center">
                      <button
                        type="button"
                        id="btn-upload-img"
                        className="flex-1 rounded-md bg-orange-700 p-1"
                      >
                        carregar imagem
                      </button>
                      <input type="file" accept="image/*;" className="hidden" />
                    </figcaption>
                  </figure>

                  <article className="w-full flex flex-col gap-4 mt-8">
                    <input
                      placeholder="Nova Senha"
                      className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                      type="password"
                    />
                    <input
                      placeholder="Confirmar Senha"
                      className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                      type="password"
                    />

                    <button
                      type="button"
                      id="btn-upload-img"
                      className="flex-1 rounded-md text-orange-700 bg-zinc-300 w-full h-12 p-3"
                    >
                      Alterar Senha
                    </button>
                  </article>
                </section>
                <section className="flex flex-1 flex-col">
                  <span>Detalhes da Conta</span>

                  <div className="flex items-center justify-between my-4 gap-4">
                    <div className="flex flex-col gap-4 w-1/2">
                      <label htmlFor="Função">
                        Nome Completo <span className="text-orange-700">*</span>
                      </label>
                      <input
                        disabled
                        id="Nome"
                        placeholder="Nome Completo"
                        type="text"
                        className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2">
                      <label htmlFor="username">
                        Username <span className="text-orange-700">*</span>
                      </label>
                      <input
                        id="username"
                        defaultValue={user?.username}
                        type="text"
                        className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between my-4 gap-4">
                    <div className="flex flex-col gap-4 w-1/2">
                      <label htmlFor="username">
                        Telefone <span className="text-orange-700">*</span>
                      </label>
                      <input
                        id="Telefone"
                        defaultValue={user?.phoneNumber}
                        type="text"
                        className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2">
                      <label htmlFor="Nome Completo">
                        Função <span className="text-orange-700">*</span>
                      </label>
                      <input
                        disabled
                        defaultValue={user?.role}
                        placeholder="Função"
                        type="text"
                        className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between my-4 gap-4">
                    <div className="flex flex-col gap-4 w-full">
                      <button
                        type="button"
                        id="btn-upload-img"
                        className="flex-1 rounded-md text-zinc-200 bg-orange-800 w-full h-12 p-3"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
