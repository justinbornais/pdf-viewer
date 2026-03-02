# PDF Viewer Implementation Plan

**Date:** 2026-03-02  
**Design Doc:** [2026-03-02-pdf-viewer-design.md](./2026-03-02-pdf-viewer-design.md)  
**Estimated Duration:** 6-8 hours (split across multiple sessions)

---

## Overview

This plan follows TDD methodology: write failing test → verify it fails → implement → verify it passes → commit.

Each task is 2-5 minutes of focused work.

---

## Phase 1: Project Setup (20 minutes)

### Task 1.1: Initialize Vite + React + TypeScript
**Files:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`

**Steps:**
1. Run: `npm create vite@latest . -- --template react-ts`
2. Install dependencies: `npm install`
3. Verify dev server runs: `npm run dev`
4. Commit: `"chore: initialize Vite React TypeScript project"`

---

### Task 1.2: Install PDF.js and dependencies
**Files:** `package.json`

**Steps:**
1. Run: `npm install pdfjs-dist`
2. Run: `npm install -D @types/pdfjs-dist`
3. Verify imports work by adding `import * as pdfjsLib from 'pdfjs-dist';` to `App.tsx`
4. Commit: `"chore: add pdfjs-dist dependency"`

---

### Task 1.3: Install Tailwind CSS
**Files:** `tailwind.config.js`, `postcss.config.js`, `src/index.css`

**Steps:**
1. Run: `npm install -D tailwindcss postcss autoprefixer`
2. Run: `npx tailwindcss init -p`
3. Configure `tailwind.config.js` content paths
4. Add Tailwind directives to `src/index.css`
5. Verify styling works by adding Tailwind class to App
6. Commit: `"chore: configure Tailwind CSS"`

---

### Task 1.4: Configure Vite for GitHub Pages
**Files:** `vite.config.ts`

**Steps:**
1. Write test: Verify build output includes correct base path
2. Update `vite.config.ts` with `base: '/pdf-viewer/'`
3. Run: `npm run build`
4. Verify `dist/index.html` has correct asset paths
5. Commit: `"chore: configure Vite base path for GitHub Pages"`

---

### Task 1.5: Set up PDF.js worker
**Files:** `src/config/pdfjs.ts`

**TDD:**
1. Write test: Mock worker setup and verify `GlobalWorkerOptions.workerSrc` is set
2. Verify test fails
3. Create `src/config/pdfjs.ts`:
   ```typescript
   import * as pdfjsLib from 'pdfjs-dist';
   
   pdfjsLib.GlobalWorkerOptions.workerSrc = 
     'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
   
   export { pdfjsLib };
   ```
4. Import in `main.tsx`
5. Verify test passes
6. Commit: `"feat: configure PDF.js worker"`

---

## Phase 2: Type Definitions (10 minutes)

### Task 2.1: Define global types
**Files:** `src/types/index.ts`

**TDD:**
1. Write type tests using TypeScript's type system
2. Verify types fail to compile without definitions
3. Create type definitions:
   ```typescript
   import { PDFDocumentProxy } from 'pdfjs-dist';
   
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
   ```
4. Verify types compile
5. Commit: `"feat: add TypeScript type definitions"`

---

## Phase 3: Utility Functions (30 minutes)

### Task 3.1: Create layout calculation utility
**Files:** `src/utils/layout.ts`, `src/utils/layout.test.ts`

**TDD:**
1. Write failing test:
   ```typescript
   test('calculates 2 pages for 1920x1080 viewport', () => {
     const result = calculatePagesPerView(1920, 1080, 0.707);
     expect(result).toBe(2);
   });
   
   test('calculates 1 page for mobile portrait', () => {
     const result = calculatePagesPerView(375, 667, 0.707);
     expect(result).toBe(1);
   });
   
   test('calculates 2 pages for mobile landscape', () => {
     const result = calculatePagesPerView(667, 375, 0.707);
     expect(result).toBe(2);
   });
   ```
2. Run tests: `npm test` → verify failures
3. Implement `calculatePagesPerView` function (see design doc algorithm)
4. Run tests → verify passes
5. Commit: `"feat: implement layout calculation algorithm"`

---

### Task 3.2: Create PDF loading utilities
**Files:** `src/utils/pdfLoader.ts`, `src/utils/pdfLoader.test.ts`

**TDD:**
1. Write failing test:
   ```typescript
   test('loads PDF from URL', async () => {
     const pdf = await loadPdfFromUrl('test.pdf');
     expect(pdf).toBeDefined();
     expect(pdf.numPages).toBeGreaterThan(0);
   });
   
   test('throws error for invalid URL', async () => {
     await expect(loadPdfFromUrl('invalid')).rejects.toThrow();
   });
   ```
2. Run tests → verify failures
3. Implement `loadPdfFromUrl` function
4. Run tests → verify passes
5. Commit: `"feat: implement PDF URL loader"`

---

### Task 3.3: Create file upload handler
**Files:** `src/utils/pdfLoader.ts`, `src/utils/pdfLoader.test.ts`

**TDD:**
1. Write failing test:
   ```typescript
   test('loads PDF from File object', async () => {
     const file = new File(['%PDF-1.4...'], 'test.pdf', { type: 'application/pdf' });
     const pdf = await loadPdfFromFile(file);
     expect(pdf).toBeDefined();
   });
   
   test('rejects non-PDF files', async () => {
     const file = new File(['text'], 'test.txt', { type: 'text/plain' });
     await expect(loadPdfFromFile(file)).rejects.toThrow('Invalid file type');
   });
   ```
2. Run tests → verify failures
3. Implement `loadPdfFromFile` function
4. Run tests → verify passes
5. Commit: `"feat: implement PDF file upload handler"`

---

### Task 3.4: Create visible page range calculator
**Files:** `src/utils/pagination.ts`, `src/utils/pagination.test.ts`

**TDD:**
1. Write failing test:
   ```typescript
   test('calculates visible range with buffer', () => {
     const range = getVisiblePageRange(5, 2, 2, 10);
     expect(range).toEqual({ start: 3, end: 9 });
   });
   
   test('clamps range to document bounds', () => {
     const range = getVisiblePageRange(1, 2, 2, 10);
     expect(range).toEqual({ start: 1, end: 5 });
   });
   ```
2. Run tests → verify failures
3. Implement `getVisiblePageRange` function
4. Run tests → verify passes
5. Commit: `"feat: implement visible page range calculator"`

---

## Phase 4: Core Components (90 minutes)

### Task 4.1: Create PageCanvas component
**Files:** `src/components/PageCanvas.tsx`, `src/components/PageCanvas.test.tsx`

**TDD:**
1. Write failing test:
   ```typescript
   test('renders canvas element', () => {
     render(<PageCanvas pdfDocument={mockPdf} pageNumber={1} zoomLevel={1} width={400} height={600} />);
     expect(screen.getByRole('img')).toBeInTheDocument();
   });
   ```
2. Run test → verify failure
3. Implement `PageCanvas` component:
   - Accept props: `pdfDocument`, `pageNumber`, `zoomLevel`, `width`, `height`
   - Use `useEffect` to render PDF page to canvas
   - Clean up canvas on unmount
4. Run test → verify passes
5. Manual test: Verify page renders visually
6. Commit: `"feat: implement PageCanvas component"`

---

### Task 4.2: Create PdfLoader component
**Files:** `src/components/PdfLoader.tsx`, `src/components/PdfLoader.test.tsx`

**TDD:**
1. Write failing test:
   ```typescript
   test('renders URL input and load button', () => {
     render(<PdfLoader onPdfLoad={jest.fn()} onError={jest.fn()} />);
     expect(screen.getByPlaceholderText(/enter pdf url/i)).toBeInTheDocument();
     expect(screen.getByRole('button', { name: /load/i })).toBeInTheDocument();
   });
   
   test('calls onPdfLoad when URL submitted', async () => {
     const onPdfLoad = jest.fn();
     render(<PdfLoader onPdfLoad={onPdfLoad} onError={jest.fn()} />);
     
     const input = screen.getByPlaceholderText(/enter pdf url/i);
     const button = screen.getByRole('button', { name: /load/i });
     
     fireEvent.change(input, { target: { value: 'test.pdf' } });
     fireEvent.click(button);
     
     await waitFor(() => expect(onPdfLoad).toHaveBeenCalled());
   });
   ```
2. Run tests → verify failures
3. Implement `PdfLoader` component:
   - URL input field
   - File upload input
   - Load button
   - Loading state
   - Error display
4. Run tests → verify passes
5. Commit: `"feat: implement PdfLoader component"`

---

### Task 4.3: Create Toolbar component
**Files:** `src/components/Toolbar.tsx`, `src/components/Toolbar.test.tsx`

**TDD:**
1. Write failing test:
   ```typescript
   test('renders zoom, scroll mode, and download buttons', () => {
     render(
       <Toolbar
         zoomLevel={1}
         scrollMode="horizontal"
         onZoomChange={jest.fn()}
         onScrollModeChange={jest.fn()}
         onDownload={jest.fn()}
       />
     );
     expect(screen.getByLabelText(/zoom in/i)).toBeInTheDocument();
     expect(screen.getByLabelText(/zoom out/i)).toBeInTheDocument();
     expect(screen.getByLabelText(/scroll mode/i)).toBeInTheDocument();
     expect(screen.getByLabelText(/download/i)).toBeInTheDocument();
   });
   
   test('calls onZoomChange when zoom buttons clicked', () => {
     const onZoomChange = jest.fn();
     render(<Toolbar zoomLevel={1} scrollMode="horizontal" onZoomChange={onZoomChange} onScrollModeChange={jest.fn()} onDownload={jest.fn()} />);
     
     fireEvent.click(screen.getByLabelText(/zoom in/i));
     expect(onZoomChange).toHaveBeenCalledWith(1.2);
   });
   ```
2. Run tests → verify failures
3. Implement `Toolbar` component with all controls
4. Run tests → verify passes
5. Commit: `"feat: implement Toolbar component"`

---

### Task 4.4: Create PdfViewer component
**Files:** `src/components/PdfViewer.tsx`, `src/components/PdfViewer.test.tsx`

**TDD:**
1. Write failing test:
   ```typescript
   test('renders correct number of pages', () => {
     render(
       <PdfViewer
         pdfDocument={mockPdf}
         pagesPerView={2}
         currentPage={1}
         zoomLevel={1}
         scrollMode="horizontal"
         onPageChange={jest.fn()}
       />
     );
     expect(screen.getAllByRole('img')).toHaveLength(2);
   });
   
   test('applies horizontal scroll class', () => {
     const { container } = render(
       <PdfViewer
         pdfDocument={mockPdf}
         pagesPerView={2}
         currentPage={1}
         zoomLevel={1}
         scrollMode="horizontal"
         onPageChange={jest.fn()}
       />
     );
     expect(container.firstChild).toHaveClass('flex-row');
   });
   ```
2. Run tests → verify failures
3. Implement `PdfViewer` component:
   - Calculate visible page range
   - Render PageCanvas for each visible page
   - Apply scroll mode CSS
   - Set up IntersectionObserver for page changes
4. Run tests → verify passes
5. Commit: `"feat: implement PdfViewer component"`

---

## Phase 5: Main App Integration (45 minutes)

### Task 5.1: Implement App component state management
**Files:** `src/App.tsx`, `src/App.test.tsx`

**TDD:**
1. Write failing test:
   ```typescript
   test('initializes with default state', () => {
     render(<App />);
     expect(screen.getByText(/pdf viewer/i)).toBeInTheDocument();
   });
   
   test('updates pagesPerView on window resize', async () => {
     render(<App />);
     
     // Simulate window resize
     global.innerWidth = 1920;
     global.innerHeight = 1080;
     window.dispatchEvent(new Event('resize'));
     
     // Assert pagesPerView updated (check via side effect)
     await waitFor(() => {
       // Verify layout recalculated
     });
   });
   ```
2. Run tests → verify failures
3. Implement App.tsx:
   - Initialize state with `useState`
   - Set up ResizeObserver in `useEffect`
   - Implement handlers: `handlePdfLoad`, `handlePageChange`, etc.
   - Render PdfLoader and PdfViewer
4. Run tests → verify passes
5. Commit: `"feat: implement App state management"`

---

### Task 5.2: Implement URL parameter parsing
**Files:** `src/App.tsx`, `src/App.test.tsx`

**TDD:**
1. Write failing test:
   ```typescript
   test('loads PDF from URL parameter on mount', async () => {
     // Mock window.location.search
     delete window.location;
     window.location = { search: '?pdf=https://example.com/test.pdf' } as any;
     
     render(<App />);
     
     await waitFor(() => {
       expect(screen.getByRole('img')).toBeInTheDocument();
     });
   });
   ```
2. Run test → verify failure
3. Implement URL parsing in `useEffect`:
   ```typescript
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const pdfUrl = params.get('pdf');
     if (pdfUrl) {
       loadPdfFromUrl(decodeURIComponent(pdfUrl))
         .then(handlePdfLoad)
         .catch(handleError);
     }
   }, []);
   ```
4. Run test → verify passes
5. Commit: `"feat: implement URL parameter PDF loading"`

---

### Task 5.3: Implement download functionality
**Files:** `src/App.tsx`, `src/utils/download.ts`, `src/utils/download.test.ts`

**TDD:**
1. Write failing test:
   ```typescript
   test('downloads PDF when download button clicked', () => {
     const mockPdf = { getData: jest.fn().mockResolvedValue(new Uint8Array()) };
     const { container } = render(<App />);
     
     // Load PDF first, then click download
     // ...
     
     expect(mockPdf.getData).toHaveBeenCalled();
   });
   ```
2. Run test → verify failure
3. Implement `downloadPdf` utility:
   ```typescript
   export async function downloadPdf(pdfDocument: PDFDocumentProxy, filename: string) {
     const data = await pdfDocument.getData();
     const blob = new Blob([data], { type: 'application/pdf' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = filename;
     link.click();
     URL.revokeObjectURL(url);
   }
   ```
4. Wire up in App.tsx
5. Run test → verify passes
6. Commit: `"feat: implement PDF download functionality"`

---

## Phase 6: Responsive Behavior (30 minutes)

### Task 6.1: Implement ResizeObserver hook
**Files:** `src/hooks/useResizeObserver.ts`, `src/hooks/useResizeObserver.test.ts`

**TDD:**
1. Write failing test:
   ```typescript
   test('calls callback on element resize', () => {
     const callback = jest.fn();
     const { result } = renderHook(() => useResizeObserver(callback));
     
     const mockElement = document.createElement('div');
     result.current(mockElement);
     
     // Simulate resize
     // ...
     
     expect(callback).toHaveBeenCalled();
   });
   ```
2. Run test → verify failure
3. Implement `useResizeObserver` hook
4. Run test → verify passes
5. Commit: `"feat: implement useResizeObserver hook"`

---

### Task 6.2: Integrate resize observer in App
**Files:** `src/App.tsx`

**TDD:**
1. Write failing test: Verify layout updates on resize
2. Run test → verify failure
3. Use `useResizeObserver` in App component
4. Update `pagesPerView` when viewport changes
5. Run test → verify passes
6. Manual test: Resize browser window, verify layout adapts
7. Commit: `"feat: integrate responsive layout updates"`

---

## Phase 7: Styling and Polish (45 minutes)

### Task 7.1: Style PdfLoader component
**Files:** `src/components/PdfLoader.tsx`

**Steps:**
1. Apply Tailwind classes for layout
2. Style input fields, buttons, error messages
3. Add loading spinner animation
4. Verify responsive on mobile
5. Commit: `"style: add styling to PdfLoader"`

---

### Task 7.2: Style PdfViewer component
**Files:** `src/components/PdfViewer.tsx`

**Steps:**
1. Apply scroll container styles
2. Add page spacing and shadows
3. Ensure pages centered in viewport
4. Test horizontal and vertical scroll modes
5. Commit: `"style: add styling to PdfViewer"`

---

### Task 7.3: Style Toolbar component
**Files:** `src/components/Toolbar.tsx`

**Steps:**
1. Position fixed at bottom-right
2. Add semi-transparent background
3. Style buttons with hover effects
4. Ensure accessible on all backgrounds
5. Commit: `"style: add styling to Toolbar"`

---

### Task 7.4: Add global styles and animations
**Files:** `src/index.css`

**Steps:**
1. Add smooth scrolling
2. Add page load fade-in animation
3. Add button hover transitions
4. Ensure high contrast for accessibility
5. Commit: `"style: add global styles and animations"`

---

## Phase 8: Error Handling and Edge Cases (30 minutes)

### Task 8.1: Handle CORS errors gracefully
**Files:** `src/utils/pdfLoader.ts`, `src/components/PdfLoader.tsx`

**TDD:**
1. Write failing test:
   ```typescript
   test('shows helpful message on CORS error', async () => {
     const onError = jest.fn();
     render(<PdfLoader onPdfLoad={jest.fn()} onError={onError} />);
     
     // Trigger CORS error
     // ...
     
     await waitFor(() => {
       expect(onError).toHaveBeenCalledWith(expect.stringContaining('CORS'));
     });
   });
   ```
2. Run test → verify failure
3. Update error handling with user-friendly CORS message
4. Run test → verify passes
5. Commit: `"feat: add graceful CORS error handling"`

---

### Task 8.2: Handle invalid file types
**Files:** `src/utils/pdfLoader.ts`

**TDD:**
1. Write failing test: Verify rejection of .txt, .jpg, etc.
2. Run test → verify failure
3. Add file type validation
4. Run test → verify passes
5. Commit: `"feat: add file type validation"`

---

### Task 8.3: Handle extremely large PDFs
**Files:** `src/components/PdfViewer.tsx`

**TDD:**
1. Write failing test: Mock 1000-page PDF, verify only visible pages rendered
2. Run test → verify failure
3. Implement virtual scrolling with page buffer
4. Run test → verify passes
5. Manual test: Load large PDF, verify smooth scrolling
6. Commit: `"feat: implement virtual scrolling for large PDFs"`

---

### Task 8.4: Handle missing PDF parameter gracefully
**Files:** `src/App.tsx`

**TDD:**
1. Write failing test: Verify app renders without URL param
2. Run test → verify failure
3. Add conditional rendering: show PdfLoader if no PDF loaded
4. Run test → verify passes
5. Commit: `"feat: handle missing PDF parameter gracefully"`

---

## Phase 9: Testing and Quality Assurance (60 minutes)

### Task 9.1: Write integration tests
**Files:** `src/App.integration.test.tsx`

**Steps:**
1. Test full workflow: load PDF → view pages → zoom → download
2. Test URL parameter loading
3. Test file upload
4. Test scroll mode switching
5. All tests must pass
6. Commit: `"test: add integration tests for full workflow"`

---

### Task 9.2: Run accessibility audit
**Files:** Various

**Steps:**
1. Run: `npm run build && npx serve dist`
2. Use Lighthouse to audit accessibility
3. Fix any issues (aria-labels, keyboard navigation, contrast)
4. Re-audit until 90+ score
5. Commit: `"a11y: fix accessibility issues"`

---

### Task 9.3: Test on multiple browsers
**Steps:**
1. Test on Chrome, Firefox, Safari, Edge
2. Document any browser-specific issues
3. Fix critical bugs
4. Commit: `"fix: resolve browser compatibility issues"`

---

### Task 9.4: Test responsive layouts
**Steps:**
1. Test on mobile (portrait and landscape)
2. Test on tablet
3. Test on desktop (1080p, 1440p, 4K)
4. Verify page count adapts correctly
5. Commit: `"test: verify responsive layouts across devices"`

---

## Phase 10: Deployment (30 minutes)

### Task 10.1: Create GitHub Actions workflow
**Files:** `.github/workflows/deploy.yml`

**Steps:**
1. Create workflow file (see design doc)
2. Push to GitHub
3. Enable GitHub Pages in repo settings
4. Verify deployment succeeds
5. Commit: `"ci: add GitHub Pages deployment workflow"`

---

### Task 10.2: Test production build
**Steps:**
1. Visit deployed site
2. Test all three PDF loading methods
3. Test on mobile device
4. Verify no console errors
5. Document any issues

---

### Task 10.3: Update README with usage instructions
**Files:** `README.md`

**Steps:**
1. Add live demo link
2. Document three loading methods
3. Add screenshot/GIF
4. List browser requirements
5. Commit: `"docs: add usage instructions to README"`

---

## Phase 11: Medium Priority Features (Optional, 90 minutes)

### Task 11.1: Implement print functionality
**Files:** `src/utils/print.ts`, `src/components/Toolbar.tsx`

**TDD:**
1. Write test: Verify print window opens with all pages
2. Implement print function
3. Add print button to toolbar
4. Test manually
5. Commit: `"feat: add print functionality"`

---

### Task 11.2: Implement full-screen mode
**Files:** `src/App.tsx`, `src/components/Toolbar.tsx`

**TDD:**
1. Write test: Verify fullscreen API called
2. Implement fullscreen toggle
3. Add button to toolbar
4. Test manually
5. Commit: `"feat: add full-screen mode"`

---

## Summary

**Total Estimated Time:** 6-8 hours  
**Phases:** 11  
**Tasks:** 40+  
**Commits:** 40+

**Key Milestones:**
- ✅ Phase 1-2: Project setup complete
- ✅ Phase 3: Utilities tested and working
- ✅ Phase 4: Core components rendering
- ✅ Phase 5: Full app integration
- ✅ Phase 9: All tests passing
- ✅ Phase 10: Live on GitHub Pages

---

## Execution Options

**Option A: Agent-Driven Execution**
- I implement the entire plan autonomously
- You review commits periodically
- Fastest completion time

**Option B: Batch Execution**
- I implement 5-10 tasks at a time
- You review and approve before next batch
- Balanced control and speed

**Option C: Manual Step-by-Step**
- I implement one task at a time
- You explicitly approve each step
- Maximum control, slowest

**Which option do you prefer?**
