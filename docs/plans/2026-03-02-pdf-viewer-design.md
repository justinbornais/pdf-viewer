# PDF Viewer Design Document

**Date:** 2026-03-02  
**Status:** Approved  
**Tech Stack:** React 18 + Vite + PDF.js + TypeScript + Tailwind CSS

---

## 1. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   App.tsx                       │
│  - Global state management                      │
│  - Window resize listener                       │
│  - Layout calculation orchestration             │
└─────────────────────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
┌──────────▼────────┐   ┌─────────▼──────────┐
│   PdfLoader       │   │   PdfViewer        │
│  - URL input      │   │  - Page renderer   │
│  - File upload    │   │  - Layout engine   │
│  - URL param      │   │  - Scroll handler  │
└───────────────────┘   └────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
         ┌──────────▼────────┐ ┌─────────▼─────────┐
         │   Toolbar         │ │   PageCanvas      │
         │  - Zoom           │ │  - PDF.js render  │
         │  - Download       │ │  - Page display   │
         │  - Scroll mode    │ │                   │
         └───────────────────┘ └───────────────────┘
```

### Core Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **App** | State container, resize observer, routing |
| **PdfLoader** | PDF acquisition (URL/file/param), validation |
| **PdfViewer** | Layout calculation, page rendering orchestration |
| **Toolbar** | User controls, state mutations |
| **PageCanvas** | Individual page rendering via PDF.js |
| **LayoutEngine** | Calculate optimal page count per viewport |

---

## 2. Component Design

### 2.1 State Management

**Global State (in App.tsx):**
```typescript
interface AppState {
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
```

**Why not Context API or Zustand?**
- State is simple and primarily top-down
- Single source of truth in App component sufficient
- Prop drilling minimal (2 levels max)
- Can refactor to Zustand later if state grows

### 2.2 Component Breakdown

#### **App.tsx**
- Manages global state
- Sets up window resize listener (`useEffect` with `ResizeObserver`)
- Handles URL parameter parsing on mount
- Renders `PdfLoader` and `PdfViewer`

#### **PdfLoader.tsx**
```typescript
interface PdfLoaderProps {
  onPdfLoad: (pdf: PDFDocumentProxy) => void;
  onError: (error: string) => void;
}
```
- Three input methods:
  1. Text input + "Load" button for URLs
  2. File input for local uploads
  3. Auto-load from URL parameter (runs on mount)
- Validates PDF before calling `onPdfLoad`
- Shows loading spinner during fetch

#### **PdfViewer.tsx**
```typescript
interface PdfViewerProps {
  pdfDocument: PDFDocumentProxy;
  pagesPerView: number;
  currentPage: number;
  zoomLevel: number;
  scrollMode: 'horizontal' | 'vertical';
  onPageChange: (page: number) => void;
}
```
- Calculates which pages to render based on `currentPage` and `pagesPerView`
- Manages scroll container (horizontal or vertical)
- Renders array of `PageCanvas` components
- Implements lazy loading for large PDFs (virtual scrolling)

#### **PageCanvas.tsx**
```typescript
interface PageCanvasProps {
  pdfDocument: PDFDocumentProxy;
  pageNumber: number;
  zoomLevel: number;
  width: number;
  height: number;
}
```
- Renders single PDF page to `<canvas>`
- Uses `useEffect` to trigger PDF.js render on prop changes
- Manages canvas cleanup

#### **Toolbar.tsx**
```typescript
interface ToolbarProps {
  zoomLevel: number;
  scrollMode: 'horizontal' | 'vertical';
  onZoomChange: (zoom: number) => void;
  onScrollModeChange: (mode: 'horizontal' | 'vertical') => void;
  onDownload: () => void;
}
```
- Floating toolbar with controls:
  - Zoom in/out buttons
  - Download PDF button
  - Scroll mode toggle (horizontal ↔ vertical)
- Positioned fixed at bottom-right

---

## 3. Layout Algorithm

### 3.1 Responsive Page Calculation

**Goal:** Maximize pages displayed while maintaining readability.

**Algorithm:**
```typescript
function calculatePagesPerView(
  viewportWidth: number,
  viewportHeight: number,
  pageAspectRatio: number, // width / height of PDF page
  minPageWidth: number = 400 // minimum readable width
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
  
  return Math.max(1, pagesPerRow);
}
```

**Responsive Breakpoints:**
| Viewport Width | Typical Pages |
|----------------|---------------|
| < 640px (mobile portrait) | 1 page |
| 640-1024px (mobile landscape, tablet) | 2 pages |
| 1024-1920px (desktop) | 2 pages |
| > 1920px (ultrawide) | 3-4 pages |

**Special Cases:**
- Portrait mode: Always 1 page unless height allows stacking
- Ultrawide monitors: Cap at 5 pages to maintain readability

### 3.2 Window Resize Handling

```typescript
useEffect(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    setViewportDimensions({ width, height });
    
    // Recalculate pages per view
    const newPagesPerView = calculatePagesPerView(
      width,
      height,
      pageAspectRatio
    );
    setPagesPerView(newPagesPerView);
  });
  
  resizeObserver.observe(document.documentElement);
  return () => resizeObserver.disconnect();
}, [pageAspectRatio]);
```

---

## 4. PDF Loading Strategies

### 4.1 Three Loading Methods

#### **Method 1: URL Input**
```typescript
async function loadPdfFromUrl(url: string): Promise<PDFDocumentProxy> {
  const loadingTask = pdfjsLib.getDocument({
    url,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.x/cmaps/',
    cMapPacked: true,
  });
  return await loadingTask.promise;
}
```

#### **Method 2: File Upload**
```typescript
function handleFileUpload(file: File) {
  const fileReader = new FileReader();
  fileReader.onload = async (e) => {
    const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    onPdfLoad(pdf);
  };
  fileReader.readAsArrayBuffer(file);
}
```

#### **Method 3: URL Parameter**
```typescript
// On mount in App.tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get('pdf');
  if (pdfUrl) {
    loadPdfFromUrl(decodeURIComponent(pdfUrl));
  }
}, []);
```

**Example URL:** `https://yourdomain.github.io/pdf-viewer/?pdf=https://example.com/document.pdf`

