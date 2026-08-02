export const generatePDF = async (element: HTMLElement, filename: string, orientation: 'portrait' | 'landscape' = 'portrait') => {
  if (!element) return;

  // Dynamically import libraries to avoid mixed static/dynamic import warnings
  const { default: jsPDF } = await import('jspdf');
  const { safeToJpeg: toJpeg } = await import('./safe-html-to-image');

  // Temporarily position element for better rendering
  const clone = element.cloneNode(true) as HTMLElement;

  // Process the clone to remove elements with 'no-print' and show elements with 'print:block' or similar
  clone.querySelectorAll('.no-print').forEach(el => el.remove());
  clone.querySelectorAll('*').forEach(el => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.classList && typeof htmlEl.classList.contains === 'function') {
      if (htmlEl.classList.contains('print:block')) {
        htmlEl.classList.remove('hidden');
        htmlEl.style.display = 'block';
      } else if (htmlEl.classList.contains('print:flex')) {
        htmlEl.classList.remove('hidden');
        htmlEl.style.display = 'flex';
      } else if (htmlEl.classList.contains('print:table-cell')) {
        htmlEl.classList.remove('hidden');
        htmlEl.style.display = 'table-cell';
      } else if (htmlEl.classList.contains('print:hidden')) {
        htmlEl.style.display = 'none';
      }
    }
    
    // Reset any scrollbars or max-height restrictions to ensure all rows render completely
    if (htmlEl.classList.contains('overflow-y-auto') || htmlEl.classList.contains('overflow-x-auto') || htmlEl.style.overflow === 'auto') {
      htmlEl.style.overflow = 'visible';
      htmlEl.style.overflowY = 'visible';
      htmlEl.style.overflowX = 'visible';
      htmlEl.style.maxHeight = 'none';
      htmlEl.classList.remove('overflow-y-auto', 'overflow-x-auto', 'max-h-[40vh]', 'max-h-[50vh]', 'max-h-[30vh]', 'max-h-[60vh]');
    }
  });

  const tempDiv = document.createElement("div");
  const targetWidth = orientation === 'landscape' ? "1123px" : "794px";

  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "0";
  tempDiv.style.zIndex = "-1000";
  tempDiv.style.width = targetWidth;
  tempDiv.style.minWidth = targetWidth;
  tempDiv.style.maxWidth = targetWidth;
  tempDiv.style.boxSizing = "border-box";
  tempDiv.style.overflow = "visible";
  
  clone.style.width = "100%";
  clone.style.maxWidth = "100%";
  clone.style.boxSizing = "border-box";
  
  tempDiv.appendChild(clone);
  document.body.appendChild(tempDiv);

  try {
    // We use safeToJpeg which handles CORS stylesheet issues natively
    
    // Give browser a tiny bit of time to calculate layout
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const dataUrl = await toJpeg(clone, { 
        quality: 0.98,
        backgroundColor: '#ffffff',
        pixelRatio: 2 // equivalent to scale: 2
    });
    
    const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Leave some margin
    const margin = 10;
    const availableWidth = pdfWidth - (margin * 2);
    
    // Create an image object to get its natural dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise(resolve => {
        img.onload = resolve;
    });

    const pdfHeight = (img.height * availableWidth) / img.width;
    
    pdf.addImage(dataUrl, 'JPEG', margin, margin, availableWidth, pdfHeight);
    pdf.save(filename);

  } finally {
    document.body.removeChild(tempDiv);
  }
};
