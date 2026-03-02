import { pdfjsLib } from '../config/pdfjs';
import type { PDFDocumentProxy } from 'pdfjs-dist';

/**
 * Load a PDF from a URL
 */
export async function loadPdfFromUrl(url: string): Promise<PDFDocumentProxy> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      url,
      withCredentials: false,
    });
    return await loadingTask.promise;
  } catch (error: any) {
    if (error.name === 'MissingPDFException' || error.message?.includes('CORS')) {
      throw new Error(
        'Unable to load PDF due to CORS restrictions. Please download the PDF and upload it manually.'
      );
    }
    throw new Error(`Failed to load PDF: ${error.message}`);
  }
}

/**
 * Load a PDF from a File object
 */
export async function loadPdfFromFile(file: File): Promise<PDFDocumentProxy> {
  // Validate file type
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    throw new Error('Invalid file type. Please select a PDF file.');
  }

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target!.result as ArrayBuffer);
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        resolve(pdf);
      } catch (error: any) {
        reject(new Error(`Failed to load PDF: ${error.message}`));
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
}
