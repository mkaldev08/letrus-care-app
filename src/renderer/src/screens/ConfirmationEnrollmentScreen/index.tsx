import React, { useCallback, useState } from 'react'
import { Sidebar } from '@renderer/components/Sidebar'
import { ConfirmationPanel } from '@renderer/components/ConfirmationPanel'
import { Header } from '@renderer/components/Header'
import { SearchStudent } from '@renderer/components/SearchStudent'
import { IStudent } from '@renderer/services/student'

export const ConfirmationEnrollmentScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null)
  const [resetSearchStudent, setResetSearchStudent] = useState(false)

  const handleStudentSelected = useCallback((student: IStudent | null) => {
    setSelectedStudent(student)
    setResetSearchStudent(false)
  }, [])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-auto p-4">
          <div className="w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-500">Reconfirmar Inscrição</h2>

            {!selectedStudent && (
              <SearchStudent
                onStudentSelect={handleStudentSelected}
                initialStudent={selectedStudent}
                resetSearchTrigger={resetSearchStudent}
              />
            )}
            {selectedStudent && <ConfirmationPanel resultInForm={selectedStudent} />}
          </div>
        </div>
      </div>
    </div>
  )
}
