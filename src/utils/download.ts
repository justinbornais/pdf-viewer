import type { PDFDocumentProxy } from 'pdfjs-dist';

/**
 * Download the PDF document
 */
export async function downloadPdf(
  pdfDocument: PDFDocumentProxy,
  filename: string = 'document.pdf'
): Promise<void> {
  try {
    const data = await pdfDocument.getData();
    const blob = new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error(`Failed to download PDF: ${error.message}`);
  }
}
