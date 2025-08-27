import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageContainerRef = useRef<HTMLDivElement | null>(null)

  const handlePageClick = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  useEffect(() => {
    const currentContainer = pageContainerRef.current
    if (currentContainer) {
      const activePageButton = currentContainer.querySelector(
        `.page-button-${currentPage}`
      ) as HTMLElement | null
      if (activePageButton) {
        activePageButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [currentPage])

  /**
   * Gera um array de números de página a serem exibidos na paginação,
   * focando em um subconjunto de páginas ao redor da página atual para melhor usabilidade.
   * Isso evita renderizar todos os números de página quando há um grande volume de totalPages.
   *
   * @returns {number[]} Um array de números de página que devem ser exibidos.
   */
  const getPageNumbers = (): number[] => {
    const pagesToShow = 5
    const halfPagesToShow = Math.floor(pagesToShow / 2)
    let startPage = Math.max(1, currentPage - halfPagesToShow)
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow)

    // Ajusta o início e o fim se estivermos perto das extremidades
    if (endPage - startPage + 1 < pagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + pagesToShow - 1)
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - pagesToShow + 1)
      }
    }

    const pages: number[] = []

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
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
      <button
        className={`px-2 py-1 bg-gray-800 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        <ArrowLeft />
      </button>

      <div
        ref={pageContainerRef}
        className="flex items-center space-x-2 max-w-md mx-auto overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {/* Números de página */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`rounded min-w-9 min-h-9 flex items-center justify-center flex-shrink-0 ${
              currentPage === page
                ? 'bg-orange-700 text-white'
                : 'bg-white text-black hover:bg-blue-200'
            } page-button-${page}`}
          >
            {page}
          </button>
        ))}
      </div>

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
