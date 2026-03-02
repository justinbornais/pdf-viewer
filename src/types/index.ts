import type { PDFDocumentProxy } from 'pdfjs-dist';

export interface AppState {
  pdfDocument: PDFDocumentProxy | null;
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  scrollMode: 'horizontal' | 'vertical';
  viewportDimensions: { width: number; height: number };
  pagesPerView: number;
  loading: boolean;
  error: string | null;
}

export interface PageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface VisiblePageRange {
  start: number;
  end: number;
}
