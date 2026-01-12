import React, { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'
import { SearchStudent } from '@renderer/components/SearchStudent'

import { PaymentForm } from './PaymentForm'

import { getStudentById, IStudent } from '@renderer/services/student'

export const NewPaymentScreen: React.FC = () => {
  const location = useLocation()

  /**
   * enrollment vem do:
   * - formulário de inscrição
   * - formulário de confirmação
   */
  const enrollmentFromState = location.state?.enrollment ?? null

  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [resetSearchStudent, setResetSearchStudent] = useState(false)

  /**
   * Seleção manual via componente SearchStudent
   */
  const handleStudentSelected = useCallback((student: IStudent | null) => {
    setSelectedStudent(student)
    setResetSearchStudent(false)
  }, [])

  /**
   * Caso venha de inscrição ou reconfirmação,
   * carrega automaticamente o aluno associado à matrícula
   */
  useEffect(() => {
    async function loadStudentFromEnrollment(studentId?: string): Promise<void> {
      if (!studentId) return

      const student = await getStudentById(studentId)
      if (student) {
        setSelectedStudent(student)
      }
    }

    if (enrollmentFromState?.studentId) {
      loadStudentFromEnrollment(enrollmentFromState.studentId)
    }
  }, [enrollmentFromState])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-1 pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">Novo Pagamento</h2>
            <article className="text-zinc-600 mt-3 mb-5">
              <p>Regularize o pagamento do aluno</p>
            </article>
          </div>

          {/* Pesquisa manual só aparece se não houver aluno selecionado */}
          {!selectedStudent && (
            <SearchStudent
              onStudentSelect={handleStudentSelected}
              initialStudent={null}
              resetSearchTrigger={resetSearchStudent}
            />
          )}

          {/* Formulário de pagamento */}
          {selectedStudent && (
            <div className="flex flex-col bg-zinc-800 w-11/12 mx-auto p-4 rounded-lg shadow-md transition-all">
              <PaymentForm
                resultsInForm={selectedStudent}
                enrollmentDataFromForm={enrollmentFromState}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
