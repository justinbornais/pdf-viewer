/**
 * Calculate the optimal number of pages to display per view
 * based on viewport dimensions and page aspect ratio
 */
export function calculatePagesPerView(
  viewportWidth: number,
  viewportHeight: number,
  pageAspectRatio: number,
  minPageWidth: number = 400
): number {
  const availableWidth = viewportWidth - 40; // padding
  const availableHeight = viewportHeight - 120; // toolbar + margins
  
  // Calculate max pages that fit horizontally
  let pagesPerRow = Math.floor(availableWidth / minPageWidth);
  
  // Verify pages fit vertically at this count
  const pageWidth = availableWidth / pagesPerRow;
  const pageHeight = pageWidth / pageAspectRatio;
  
  if (pageHeight > availableHeight) {
    // Pages too tall, reduce count
    pagesPerRow = Math.max(1, pagesPerRow - 1);
  }
  
  // Cap at 5 pages for readability
  return Math.max(1, Math.min(5, pagesPerRow));
}
