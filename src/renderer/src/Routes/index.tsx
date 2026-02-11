import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import { useAuth } from '@renderer/contexts/auth-context'

import { HomeScreen } from '@renderer/screens/HomeScreen'
import { ClassesScreen } from '@renderer/screens/ClassesScreen'
import { EnrollmentScreen } from '@renderer/screens/EnrollmentScreen'
import { HelpScreen } from '@renderer/screens/HelpScreen'
import { NotificationScreen } from '@renderer/screens/NotificationScreen'
import { PaymentScreen } from '@renderer/screens/PaymentScreen'
import { NewPaymentScreen } from '@renderer/screens/NewPaymentScreen'
import { CreateEnrollmentScreen } from '@renderer/screens/CreateEnrollmentScreen'
import { CoursesScreen } from '@renderer/screens/CoursesScreen'
import { GradeScreen } from '@renderer/screens/GradeScreen'
import { TeacherScreen } from '@renderer/screens/TeacherScreen'
import { UserProfile } from '@renderer/screens/UserProfile'
import { CenterScreen } from '@renderer/screens/CenterScreen'
import { CreateCenterScreen } from '@renderer/screens/CreateCenterScreen'
import { LoginScreen } from '@renderer/screens/LoginScreen'
import { SignupScreen } from '@renderer/screens/SignupScreen'
import { getFromStorage } from '@renderer/utils/storage'
import { ShowClassScreen } from '@renderer/screens/ShowClassScreen'
import { ErrorScreen } from '@renderer/screens/ErrorScreen'
import { DashboardProvider } from '@renderer/hooks/useDashboard'
import { SettingsScreen } from '@renderer/screens/SettingsScreen'
import { RecoveryPasswordScreen } from '@renderer/screens/RecoveryPasswordScreen'
import { NewPassword } from '@renderer/screens/RecoveryPasswordScreen/NewPassword'
import { ConfirmationEnrollmentScreen } from '@renderer/screens/ConfirmationEnrollmentScreen'
import { SchoolYearScreen } from '@renderer/screens/SchoolYearScreen'
import { StudentPayments } from '@renderer/screens/(student)/StudentPayments'
import { EnrollmentAndStudentDetailsScreen } from '@renderer/screens/(student)/EnrollmentAndStudentDetailsScreen'
import { DailyPayment } from '@renderer/screens/summary-dashboard/daily-payment'
import { OverDuePayments } from '@renderer/screens/summary-dashboard/overdue-payments-students'
import { DailyPayments } from '@renderer/screens/summary-dashboard/daily-payments'
import { ActiveStudents } from '@renderer/screens/summary-dashboard/active-students'
import { DailyAbsences } from '@renderer/screens/summary-dashboard/daily-absences'
import { DailyEnrollments } from '@renderer/screens/summary-dashboard/daily-enrollments'
import { IncompleteEnrollments } from '@renderer/screens/summary-dashboard/incomplete-enrollments'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed } = useAuth()
  const user = getFromStorage('user')
  if (!signed && !user) return <Navigate to="/login" />
  return <>{children}</>
}

const CurrentIndexPage: React.FC = () => {
  const { signed } = useAuth()

  if (!signed) {
    return <LoginScreen />
  } else {
    return (
      <ProtectedRoute>
        <DashboardProvider>
          <HomeScreen />
        </DashboardProvider>
      </ProtectedRoute>
    )
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <CurrentIndexPage />,
    errorElement: <ErrorScreen />
  },
  {
    path: '/home',
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <HomeScreen />
            </DashboardProvider>
          </ProtectedRoute>
        )
      },
      {
        path: 'daily-payment',
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <DailyPayment />
            </DashboardProvider>
          </ProtectedRoute>
        )
      },
      {
        path: 'overdue-payments',
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <OverDuePayments />
            </DashboardProvider>
          </ProtectedRoute>
        )
      },
      {
        path: 'daily-payments',
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <DailyPayments />
            </DashboardProvider>
          </ProtectedRoute>
        )
      },
      {
        path: 'active-students',
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <ActiveStudents />
            </DashboardProvider>
          </ProtectedRoute>
        )
      },
      {
        path: 'daily-absences',
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <DailyAbsences />
            </DashboardProvider>
          </ProtectedRoute>
        )
      },
      {
        path: 'daily-enrollments',
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <DailyEnrollments />
            </DashboardProvider>
          </ProtectedRoute>
        )
      },
      {
        path: 'incomplete-enrollments',
        element: (
          <ProtectedRoute>
            <DashboardProvider>
              <IncompleteEnrollments />
            </DashboardProvider>
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/enrollment',
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <EnrollmentScreen />
          </ProtectedRoute>
        )
      },
      {
        path: 'new',
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <CreateEnrollmentScreen />
          </ProtectedRoute>
        )
      },
      {
        path: 'confirmation',
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <ConfirmationEnrollmentScreen />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/student/:enrollmentId',
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        path: 'show',
        element: (
          <ProtectedRoute>
            <EnrollmentAndStudentDetailsScreen />
          </ProtectedRoute>
        )
      },
      {
        path: 'payment',
        element: (
          <ProtectedRoute>
            <StudentPayments />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/classes',
    children: [
      {
        index: true,
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <ClassesScreen />
          </ProtectedRoute>
        )
      },
      {
        path: 'show/:iclass',
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <ShowClassScreen />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/payments',
    children: [
      {
        index: true,
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <PaymentScreen />
          </ProtectedRoute>
        )
      },
      {
        path: 'new',
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <NewPaymentScreen />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/notifications',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <NotificationScreen />
      </ProtectedRoute>
    )
  },
  {
    path: '/help',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <HelpScreen />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <CoursesScreen />
      </ProtectedRoute>
    )
  },
  {
    path: '/school-year',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <SchoolYearScreen />
      </ProtectedRoute>
    )
  },
  {
    path: '/grades',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <GradeScreen />
      </ProtectedRoute>
    )
  },
  {
    path: '/teachers',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <TeacherScreen />
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <SettingsScreen />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    errorElement: <ErrorScreen />,
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    )
  },
  {
    path: '/centers',
    children: [
      {
        path: 'show',
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <CenterScreen />
          </ProtectedRoute>
        )
      },
      {
        path: 'new',
        errorElement: <ErrorScreen />,
        element: (
          <ProtectedRoute>
            <CreateCenterScreen />
          </ProtectedRoute>
        )
      }
    ]
  },
  { path: '/login', element: <LoginScreen />, errorElement: <ErrorScreen /> },
  { path: '/signup', element: <SignupScreen />, errorElement: <ErrorScreen /> },
  { path: '/signup', element: <SignupScreen />, errorElement: <ErrorScreen /> },
  {
    path: '/recovery-password',
    element: <RecoveryPasswordScreen />,
    errorElement: <ErrorScreen />
  },
  {
    path: '/new-password',
    element: <NewPassword />,
    errorElement: <ErrorScreen />
  },

  { path: '*', element: <ErrorScreen /> }
])

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />
}
