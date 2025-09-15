import { BadgeEuro, PersonStanding, SkipBack } from 'lucide-react'
import React from 'react'
import renderMenuItem from '../shared/render-Menu-Item'

interface SidebarProps {
  isOpen: boolean
  enrollmentId: string
}

export const StudentSidebar: React.FC<SidebarProps> = ({ isOpen, enrollmentId }) => {
  return (
    <div
      className={`bg-transparent flex flex-col justify-between h-full gap-3 p-3 border-r border-zinc-700 transition-all  ${
        isOpen ? 'w-[216px]' : 'w-[64px] items-center'
      }`}
    >
      <ul className="flex flex-col gap-4">
        {renderMenuItem(<PersonStanding />, 'Aluno', `/student/${enrollmentId}/show`, isOpen)}
        {renderMenuItem(<BadgeEuro />, 'Pagamentos', `/student/${enrollmentId}/payment`, isOpen)}
        {renderMenuItem(<SkipBack />, 'Voltar/p Inscrições', '/enrollment', isOpen)}
      </ul>
    </div>
  )
}
