import { useEffect, useState, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { PageCanvas } from './PageCanvas';
import { getVisiblePageRange } from '../utils/pagination';

interface PdfViewerProps {
  pdfDocument: PDFDocumentProxy;
  pagesPerView: number;
  currentPage: number;
  zoomLevel: number;
  scrollMode: 'horizontal' | 'vertical';
  onPageChange: (page: number) => void;
  viewportDimensions: { width: number; height: number };
}

export function PdfViewer({
  pdfDocument,
  pagesPerView,
  currentPage,
  zoomLevel,
  scrollMode,
  onPageChange,
  viewportDimensions,
}: PdfViewerProps) {
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate page dimensions
  useEffect(() => {
    const calculateDimensions = async () => {
      const page = await pdfDocument.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      
      const availableWidth = (viewportDimensions.width - 40) / pagesPerView - 20;
      const availableHeight = viewportDimensions.height - 120;
      
      const scale = Math.min(
        availableWidth / viewport.width,
        availableHeight / viewport.height
      );
      
      setPageWidth(viewport.width * scale);
      setPageHeight(viewport.height * scale);
    };

    calculateDimensions();
  }, [pdfDocument, pagesPerView, viewportDimensions]);

  // Calculate visible pages
  const visibleRange = getVisiblePageRange(
    currentPage,
    pagesPerView,
    2, // buffer
    pdfDocument.numPages
  );

  // Generate array of page numbers to render
  const pagesToRender = [];
  for (let i = visibleRange.start; i <= visibleRange.end; i++) {
    pagesToRender.push(i);
  }

  // Set up intersection observer for page changes
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page-number') || '1');
            onPageChange(pageNum);
          }
        });
      },
      { threshold: 0.5 }
    );

    const canvases = containerRef.current.querySelectorAll('[data-page-number]');
    canvases.forEach((canvas) => observer.observe(canvas));

    return () => observer.disconnect();
  }, [pagesToRender, onPageChange]);

  return (
    <div
      ref={containerRef}
      className={`
        flex gap-5 p-5
        ${scrollMode === 'horizontal' ? 'flex-row overflow-x-auto' : 'flex-col overflow-y-auto'}
        h-screen w-full
      `}
      style={{
        display: 'flex',
        gap: '1.25rem',
        padding: '1.25rem',
        flexDirection: scrollMode === 'horizontal' ? 'row' : 'column',
        overflowX: scrollMode === 'horizontal' ? 'auto' : 'hidden',
        overflowY: scrollMode === 'vertical' ? 'auto' : 'hidden',
        height: '100vh',
        width: '100%',
        scrollBehavior: 'smooth',
        backgroundColor: '#111827',
      }}
    >
      {pagesToRender.map((pageNum) => (
        <div
          key={pageNum}
          data-page-number={pageNum}
          className="flex-shrink-0"
          style={{
            flexShrink: 0,
          }}
        >
          <PageCanvas
            pdfDocument={pdfDocument}
            pageNumber={pageNum}
            zoomLevel={zoomLevel}
            width={pageWidth}
            height={pageHeight}
          />
          <div 
            className="text-center mt-2 text-sm text-gray-400"
            style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#9ca3af',
            }}
          >
            Page {pageNum} of {pdfDocument.numPages}
          </div>
        </div>
      ))}
    </div>
  );
}
