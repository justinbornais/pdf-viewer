import { useState, useEffect, useCallback } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import './config/pdfjs'; // Initialize PDF.js
import { PdfLoader } from './components/PdfLoader';
import { PdfViewer } from './components/PdfViewer';
import { Toolbar } from './components/Toolbar';
import { calculatePagesPerView } from './utils/layout';
import { loadPdfFromUrl } from './utils/pdfLoader';
import { downloadPdf } from './utils/download';
import { useResizeObserver } from './hooks/useResizeObserver';

function App() {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scrollMode, setScrollMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [viewportDimensions, setViewportDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [pagesPerView, setPagesPerView] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [pageAspectRatio, setPageAspectRatio] = useState(0.707); // Default A4 ratio

  // Handle PDF load
  const handlePdfLoad = useCallback(async (pdf: PDFDocumentProxy) => {
    setPdfDocument(pdf);
    setCurrentPage(1);
    setError(null);

    // Get first page to calculate aspect ratio
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const aspectRatio = viewport.width / viewport.height;
    setPageAspectRatio(aspectRatio);

    // Calculate initial pages per view
    const pages = calculatePagesPerView(
      viewportDimensions.width,
      viewportDimensions.height,
      aspectRatio
    );
    setPagesPerView(pages);
  }, [viewportDimensions]);

  // Handle errors
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setPdfDocument(null);
  }, []);

  // Handle window resize
  const handleResize = useCallback((width: number, height: number) => {
    setViewportDimensions({ width, height });

    if (pdfDocument && pageAspectRatio) {
      const pages = calculatePagesPerView(width, height, pageAspectRatio);
      setPagesPerView(pages);
    }
  }, [pdfDocument, pageAspectRatio]);

  useResizeObserver(handleResize);

  // Load PDF from URL parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pdfUrl = params.get('pdf');
    
    if (pdfUrl) {
      const decodedUrl = decodeURIComponent(pdfUrl);
      loadPdfFromUrl(decodedUrl)
        .then(handlePdfLoad)
        .catch((err) => handleError(err.message));
    }
  }, [handlePdfLoad, handleError]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (pdfDocument) {
      downloadPdf(pdfDocument).catch((err) => {
        setError(`Download failed: ${err.message}`);
      });
    }
  }, [pdfDocument]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-2xl">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto hover:bg-red-700 rounded p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!pdfDocument ? (
        <div className="flex items-center justify-center min-h-screen">
          <PdfLoader onPdfLoad={handlePdfLoad} onError={handleError} />
        </div>
      ) : (
        <>
          <PdfViewer
            pdfDocument={pdfDocument}
            pagesPerView={pagesPerView}
            currentPage={currentPage}
            zoomLevel={zoomLevel}
            scrollMode={scrollMode}
            onPageChange={setCurrentPage}
            viewportDimensions={viewportDimensions}
          />
          <Toolbar
            zoomLevel={zoomLevel}
            scrollMode={scrollMode}
            onZoomChange={setZoomLevel}
            onScrollModeChange={setScrollMode}
            onDownload={handleDownload}
          />
        </>
      )}
    </div>
  );
}

export default App;

