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

// const mockData = {
//   totalCenters: 5,
//   totalUsers: 120,
//   totalTeachers: 25,
//   totalStudents: 300,
//   studentGrowth: [
//     { month: 'Jan', students: 200 },
//     { month: 'Feb', students: 220 },
//     { month: 'Mar', students: 250 },
//     { month: 'Apr', students: 270 },
//     { month: 'May', students: 300 }
//   ]
// }
// const data = [
//   {
//     name: 'Mes A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400
//   },
//   {
//     name: 'Mes B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210
//   },
//   {
//     name: 'Mes C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290
//   },
//   {
//     name: 'Mes D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000
//   },
//   {
//     name: 'Mes E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181
//   }
// ]

export const HomeScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const {
    totalActiveClassRoom,
    totalActiveStudent,
    totalDailyEnrollment,
    totalIncompleteEnrollment,
    totalOverdueFee,
    totalDailyPayment,
    totalActiveTeachers,
    totalDailyAbsent,
    studentGrowth,
    paymentGrowthTopFive,
    isLoading,
    error
  } = useDashboard()
  const statisticData = [
    { label: 'Alunos', value: totalActiveStudent },
    { label: 'Turmas', value: totalActiveClassRoom },
    { label: 'Professores', value: totalActiveTeachers },
    { label: 'Pagamento Diário (kz)', value: totalDailyPayment },
    { label: 'Faltas Diárias', value: totalDailyAbsent },
    { label: 'Inscrições Diária', value: totalDailyEnrollment },
    { label: 'Propinas Atrasadas', value: totalOverdueFee },
    { label: 'Inscrições não Concluidas', value: totalIncompleteEnrollment }
  ]
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
              {!isLoading && error && <p className="text-red-500">{error}</p>}
              {!isLoading && !error ? (
                statisticData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 p-4 rounded-lg shadow-md text-center hover:opacity-80 hover:cursor-pointer transition-all h-36 flex flex-col items-center justify-center"
                  >
                    <p className="text-zinc-400 text-xl">{item.label}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <TailSpin color="#c2410c" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              {!isLoading && error && <p className="text-red-500">{error}</p>}
              {!isLoading && !error ? (
                <>
                  <article className="w-1/2 bg-zinc-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Crescimento de Alunos</h2>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        data={studentGrowth}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" style={{ stroke: '#b3b3b35c' }} />
                        <XAxis dataKey="month" style={{ color: '#fff' }} />
                        <YAxis dataKey="students" allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#121314',
                            border: 'none',
                            color: '#fff'
                          }}
                        />
                        <Line type="monotone" dataKey="students" stroke="#c2410c" strokeWidth={2} />
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
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <TailSpin color="#c2410c" />
                </div>
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
