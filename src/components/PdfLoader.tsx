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
    <div 
      className="w-full max-w-2xl mx-auto p-6 space-y-6"
      style={{
        width: '100%',
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '1.5rem',
      }}
    >
      <div className="text-center" style={{ textAlign: 'center' }}>
        <h1 className="text-4xl font-bold mb-2" style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>PDF Viewer</h1>
        <p className="text-gray-400" style={{ color: '#9ca3af' }}>Load a PDF to get started</p>
      </div>

      {/* URL Input */}
      <form onSubmit={handleUrlSubmit} className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label htmlFor="pdf-url" className="block text-sm font-medium mb-2" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Load from URL
          </label>
          <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="pdf-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter PDF URL (e.g., https://example.com/document.pdf)"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: 'white',
              }}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: loading || !url.trim() ? '#374151' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>
      </form>

      {/* File Upload */}
      <div>
        <label htmlFor="pdf-file" className="block text-sm font-medium mb-2" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
          Upload from Computer
        </label>
        <input
          id="pdf-file"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileUpload}
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
          <div 
            className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"
            style={{
              width: '3rem',
              height: '3rem',
              border: '4px solid #374151',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
      )}
    </div>
  );
}

