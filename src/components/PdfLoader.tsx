import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { loadPdfFromUrl, loadPdfFromFile } from '../utils/pdfLoader';

interface PdfLoaderProps {
  onPdfLoad: (pdf: PDFDocumentProxy) => void;
  onError: (error: string) => void;
}

export function PdfLoader({ onPdfLoad, onError }: PdfLoaderProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUrlSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const pdf = await loadPdfFromUrl(url);
      onPdfLoad(pdf);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const pdf = await loadPdfFromFile(file);
      onPdfLoad(pdf);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">PDF Viewer</h1>
        <p className="text-gray-400">Load a PDF to get started</p>
      </div>

      {/* URL Input */}
      <form onSubmit={handleUrlSubmit} className="space-y-3">
        <div>
          <label htmlFor="pdf-url" className="block text-sm font-medium mb-2">
            Load from URL
          </label>
          <div className="flex gap-2">
            <input
              id="pdf-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter PDF URL (e.g., https://example.com/document.pdf)"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>
      </form>

      {/* File Upload */}
      <div>
        <label htmlFor="pdf-file" className="block text-sm font-medium mb-2">
          Upload from Computer
        </label>
        <input
          id="pdf-file"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileUpload}
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
        </div>
      )}
    </div>
  );
}
