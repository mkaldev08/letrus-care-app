import React, { useEffect, useState } from 'react'

import { Sidebar } from '@renderer/components/Sidebar'
import { Modal } from '@renderer/components/Modal'
import { useCenter } from '@renderer/contexts/center-context'

import { getSchoolYearsService, ISchoolYear } from '@renderer/services/school-year-service'
import { formatDate } from '@renderer/utils/format'

import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import Pagination from '@renderer/components/Pagination'
import { ContentLoader } from '@renderer/components/ContentLoader'
import { ModalCreateSchoolYear } from './ModalCreateSchoolYear'

export const SchoolYearScreen: React.FC = () => {
  const { center } = useCenter()

  const [schoolYears, setSchoolYears] = useState<ISchoolYear[] | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (): void => setIsModalOpen(true)
  const closeModal = (): void => setIsModalOpen(false)

  async function getSchoolYears(page: number): Promise<void> {
    const data = await getSchoolYearsService(page, center?._id as string)
    setSchoolYears(data?.schoolYears)
    setTotalPages(data?.totalSchoolYear)
    setIsLoaderSchoolYearList(false)
  }

  useEffect(() => {
    getSchoolYears(currentPage)
  }, [isModalOpen, currentPage])

  const [isLoaderSchoolYearList, setIsLoaderSchoolYearList] = useState(true)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-auto pt-4">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">Ano Lectivo</h2>
            <article className="text-zinc-600 mt-3">
              <p>Gere o periodo de actividade do centro {center?.name}</p>
            </article>

            <button
              onClick={openModal}
              className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all mt-4 self-end"
            >
              Novo Ano Letivo
            </button>
            {/* Tabela */}
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border-collapse block md:table">
                <thead className="block md:table-header-group">
                  <tr className="block border border-zinc-700 md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                    <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                      Designação
                    </th>
                    <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                      Data de Inicio
                    </th>
                    <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                      Data de Término
                    </th>
                    <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="block md:table-row-group">
                  {isLoaderSchoolYearList === false && schoolYears ? (
                    schoolYears.map((row, index) => (
                      <tr
                        key={index}
                        className="bg-zinc-800 border border-zinc-700 block md:table-row"
                      >
                        <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                          {row?.description}
                        </td>
                        <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                          {formatDate(row?.startDate)}
                        </td>
                        <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                          {formatDate(row?.endDate)}
                        </td>
                        <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                          {row?.isCurrent ? 'Actual' : 'Encerrado'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>
                        <ContentLoader />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <h2 className="text-3xl">Definir Ano Letivo</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <ModalCreateSchoolYear onClose={closeModal} />
        </div>
      </Modal>
    </div>
  )
}
