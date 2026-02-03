import React from 'react'
import { Search, Filter } from 'lucide-react'
import { UseFormRegister, FieldValues, Path } from 'react-hook-form'

interface SearchBarProps<T extends FieldValues> {
  register: UseFormRegister<T>
  fieldName: Path<T>
  placeholder?: string
  showFilter?: boolean
  onFilterClick?: () => void
}

export const SearchBar = <T extends FieldValues>({
  register,
  fieldName,
  placeholder = 'Buscar...',
  showFilter = true,
  onFilterClick
}: SearchBarProps<T>): React.ReactElement => {
  return (
    <div className="flex items-center gap-3 mt-6">
      <Search className="text-zinc-500" />
      <input
        {...register(fieldName)}
        type="search"
        placeholder={placeholder}
        className="flex-1 p-2 rounded-md border border-gray-400 bg-zinc-300 text-gray-700 placeholder:text-gray-700 outline-none focus:ring-2 focus:ring-orange-600 transition-all"
      />
      {showFilter && (
        <button
          type="button"
          onClick={onFilterClick}
          className="text-zinc-500 cursor-pointer hover:opacity-90 transition-opacity"
          title="Filtrar"
        >
          <Filter />
        </button>
      )}
    </div>
  )
}