### 4.2 CORS Workaround

**Problem:** Many PDF URLs block cross-origin requests.

**Solutions (in priority order):**

1. **Use PDF.js with `withCredentials: false`** (handles some CORS issues)
2. **Cors-anywhere proxy** (for development, not production)
3. **User instruction:** "If PDF fails, download and upload manually"

**Implementation:**
```typescript
async function loadPdfFromUrl(url: string): Promise<PDFDocumentProxy> {
  try {
    return await pdfjsLib.getDocument({ url }).promise;
  } catch (error) {
    if (error.name === 'MissingPDFException' || error.message.includes('CORS')) {
      throw new Error(
        'Unable to load PDF due to CORS restrictions. Please download the PDF and upload it manually.'
      );
    }
    throw error;
  }
}
```

---

## 5. Scroll Modes

### 5.1 Horizontal Scroll (Default)

- Pages arranged in a row
- User scrolls left-right to navigate
- CSS: `display: flex; flex-direction: row; overflow-x: auto;`
- Natural for multi-page layouts

### 5.2 Vertical Scroll

- Pages stacked vertically
- User scrolls up-down to navigate
- CSS: `display: flex; flex-direction: column; overflow-y: auto;`
- Familiar reading pattern

**Toggle Implementation:**
- Button in toolbar switches `scrollMode` state
- `PdfViewer` applies appropriate CSS class
- Scroll position resets on mode change

---

## 6. Performance Optimizations

### 6.1 Lazy Loading (Virtual Scrolling)

**Problem:** Rendering 100+ pages upfront freezes browser.

**Solution:** Render only visible pages + buffer.

