'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  basePath: string
  searchParams?: URLSearchParams
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  basePath,
  searchParams = new URLSearchParams()
}: PaginationProps) {
  const router = useRouter()

  if (totalPages <= 1) {
    return null
  }

  // Helper function to generate page URLs
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    const queryString = params.toString()
    return `${basePath}${queryString ? `?${queryString}` : ''}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Always show last page
      if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Results info */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
            aria-label="Go to previous page"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Link>
        ) : (
          <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-300 rounded-l-md cursor-not-allowed">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
              >
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isCurrentPage = pageNum === currentPage

          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium border transition-colors ${
                isCurrentPage
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          )
        })}

        {/* Next button */}
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
            aria-label="Go to next page"
          >
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-300 rounded-r-md cursor-not-allowed">
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </nav>

      {/* Quick page jump (for large datasets) */}
      {totalPages > 10 && (
        <div className="flex items-center space-x-2 text-sm">
          <label htmlFor="pageJump" className="text-gray-700">
            Go to page:
          </label>
          <input
            id="pageJump"
            type="number"
            min={1}
            max={totalPages}
            defaultValue={currentPage}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement
                const page = parseInt(target.value)
                if (page >= 1 && page <= totalPages) {
                  router.push(getPageUrl(page))
                }
              }
            }}
          />
          <span className="text-gray-500">of {totalPages}</span>
        </div>
      )}
    </div>
  )
}

