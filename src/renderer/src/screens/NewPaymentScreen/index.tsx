import React, { useEffect, useState, useCallback } from 'react'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'

import { getStudentById, IStudent } from '@renderer/services/student'

import { PaymentForm } from './PaymentForm'
import { useLocation } from 'react-router'
import { SearchStudent } from '@renderer/components/SearchStudent'

export const NewPaymentScreen: React.FC = () => {
  const location = useLocation()
  const enrollmentFromState = location.state?.studentEnrollment.enrollment || null

  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null)
  const [resetSearchStudent, setResetSearchStudent] = useState(false)

  // Função para lidar com a seleção de um aluno vindo de SearchStudent
  const handleStudentSelected = useCallback((student: IStudent | null) => {
    setSelectedStudent(student)
    setResetSearchStudent(false) // Reseta o gatilho após a seleção
  }, [])

  useEffect(() => {
    async function getStudentInEnrollment(id: string): Promise<void> {
      if (id) {
        const studentFromState = await getStudentById(id)
        if (studentFromState) {
          setSelectedStudent(studentFromState) // Define o aluno selecionado no estado do pai
        }
      }
    }

    if (enrollmentFromState?.studentId) {
      getStudentInEnrollment(enrollmentFromState.studentId)
    }
  }, [enrollmentFromState])

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">Novo Pagamento</h2>
            <article className="text-zinc-600 mt-3 mb-5">
              <p>Regularize o Pagamento</p>
            </article>
          </div>

          {!selectedStudent && (
            <SearchStudent
              onStudentSelect={handleStudentSelected}
              initialStudent={selectedStudent}
              resetSearchTrigger={resetSearchStudent}
            />
          )}

          {selectedStudent && (
            <div className="flex flex-col bg-zinc-800 w-11/12 mx-auto p-4 rounded-lg shadow-md transition-all">
              <PaymentForm resultsInForm={selectedStudent} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
