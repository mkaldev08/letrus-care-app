import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onActionClick?: () => void
  showAction?: boolean
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actionLabel,
  onActionClick,
  showAction = true
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl text-zinc-400">{title}</h2>
        {description && <p className="text-zinc-600 mt-1">{description}</p>}
      </div>
      {showAction && actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
