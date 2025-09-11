import { BellDot, BookOpenCheck, CircleHelp, HandCoins, Home, NotebookPen } from 'lucide-react'
import React from 'react'
import renderMenuItem from '../shared/render-Menu-Item'

interface SidebarProps {
  isOpen: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div
      className={`bg-transparent flex flex-col justify-between h-full gap-3 p-3 border-r border-zinc-700 transition-all  ${
        isOpen ? 'w-[216px]' : 'w-[64px] items-center'
      }`}
    >
      <ul className="flex flex-col gap-4">
        {renderMenuItem(<Home />, 'Home', '/home', isOpen)}
        {renderMenuItem(<NotebookPen />, 'Inscrição', '/enrollment', isOpen)}
        {renderMenuItem(<HandCoins />, 'Pagamentos', '/payments', isOpen)}
        {renderMenuItem(<BookOpenCheck />, 'Aulas e Presenças', '/classes', isOpen)}
      </ul>
      <ul className="flex flex-col gap-4">
        {renderMenuItem(<BellDot />, 'Notificações', '/notifications', isOpen)}
        {renderMenuItem(<CircleHelp />, 'Ajuda', '/help', isOpen)}
      </ul>
    </div>
  )
}