```typescript
function getVisiblePageRange(
  scrollPosition: number,
  pagesPerView: number,
  buffer: number = 2
): { start: number; end: number } {
  const start = Math.max(1, currentPage - buffer);
  const end = Math.min(totalPages, currentPage + pagesPerView + buffer);
  return { start, end };
}
```

**Implementation:**
- Track scroll position
- Calculate visible range
- Only render pages in range
- Use `IntersectionObserver` to trigger page changes

### 6.2 PDF.js Worker

Enable worker for background rendering:
```typescript
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.x/build/pdf.worker.min.js';
```

### 6.3 Canvas Pooling

Reuse canvas elements instead of creating new ones for each page change.

---

## 7. Deployment Configuration

### 7.1 Vite Configuration

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/pdf-viewer/', // GitHub Pages subdirectory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs': ['pdfjs-dist'],
        },
      },
    },
  },
});
```

### 7.2 GitHub Actions Workflow

Auto-deploy on push to main:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 8. Additional Features (Medium Priority)

### 8.1 Print Functionality

Use browser's print API:
```typescript
function handlePrint() {
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Print PDF</title></head><body>');
  
  // Render all pages to print window
  for (let i = 1; i <= totalPages; i++) {
    const canvas = await renderPage(pdfDocument, i);
    printWindow.document.body.appendChild(canvas);
  }
  
  printWindow.document.write('</body></html>');
  printWindow.print();
}
```

### 8.2 Full-Screen Mode

Use Fullscreen API:
```typescript
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
```

### 8.3 Annotations (Future)

Integrate `react-pdf-highlighter` or similar library.

---

## 9. Technology Decisions (ADR Format)

### ADR-001: Use React Instead of Vanilla JS

**Status:** Accepted

**Context:** Need responsive UI with complex layout calculations.

**Decision:** React with hooks for state and side effects.

**Rationale:**
- `useEffect` perfect for window resize listener
- Component reusability speeds development
- Easier to maintain as features grow

**Consequences:**
- 150KB bundle size acceptable for modern web
- Requires build step, but Vite is fast

---

### ADR-002: Use Vite Instead of Create React App

**Status:** Accepted

**Context:** Need fast development and optimized production builds.

**Decision:** Vite as build tool.

**Rationale:**
- 10-100x faster dev server than CRA
- Better tree-shaking and code splitting
- Native ESM support
- Active maintenance (CRA deprecated)

**Consequences:**
- Must configure `base` path for GitHub Pages

---

### ADR-003: Use PDF.js Instead of React-PDF

**Status:** Accepted

**Context:** Need flexible PDF rendering with CORS handling.

**Decision:** PDF.js directly instead of wrapper libraries.

**Rationale:**
- Direct control over rendering pipeline
- Better CORS workaround options
- More flexible for custom features (annotations, lazy loading)
- React-PDF adds unnecessary abstraction layer

**Consequences:**
- More boilerplate code for canvas rendering
- Must manage worker setup manually

---

## 10. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CORS blocks PDF URLs | High | High | Clear error messages, fallback to file upload |
| Large PDFs freeze browser | Medium | High | Lazy loading with virtual scrolling |
| Layout bugs on exotic screen sizes | Medium | Medium | Extensive responsive testing, min/max page constraints |
| PDF.js bundle size | Low | Low | Code splitting, CDN worker |
| Browser compatibility issues | Low | Medium | Target modern browsers, polyfills for ResizeObserver |

---

## 11. Success Criteria

- [ ] Load PDF from URL input
- [ ] Upload PDF from local file
- [ ] Auto-load PDF from URL parameter
- [ ] Responsive layout: 1-5 pages based on viewport
- [ ] Horizontal and vertical scroll modes
- [ ] Zoom in/out functionality
- [ ] Download PDF button
- [ ] Handles PDFs up to 100MB without freezing
- [ ] Updates layout on window resize (< 100ms delay)
- [ ] Works on Chrome, Firefox, Safari, Edge (latest versions)

---

**Design Status:** ✅ Approved  
**Next Step:** Implementation Plan
