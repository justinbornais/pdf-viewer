import type { VisiblePageRange } from '../types';

/**
 * Calculate which pages should be visible given current page and buffer
 */
export function getVisiblePageRange(
  currentPage: number,
  pagesPerView: number,
  buffer: number,
  totalPages: number
): VisiblePageRange {
  const start = Math.max(1, currentPage - buffer);
  const end = Math.min(totalPages, currentPage + pagesPerView - 1 + buffer);
  
  return { start, end };
}
