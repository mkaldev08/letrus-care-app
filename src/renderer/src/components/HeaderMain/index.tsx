import React, { useState } from 'react'
import { LogoLectrus } from '../LogoLectrus'
import { Menu, UserRound, School } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@renderer/contexts/auth-context'
import { useCenter } from '@renderer/contexts/center-context'
import Swal from 'sweetalert2'

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { center } = useCenter()
  const navigate = useNavigate()
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          className="inline-flex justify-center w-full rounded-md px-4 py-2 text-sm font-medium"
          aria-expanded="true"
          aria-haspopup="true"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => {
            setTimeout(() => setIsOpen(false), 1800) //atrasa a  saida simulando que ele espera o usuario clicar
          }}
          title={center?.name}
          onDoubleClick={() => {
            navigate('/centers/show')
          }}
        >
          <School />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5 text-white"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <Link
              to="/courses"
              className="text-zinc-100 block px-4 py-2 text-sm hover:bg-zinc-900 hover:transition-all"
              role="menuitem"
            >
              Cursos
            </Link>
            <Link
              to="/grades"
              className="text-zinc-100 block px-4 py-2 text-sm hover:bg-zinc-900 hover:transition-all"
              role="menuitem"
            >
              Níveis
            </Link>
            <Link
              to="/teachers"
              className="text-zinc-100 block px-4 py-2 text-sm hover:bg-zinc-900 hover:transition-all"
              role="menuitem"
            >
              Professores
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

const DropdownUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const { logout, user } = useAuth()

  function handleLogout(): void {
    Swal.fire({
      title: 'Terminar Sessão?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        confirmButton: 'bg-red-600'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout()
        navigate('/login')
      }
    })
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          className="inline-flex justify-center w-full rounded-md px-4 py-2 text-sm font-medium"
          aria-expanded="true"
          aria-haspopup="true"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => {
            setTimeout(() => setIsOpen(false), 1800) //atrasa a  saida simulando que ele espera o usuario clicar
          }}
          title={user?.username}
        >
          <UserRound />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5 text-white"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <Link
              to="/profile"
              className="text-zinc-100 block px-4 py-2 text-sm hover:bg-zinc-900 hover:transition-all"
              role="menuitem"
            >
              Perfil
            </Link>
            <Link
              to="/settings"
              className="text-zinc-100 block px-4 py-2 text-sm hover:bg-zinc-900 hover:transition-all"
              role="menuitem"
            >
              Configurações
            </Link>
            <Link
              to={'#'}
              className="text-zinc-100 block px-4 py-2 text-sm hover:bg-zinc-900 hover:transition-all cursor-pointer"
              role="menuitem"
              onClick={() => {
                handleLogout()
              }}
            >
              Sair
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

interface HeaderProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

export const HeaderMain: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className="flex items-center justify-between fixed top-0 left-0 right-0 h-[62px] lg:h-[70px] bg-gray-850 border border-transparent border-b-zinc-700 lg:pr-8 bg-gray-850 border-b z-50 px-4 bg-zinc-900">
      <section className="flex items-center justify-between gap-4">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu />
        </button>
        <LogoLectrus sizeFont="text-xl" sizeImage={28} />
      </section>
      <section className="flex items-center justify-between gap-4">
        <Dropdown />
        <DropdownUser />
      </section>
    </div>
  )
}
