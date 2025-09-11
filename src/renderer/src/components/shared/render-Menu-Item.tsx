import React, { ReactElement } from 'react'
import { NavLink } from 'react-router'

const renderMenuItem = (
  icon: React.ReactNode,
  label: string,
  path: string,
  isOpen: boolean
): ReactElement => (
  <li className="flex items-center relative gap-4 w-full h-12 px-3 rounded transition-all text-gray-300 text-sm hover:bg-zinc-700">
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 w-full h-full ${
          isActive ? 'text-orange-600' : 'hover:text-orange-600'
        }`
      }
    >
      <div>{icon}</div>
      {isOpen && <span>{label}</span>}
    </NavLink>
  </li>
)

export default renderMenuItem
