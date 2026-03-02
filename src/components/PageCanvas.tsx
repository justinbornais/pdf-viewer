import { useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface PageCanvasProps {
  pdfDocument: PDFDocumentProxy;
  pageNumber: number;
  zoomLevel: number;
  width: number;
  height: number;
}

export function PageCanvas({ pdfDocument, pageNumber, zoomLevel, width, height }: PageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current) return;

      try {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: zoomLevel });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
      }
    };

    renderPage();
  }, [pdfDocument, pageNumber, zoomLevel]);

  return (
    <canvas
      ref={canvasRef}
      className="shadow-lg mx-auto"
      style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
      role="img"
      aria-label={`PDF page ${pageNumber}`}
    />
  );
}
