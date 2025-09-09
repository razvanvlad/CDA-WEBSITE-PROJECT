/**
 * Server-side pagination utilities
 */

export function getPaginationFromSearchParams(
  searchParams: URLSearchParams,
  itemsPerPage: number = 12
) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const offset = (page - 1) * itemsPerPage
  
  return {
    currentPage: page,
    itemsPerPage,
    offset
  }
}