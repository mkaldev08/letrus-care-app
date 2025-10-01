import React, { useEffect, useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { StudentSidebar } from '@renderer/components/StudentSidebar'
import { Header } from '@renderer/components/Header'
import { getSchoolYearsServiceAll, ISchoolYear } from '@renderer/services/school-year-service'
import { useCenter } from '@renderer/contexts/center-context'
import { PaidServicesTab } from './PaidServicesTab'
import { DuePaymentsTab } from './DuePaymentsTab'
import { useParams } from 'react-router'
import {
  getFinancialPlanForStudentService,
  IFinancialPlan
} from '@renderer/services/financial-plan-services'

export const StudentPayments: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { center } = useCenter()
  const [schoolYears, setschoolYears] = useState<ISchoolYear[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'paidServices' | 'duePayments'>('paidServices')
  const [financialPlansPaid, setFinancialPlansPaid] = useState<IFinancialPlan[]>([])
  const [financialPlansDue, setFinancialPlansDue] = useState<IFinancialPlan[]>([])

  const { enrollmentId } = useParams<string>()

  async function getSchoolYears(): Promise<void> {
    try {
      const tmp = await getSchoolYearsServiceAll(center?._id as string)

      setschoolYears(tmp)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchFinancialPlan(
    centerId: string,
    enrollmentId: string,
    queryConfig: { status: string; schoolYear: string }
  ): Promise<void> {
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
  }

  useEffect(() => {
    getSchoolYears()
  }, [center])

  useEffect(() => {
    const schoolYear = schoolYears.find((year) => year.isCurrent)
    if (center?._id && enrollmentId && schoolYear?._id) {
      fetchFinancialPlan(center._id, enrollmentId, {
        status: 'paid',
        schoolYear: schoolYear._id
      })
    }
  }, [center, enrollmentId, schoolYears])

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
