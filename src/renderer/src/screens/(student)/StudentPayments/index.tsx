import React, { useEffect, useMemo, useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { StudentSidebar } from '@renderer/components/StudentSidebar'
import { Header } from '@renderer/components/Header'
import { useCenter } from '@renderer/contexts/center-context'
import { PaidServicesTab } from './PaidServicesTab'
import { DuePaymentsTab } from './DuePaymentsTab'
import { useParams } from 'react-router'
import { useSchoolYearsQuery } from '@renderer/hooks/queries/useSchoolYearQueries'
import { useFinancialPlansQuery } from '@renderer/hooks/queries/useFinancialPlanQueries'
import { PageHeader } from '@renderer/components/shared/PageHeader'

export const StudentPayments: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { center } = useCenter()
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'paidServices' | 'duePayments'>('paidServices')

  const { enrollmentId } = useParams<string>()

  const { data: schoolYears = [], isLoading: isSchoolYearsLoading } = useSchoolYearsQuery(
    center?._id
  )

  const { data: paidPlans = [], isLoading: isPaidLoading } = useFinancialPlansQuery(
    center?._id,
    enrollmentId,
    selectedYear,
    'paid'
  )

  const { data: allPlans = [], isLoading: isAllLoading } = useFinancialPlansQuery(
    center?._id,
    enrollmentId,
    selectedYear,
    'all'
  )

  const duePlans = useMemo(() => {
    return allPlans.filter((plan) => plan.status !== 'paid')
  }, [allPlans])

  useEffect(() => {
    if (schoolYears.length > 0 && !selectedYear) {
      const currentYear = schoolYears.find((year) => year.isCurrent)
      const yearId = currentYear?._id || schoolYears[0]?._id
      if (yearId) {
        setSelectedYear(yearId)
      }
    }
  }, [schoolYears, selectedYear])

  const isLoadingTabs = isSchoolYearsLoading || isPaidLoading || isAllLoading
  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <StudentSidebar isOpen={isSidebarOpen} enrollmentId={enrollmentId || ''} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <PageHeader
              title="Pagamentos"
              description="Mantém controlo das contribuições dos alunos"
              showAction={false}
            />
            {/* FIXME: Remember to study ways to change data according to selectedYear on client and server (API) side*/}
            <section className="flex flex-col gap-4 my-6">
              <div className="flex gap-4 items-center">
                <label htmlFor="school-year">Ano Letivo</label>
                <select
                  id="school-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-[10%] h-12 p-3 bg-zinc-950 rounded-md text-gray-100"
                  disabled={isSchoolYearsLoading}
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
                    <PaidServicesTab data={paidPlans} isLoading={isLoadingTabs} />
                  ) : (
                    <DuePaymentsTab data={duePlans} isLoading={isLoadingTabs} />
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
