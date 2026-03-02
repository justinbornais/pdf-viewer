interface ToolbarProps {
  zoomLevel: number;
  scrollMode: 'horizontal' | 'vertical';
  currentPage: number;
  totalPages: number;
  onZoomChange: (zoom: number) => void;
  onScrollModeChange: (mode: 'horizontal' | 'vertical') => void;
  onDownload: () => void;
}

export function Toolbar({
  zoomLevel,
  scrollMode,
  currentPage,
  totalPages,
  onZoomChange,
  onScrollModeChange,
  onDownload,
}: ToolbarProps) {
  const handleZoomIn = () => onZoomChange(Math.min(3, zoomLevel + 0.2));
  const handleZoomOut = () => onZoomChange(Math.max(0.5, zoomLevel - 0.2));
  const toggleScrollMode = () => 
    onScrollModeChange(scrollMode === 'horizontal' ? 'vertical' : 'horizontal');

  return (
    <div 
      className="fixed bottom-6 right-6 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl p-3 flex gap-2 z-50"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        padding: '0.75rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 50,
      }}
    >
      <button
        onClick={handleZoomOut}
        aria-label="Zoom out"
        className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
        title="Zoom Out"
        style={{
          padding: '0.75rem',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0.5rem',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
        </svg>
      </button>

      <div 
        className="flex items-center px-3 text-sm font-medium"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 0.75rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'white',
        }}
      >
        {Math.round(zoomLevel * 100)}%
      </div>

      <div 
        className="flex items-center px-3 text-sm font-medium"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 0.75rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#9ca3af',
        }}
      >
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={handleZoomIn}
        aria-label="Zoom in"
        className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
        title="Zoom In"
        style={{
          padding: '0.75rem',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0.5rem',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </button>

      <div 
        className="w-px bg-gray-700 mx-1"
        style={{
          width: '1px',
          backgroundColor: '#374151',
          margin: '0 0.25rem',
        }}
      ></div>

      <button
        onClick={toggleScrollMode}
        aria-label="Toggle scroll mode"
        className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
        title={`Switch to ${scrollMode === 'horizontal' ? 'Vertical' : 'Horizontal'} Scroll`}
        style={{
          padding: '0.75rem',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0.5rem',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {scrollMode === 'horizontal' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-12 5h12M3 7h.01M3 12h.01M3 17h.01" />
          </svg>
        )}
      </button>

      <button
        onClick={onDownload}
        aria-label="Download PDF"
        className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
        title="Download PDF"
        style={{
          padding: '0.75rem',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0.5rem',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
}
