import { useEffect, useState, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { PageCanvas } from './PageCanvas';

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
  zoomLevel,
  scrollMode,
  onPageChange,
  viewportDimensions,
}: PdfViewerProps) {
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate page dimensions based on scroll mode
  useEffect(() => {
    const calculateDimensions = async () => {
      const page = await pdfDocument.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const aspectRatio = viewport.width / viewport.height;
      
      if (scrollMode === 'horizontal') {
        // Horizontal scroll: height is 100vh, width scales to maintain aspect ratio
        const maxHeight = viewportDimensions.height - 20; // 10px margin top/bottom
        const width = maxHeight * aspectRatio * zoomLevel;
        setPageHeight(maxHeight);
        setPageWidth(width);
      } else {
        // Vertical scroll: width is 100vw, height scales to maintain aspect ratio
        const maxWidth = viewportDimensions.width - 20; // 10px margin left/right
        const height = maxWidth / aspectRatio * zoomLevel;
        setPageWidth(maxWidth);
        setPageHeight(height);
      }
    };

    calculateDimensions();
  }, [pdfDocument, scrollMode, viewportDimensions, zoomLevel]);

  // Generate array of all page numbers to render
  const pagesToRender = [];
  for (let i = 1; i <= pdfDocument.numPages; i++) {
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
      data-pdf-viewer-container
      className={`
        flex
        ${scrollMode === 'horizontal' ? 'flex-row overflow-x-auto' : 'flex-col overflow-y-auto'}
        h-screen w-full
      `}
      style={{
        display: 'flex',
        gap: '4px',
        padding: '10px',
        flexDirection: scrollMode === 'horizontal' ? 'row' : 'column',
        overflowX: scrollMode === 'horizontal' ? 'auto' : 'hidden',
        overflowY: scrollMode === 'vertical' ? 'auto' : 'hidden',
        height: '100vh',
        width: '100%',
        scrollBehavior: 'smooth',
        backgroundColor: '#111827',
        alignItems: scrollMode === 'horizontal' ? 'center' : 'stretch',
      }}
    >
      {pagesToRender.map((pageNum) => (
        <div
          key={pageNum}
          data-page-number={pageNum}
          className="flex-shrink-0"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PageCanvas
            pdfDocument={pdfDocument}
            pageNumber={pageNum}
            zoomLevel={zoomLevel}
            width={pageWidth}
            height={pageHeight}
          />
        </div>
      ))}
    </div>
  );
}
