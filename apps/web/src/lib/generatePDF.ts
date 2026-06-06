/**
 * Client-side PDF generation using html2pdf.js
 * Captures a DOM element and downloads it as a PDF — no auth token needed.
 */

export async function generatePDFFromElement(
  element: HTMLElement,
  filename: string,
  onProgress?: (msg: string) => void
): Promise<boolean> {
  try {
    onProgress?.('Loading PDF engine...');

    // Dynamic import so it only loads client-side (Next.js SSR safe)
    const html2pdf = (await import('html2pdf.js')).default;

    onProgress?.('Rendering document...');

    const opt = {
      margin: [8, 8, 8, 8], // top, right, bottom, left in mm
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    await html2pdf().set(opt as any).from(element).save();
    onProgress?.('Done!');
    return true;
  } catch (err) {
    console.error('[generatePDF] Error:', err);
    return false;
  }
}

/**
 * Convenience: find an element by ID and generate PDF from it
 */
export async function generatePDFById(
  elementId: string,
  filename: string,
  onProgress?: (msg: string) => void
): Promise<boolean> {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error(`[generatePDF] Element #${elementId} not found`);
    return false;
  }
  return generatePDFFromElement(el, filename, onProgress);
}
