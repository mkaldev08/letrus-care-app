import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import React from 'react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4 max-w-3xl mx-auto">
      <button
        className={`px-2 py-1 bg-gray-800 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        disabled={currentPage === 1}
        onClick={() => handlePageClick(1)}
      >
        <ChevronsLeft />
      </button>
      {/* Botão anterior */}
      <button
        className={`px-2 py-1 bg-gray-800 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        <ArrowLeft />
      </button>

      {/* FIXME: Fazer com que a rolagem acompanhe a pagina atual */}
      <div className="flex items-center space-x-2 max-w-md  mx-auto overflow-x-hidden scroll-sna">
        {/* Números de página */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`rounded min-w-9 min-h-9 ${
              currentPage === page
                ? 'bg-orange-700 text-white'
                : 'bg-white text-black hover:bg-blue-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Botão próximo */}
      <button
        className={`px-2 py-1 bg-gray-800 text-white rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        <ArrowRight />
      </button>

      <button
        className={`px-2 py-1 bg-gray-800 text-white rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(totalPages)}
      >
        <ChevronsRight />
      </button>
    </div>
  )
}

export default Pagination
