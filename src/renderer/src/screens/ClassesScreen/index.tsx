import React, { useEffect, useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { ClassroomCarousel } from './ClassroomCarousel'
import { getClassesService, IResponseClass } from '@renderer/services/class-service'
import { useCenter } from '@renderer/contexts/center-context'
import { Plus } from 'lucide-react'
import { Modal } from '@renderer/components/Modal'
import { FormCreateClass } from './ClassroomCarousel/FormCreateClass'

export const ClassesScreen: React.FC = () => {
  const { center } = useCenter()
  const [classes, setClasses] = useState<IResponseClass[] | null>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModal = (): void => {
    setIsModalOpen(false)
    handleModalClose()
  }

  async function getClass(): Promise<void> {
    const tempClasses = await getClassesService(center?._id as string)
    setClasses(tempClasses)
  }
  useEffect(() => {
    getClass()
  }, [center?._id])

  const handleModalClose = async (): Promise<void> => {
    await getClass()
  }
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleUpdateClassrooms = async (): Promise<void> => {
    await getClass()
  }

  return (
    <div>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} />
          <div className="flex flex-col flex-1 overflow-auto pt-4">
            <div className="flex flex-col flex-1 w-11/12 mx-auto">
              <h2 className="text-3xl text-zinc-400">Turmas</h2>
              <div
                className="bg-orange-700 text-zinc-100 text-lg rounded shadow hover:shadow-lg cursor-pointer flex p-1 items-center justify-center self-end"
                onClick={() => setIsModalOpen(true)}
              >
                <p>
                  <Plus />
                </p>
                <p>Nova Turma</p>
              </div>
              <div className="mt-3">
                {classes?.filter((c) => c.period === 'morning')?.length !== 0 && classes && (
                  <>
                    <h3 className="text-2xl text-zinc-400 mb-2  max-w-20">Manhã</h3>
                    <ClassroomCarousel
                      onUpdateClassrooms={handleUpdateClassrooms}
                      classrooms={classes.filter((c) => c.period === 'morning')}
                    />
                  </>
                )}
              </div>
              <div className="mt-3">
                {classes?.filter((c) => c?.period === 'moon')?.length !== 0 && classes && (
                  <>
                    <h3 className="text-2xl text-zinc-400 mb-2  max-w-20">Tarde</h3>
                    <ClassroomCarousel
                      onUpdateClassrooms={handleUpdateClassrooms}
                      classrooms={classes.filter((c) => c?.period === 'moon')}
                    />
                  </>
                )}
              </div>
              <div className="mt-3">
                {classes?.filter((c) => c?.period === 'evening')?.length !== 0 && classes && (
                  <>
                    <h3 className="text-2xl text-zinc-400 mb-2  max-w-20">Noite</h3>
                    <ClassroomCarousel
                      onUpdateClassrooms={handleUpdateClassrooms}
                      classrooms={classes.filter((c) => c?.period === 'evening')}
                    />
                  </>
                )}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => closeModal()} isOpen={isModalOpen}>
          <h2 className="text-3xl">Criar Nova Turma</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <FormCreateClass onClose={() => closeModal()} />
        </Modal>
      )}
    </div>
  )
}
