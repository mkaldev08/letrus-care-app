import React, { useState } from 'react'
import { Sidebar } from '@renderer/components/Sidebar'
import { Header } from '@renderer/components/Header'
import { Footer } from '@renderer/components/Footer'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { useDashboard } from '@renderer/hooks/useDashboard'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router'

// Tipos para as estatísticas do dashboard (discriminated union por label)
type StatisticItem =
  | { label: 'Alunos'; value: number }
  | { label: 'Turmas'; value: number }
  | { label: 'Professores'; value: number }
  | { label: 'Pagamento Diário (kz)'; value: number }
  | { label: 'Faltas Diárias'; value: number }
  | { label: 'Inscrições Diária'; value: number }
  | { label: 'Propinas Atrasadas'; value: number }
  | { label: 'Inscrições não Concluidas'; value: number }

export const HomeScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const {
    totalActiveClassRoom,
    totalActiveStudent,
    totalDailyEnrollment,
    totalIncompleteEnrollment,
    totalOverdueFee,
    totalDailyPayment,
    totalActiveTeachers,
    totalDailyAbsent,
    enrollmentGrowth,
    paymentGrowthTopFive,
    isLoading,
    error
  } = useDashboard()

  const statisticData: StatisticItem[] = [
    { label: 'Alunos', value: totalActiveStudent },
    { label: 'Turmas', value: totalActiveClassRoom },
    { label: 'Professores', value: totalActiveTeachers },
    { label: 'Pagamento Diário (kz)', value: totalDailyPayment },
    { label: 'Faltas Diárias', value: totalDailyAbsent },
    { label: 'Inscrições Diária', value: totalDailyEnrollment },
    { label: 'Propinas Atrasadas', value: totalOverdueFee },
    { label: 'Inscrições não Concluidas', value: totalIncompleteEnrollment }
  ]

  type StatisticLabel = StatisticItem['label']

  function handleNavigateByLabel(label: StatisticLabel): void {
    switch (label) {
      case 'Propinas Atrasadas':
        navigate('/home/overdue-payments')
        break
      case 'Pagamento Diário (kz)':
        alert('Funcionalidade em desenvolvimento')
        break
      case 'Alunos':
        alert('Funcionalidade em desenvolvimento')
        break
      case 'Faltas Diárias':
        alert('Funcionalidade em desenvolvimento')
        break
      case 'Inscrições Diária':
        alert('Funcionalidade em desenvolvimento')
        break
      case 'Inscrições não Concluidas':
        alert('Funcionalidade em desenvolvimento')
        break
      case 'Professores':
        alert('Funcionalidade em desenvolvimento')
        break
      case 'Turmas':
        alert('Funcionalidade em desenvolvimento')
        break
      default:
        break
    }
  }
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 pt-[62px] lg:pt-[70px]">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-auto p-4">
            <h2 className="text-3xl text-zinc-400 mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {isLoading && (
                <div className="col-span-4 flex items-center justify-center p-8">
                  <TailSpin color="#c2410c" ariaLabel="loading-dashboard" />
                </div>
              )}

              {error && (
                <div className="col-span-4 p-4 text-center rounded bg-red-500/10 border border-red-500/20">
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              )}

              {!isLoading &&
                !error &&
                statisticData.map((item, index) => (
                  <button
                    key={index}
                    className="bg-zinc-800 p-4 rounded-lg shadow-md text-center hover:opacity-80 hover:bg-zinc-700 transition-all h-36 flex flex-col items-center justify-center w-full focus:outline-none focus:ring-2 focus:ring-orange-600"
                    onClick={() => handleNavigateByLabel(item.label)}
                    aria-label={`Ver detalhes de ${item.label}: ${item.value}`}
                  >
                    <p className="text-zinc-400 text-xl">{item.label}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </button>
                ))}
            </div>
            <div className="flex items-center justify-between gap-4">
              {isLoading && (
                <div className="w-full flex flex-1 items-center justify-center p-12">
                  <TailSpin color="#c2410c" ariaLabel="loading-charts" />
                </div>
              )}

              {!isLoading && !error && (
                <>
                  <article className="w-1/2 bg-zinc-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Crescimento de Inscrições</h2>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        data={enrollmentGrowth}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" style={{ stroke: '#b3b3b35c' }} />
                        <XAxis dataKey="month" style={{ color: '#fff' }} />
                        <YAxis dataKey="enrollments" allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#121314',
                            border: 'none',
                            color: '#fff'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="enrollments"
                          stroke="#c2410c"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </article>
                  <article className="w-1/2 bg-zinc-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4 ">Pagamentos Top 5</h2>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart width={150} height={40} data={paymentGrowthTopFive}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis dataKey="totalAmount" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#121314',
                            border: 'none',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="totalAmount" fill="#c2410c" />
                      </BarChart>
                    </ResponsiveContainer>
                  </article>
                </>
              )}
            </div>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  )
}
