# PDF Viewer

A responsive, frontend-only PDF viewer that automatically adapts to display as many pages as possible based on your screen size. Built with React, TypeScript, and PDF.js.

## 🚀 Features

- **📱 Fully Responsive**: Automatically displays 1-5 pages based on viewport size
- **🔗 Multiple Loading Methods**:
  - Load from URL
  - Upload local files
  - Auto-load via URL parameter
- **🎨 Interactive Controls**:
  - Zoom in/out
  - Toggle horizontal/vertical scrolling
  - Download PDF
- **⚡ Performance Optimized**:
  - Lazy loading for large PDFs
  - Virtual scrolling
  - Efficient canvas rendering
- **♿ Accessible**: ARIA labels and keyboard navigation

## 🎯 Live Demo

Visit: `https://justinbornais.github.io/pdf-viewer/`

## 📖 Usage

### Method 1: Load from URL
1. Visit the app
2. Paste a PDF URL into the input field
3. Click "Load"

### Method 2: Upload File
1. Visit the app
2. Click "Choose File"
3. Select a PDF from your computer

### Method 3: URL Parameter
Load a PDF automatically by appending it to the URL:

```
https://justinbornais.github.io/pdf-viewer/?pdf=https://example.com/document.pdf
```

## 🖥️ Responsive Behavior

| Viewport | Pages Displayed |
|----------|----------------|
| Mobile Portrait (< 640px) | 1 page |
| Mobile Landscape (640-1024px) | 2 pages |
| Desktop 1080p (1920x1080) | 2 pages |
| Ultrawide (> 2560px) | 3-4 pages |

The app automatically recalculates and updates the layout when you resize your browser or rotate your device.

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **PDF.js** - PDF rendering
- **Tailwind CSS** - Styling
- **GitHub Pages** - Hosting

## 📝 Browser Support

Modern browsers (last 2 versions):
- Chrome
- Firefox
- Safari
- Edge

## ⚠️ CORS Limitations

Some PDF URLs may be blocked due to CORS restrictions. If you encounter an error, download the PDF and upload it manually using Method 2.

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

