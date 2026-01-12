import React, { useEffect, useState, useCallback } from 'react'
import { Footer } from '@renderer/components/Footer'
import { StudentSidebar } from '@renderer/components/StudentSidebar'
import { Header } from '@renderer/components/Header'
import { useCenter } from '@renderer/contexts/center-context'
import { PaidServicesTab } from './PaidServicesTab'
import { DuePaymentsTab } from './DuePaymentsTab'
import { useParams } from 'react-router'
import {
  getFinancialPlanForStudentService,
  IFinancialPlanToShow
} from '@renderer/services/financial-plan-services'
import { useSchoolYear } from '@renderer/contexts/school-year-context'

export const StudentPayments: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { center } = useCenter()
  const { schoolYears, fetchAllSchoolYears } = useSchoolYear()
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'paidServices' | 'duePayments'>('paidServices')
  const [financialPlansPaid, setFinancialPlansPaid] = useState<IFinancialPlanToShow[]>([])
  const [financialPlansDue, setFinancialPlansDue] = useState<IFinancialPlanToShow[]>([])

  const { enrollmentId } = useParams<string>()

  // Memoiza getSchoolYears para evitar recriação
  const getSchoolYears = useCallback(async (): Promise<void> => {
    try {
      await fetchAllSchoolYears(String(center?._id))
    } catch (error) {
      console.log(error)
    }
  }, [center])

  // Memoiza fetchFinancialPlan para evitar recriação
  const fetchFinancialPlan = useCallback(
    async (
      centerId: string,
      enrollmentId: string,
      queryConfig: { status: string; schoolYear: string }
    ): Promise<void> => {
      try {
        const [financialPlansPaid, financialPlansDue] = await Promise.all([
          getFinancialPlanForStudentService(centerId, enrollmentId, {
            status: 'paid',
            schoolYear: queryConfig.schoolYear
          }),
          getFinancialPlanForStudentService(centerId, enrollmentId, {
            status: 'all', // informe qualquer estado que não seja 'paid'
            schoolYear: queryConfig.schoolYear
          })
        ])

        setFinancialPlansPaid(financialPlansPaid)
        setFinancialPlansDue(financialPlansDue)
      } catch (error) {
        console.log(error)
      }
    },
    [center?._id, enrollmentId, selectedYear]
  )

  // Busca anos letivos apenas uma vez ao montar
  useEffect(() => {
    getSchoolYears()
  }, [center?._id])

  // Inicializa selectedYear com o ano atual quando schoolYears carrega
  useEffect(() => {
    if (schoolYears.length > 0 && !selectedYear) {
      const currentYear = schoolYears.find((year) => year.isCurrent)
      const yearId = currentYear?._id || schoolYears[0]?._id
      if (yearId) {
        setSelectedYear(yearId)
      }
    }
  }, [])

  // Busca planos financeiros quando muda enrollmentId, selectedYear ou center
  useEffect(() => {
    if (center?._id && enrollmentId && selectedYear) {
      fetchFinancialPlan(String(center?._id), enrollmentId, {
        status: 'paid',
        schoolYear: selectedYear
      })
    }
  }, [center?._id, enrollmentId, selectedYear])

  //FIXME: ajustar os useEffect para evitar chamadas desnecessárias e infinitas
  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <StudentSidebar isOpen={isSidebarOpen} enrollmentId={enrollmentId || ''} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl text-zinc-400">Pagamentos</h2>
                <p className="text-zinc-600 mt-1">Mantém controlo das contribuições dos alunos</p>
              </div>
            </div>
            <section className="flex flex-col gap-4 my-6">
              <div className="flex gap-4 items-center">
                <label htmlFor="school-year">Ano Lectivo</label>
                <select
                  id="school-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-[10%] h-12 p-3 bg-zinc-950 rounded-md text-gray-100"
                >
                  {schoolYears.map((year) => (
                    <option key={year._id} value={year._id}>
                      {year.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border rounded border-zinc-800">
                <nav>
                  <ul className="flex items-center justify-around bg-zinc-800 h-12 gap-12">
                    <li
                      className={`text-zinc-400 flex-1 h-full flex items-center justify-center cursor-pointer bg-zinc-800 hover:brightness-150 ${activeTab === 'paidServices' && 'brightness-150'}`}
                      onClick={() => {
                        setActiveTab('paidServices')
                      }}
                    >
                      Serviços Pagos
                    </li>
                    <li
                      className={`text-zinc-400 flex-1 h-full flex items-center justify-center cursor-pointer bg-zinc-800 hover:brightness-150 ${activeTab === 'duePayments' && 'brightness-150'}`}
                      onClick={() => {
                        setActiveTab('duePayments')
                      }}
                    >
                      Dívidas
                    </li>
                  </ul>
                </nav>
                <div className="px-8 my-6">
                  {activeTab === 'paidServices' ? (
                    <PaidServicesTab data={financialPlansPaid} />
                  ) : (
                    <DuePaymentsTab data={financialPlansDue} />
                  )}
                </div>
              </div>
            </section>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
