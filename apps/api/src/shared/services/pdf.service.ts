import PDFDocument from 'pdfkit';

const BRAND_TEAL = '#14B8A6';
const BRAND_DARK = '#0F172A';
const BRAND_GRAY = '#64748B';
const BRAND_LIGHT = '#F8FAFC';
const BRAND_BORDER = '#E2E8F0';

function drawPageHeader(doc: PDFKit.PDFDocument, docType: string, docNumber: string) {
  // Background accent bar
  doc.rect(0, 0, 595.28, 8).fill(BRAND_TEAL);

  // Brand logo area
  doc.roundedRect(50, 25, 44, 44, 8).fill(BRAND_TEAL);
  doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold').text('VB', 58, 35);

  // Company name
  doc.fillColor(BRAND_DARK).fontSize(16).font('Helvetica-Bold').text('VendorBridge', 104, 28);
  doc.fillColor(BRAND_GRAY).fontSize(8).font('Helvetica').text('ENTERPRISE OS  ·  PROCUREMENT PLATFORM', 104, 48);

  // Document type badge (right side)
  const badgeX = 595.28 - 50 - 160;
  doc.rect(badgeX, 25, 160, 44).fill(BRAND_DARK).roundedRect(badgeX, 25, 160, 44, 6).fill(BRAND_DARK);
  doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(docType, badgeX + 10, 31, { width: 140, align: 'center' });
  doc.fillColor(BRAND_TEAL).fontSize(10).font('Helvetica-Bold').text(docNumber, badgeX + 10, 49, { width: 140, align: 'center' });

  // Separator line
  doc.moveTo(50, 82).lineTo(545.28, 82).strokeColor(BRAND_TEAL).lineWidth(1.5).stroke();
}

function drawInfoBlock(doc: PDFKit.PDFDocument, x: number, y: number, label: string, value: string, width = 110) {
  doc.fillColor(BRAND_GRAY).fontSize(7).font('Helvetica').text(label.toUpperCase(), x, y, { width });
  doc.fillColor(BRAND_DARK).fontSize(9).font('Helvetica-Bold').text(value, x, y + 11, { width });
}

function drawAddressBlock(doc: PDFKit.PDFDocument, x: number, y: number, title: string, lines: string[]) {
  doc.fillColor(BRAND_TEAL).fontSize(7).font('Helvetica-Bold').text(title.toUpperCase(), x, y, { characterSpacing: 0.5 });
  doc.moveTo(x, y + 10).lineTo(x + 175, y + 10).strokeColor(BRAND_TEAL).lineWidth(0.5).stroke();
  doc.fillColor(BRAND_DARK).fontSize(9).font('Helvetica-Bold').text(lines[0] ?? '', x, y + 16);
  doc.fillColor(BRAND_GRAY).fontSize(8.5).font('Helvetica');
  lines.slice(1).forEach((line, i) => {
    doc.text(line, x, y + 28 + i * 13);
  });
}

function drawItemsTable(doc: PDFKit.PDFDocument, items: any[], startY: number): number {
  const colX = { desc: 60, qty: 310, unit: 380, total: 480 };
  const tableWidth = 485;

  // Header
  doc.rect(50, startY, tableWidth, 22).fill('#1E293B');
  doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold');
  doc.text('ITEM DESCRIPTION', colX.desc, startY + 7);
  doc.text('QTY', colX.qty, startY + 7);
  doc.text('UNIT PRICE', colX.unit, startY + 7);
  doc.text('AMOUNT', colX.total, startY + 7);

  let y = startY + 22;
  doc.font('Helvetica').fontSize(9);

  (items ?? []).forEach((item, idx) => {
    const rowH = 22;
    if (idx % 2 === 0) {
      doc.rect(50, y, tableWidth, rowH).fill(BRAND_LIGHT);
    }
    doc.fillColor(BRAND_DARK).text(item.description ?? item.name ?? '—', colX.desc, y + 7, { width: 240 });
    doc.fillColor(BRAND_GRAY).text(String(item.quantity ?? item.qty ?? 1), colX.qty, y + 7);
    doc.text(`₹${Number(item.unitPrice ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, colX.unit, y + 7);
    doc.fillColor(BRAND_DARK).font('Helvetica-Bold')
      .text(`₹${Number(item.totalPrice ?? (item.quantity ?? 1) * (item.unitPrice ?? 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, colX.total, y + 7);
    doc.font('Helvetica');
    y += rowH;
  });

  // Bottom border
  doc.moveTo(50, y).lineTo(50 + tableWidth, y).strokeColor(BRAND_BORDER).lineWidth(1).stroke();
  return y;
}

function drawTotalsBlock(doc: PDFKit.PDFDocument, y: number, subtotal: number, taxPct: number, total: number) {
  const x = 360;
  const w = 175;
  y += 12;

  const row = (label: string, value: string, bold = false) => {
    doc.fillColor(BRAND_GRAY).fontSize(9).font('Helvetica').text(label, x, y, { width: w });
    doc.fillColor(BRAND_DARK).font(bold ? 'Helvetica-Bold' : 'Helvetica').text(value, x, y, { width: w, align: 'right' });
    y += 16;
  };

  row('Subtotal', `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  row(`GST (${taxPct}%)`, `₹${(subtotal * taxPct / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  doc.moveTo(x, y).lineTo(x + w, y).strokeColor(BRAND_TEAL).lineWidth(1).stroke();
  y += 6;

  // Grand total box
  doc.rect(x, y, w, 26).fill(BRAND_DARK);
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold')
    .text('TOTAL DUE', x + 8, y + 8)
    .text(`₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, x, y + 8, { width: w - 8, align: 'right' });
  return y + 40;
}

function drawPageFooter(doc: PDFKit.PDFDocument) {
  const pageH = doc.page.height;
  doc.rect(0, pageH - 40, 595.28, 40).fill('#F1F5F9');
  doc.fillColor(BRAND_GRAY).fontSize(7.5).font('Helvetica')
    .text('VendorBridge Enterprise OS  ·  Generated electronically — no signature required.', 50, pageH - 27, { width: 495.28, align: 'center' });
  doc.fillColor(BRAND_TEAL).fontSize(7.5)
    .text(`Generated on ${new Date().toLocaleString('en-IN')}`, 50, pageH - 16, { width: 495.28, align: 'center' });
}

export class PDFService {
  public static async generatePurchaseOrderPDF(po: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 0, size: 'A4' });
        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        drawPageHeader(doc, 'PURCHASE ORDER', po.poNumber ?? 'PO-XXXX');

        // Document metadata row
        const metaY = 95;
        drawInfoBlock(doc, 50, metaY, 'Issue Date', new Date(po.createdAt ?? Date.now()).toLocaleDateString('en-IN'));
        drawInfoBlock(doc, 175, metaY, 'Status', po.status ?? 'SENT');
        if (po.deliveryDate) drawInfoBlock(doc, 300, metaY, 'Req. Delivery', new Date(po.deliveryDate).toLocaleDateString('en-IN'));

        // Separator
        doc.moveTo(50, metaY + 36).lineTo(545.28, metaY + 36).strokeColor(BRAND_BORDER).lineWidth(0.5).stroke();

        // Address blocks
        const addrY = metaY + 48;
        const vendor = po.quotation?.vendor ?? po.vendor ?? {};
        drawAddressBlock(doc, 50, addrY, 'Vendor / Supplier', [
          vendor.companyName ?? 'N/A',
          vendor.address ?? '',
          vendor.contactPerson ? `${vendor.contactPerson} (${vendor.email ?? ''})` : vendor.email ?? '',
        ]);
        drawAddressBlock(doc, 350, addrY, 'Ship To / Bill To', [
          'VendorBridge Corporation',
          '123 Enterprise Way, Tech District',
          'San Francisco, CA 94105',
          'Attn: Receiving Department',
        ]);

        // Items table
        const items = po.items ?? po.quotation?.items ?? [];
        const tableY = addrY + 90;
        const afterTable = drawItemsTable(doc, items, tableY);

        // Totals
        const subtotal = Number(po.totalAmount ?? 0);
        drawTotalsBlock(doc, afterTable, subtotal, 18, subtotal * 1.18);

        // Terms
        if (po.terms) {
          doc.fillColor(BRAND_GRAY).fontSize(8).font('Helvetica-Bold').text('TERMS & CONDITIONS', 50, afterTable + 16);
          doc.fillColor(BRAND_GRAY).fontSize(8).font('Helvetica').text(po.terms, 50, afterTable + 28, { width: 290 });
        }

        drawPageFooter(doc);
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  public static async generateInvoicePDF(invoice: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 0, size: 'A4' });
        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        drawPageHeader(doc, 'TAX INVOICE', invoice.invoiceNumber ?? 'INV-XXXX');

        // Meta row
        const metaY = 95;
        drawInfoBlock(doc, 50, metaY, 'Invoice Date', new Date(invoice.createdAt ?? Date.now()).toLocaleDateString('en-IN'));
        drawInfoBlock(doc, 175, metaY, 'PO Reference', invoice.po?.poNumber ?? invoice.purchaseOrderId ?? '—');
        drawInfoBlock(doc, 300, metaY, 'Due Date', invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : '30 days net');
        drawInfoBlock(doc, 430, metaY, 'Status', invoice.status ?? 'PENDING');

        doc.moveTo(50, metaY + 36).lineTo(545.28, metaY + 36).strokeColor(BRAND_BORDER).lineWidth(0.5).stroke();

        // Address blocks
        const addrY = metaY + 48;
        const vendor = invoice.po?.quotation?.vendor ?? invoice.vendor ?? {};
        drawAddressBlock(doc, 50, addrY, 'From / Remit To', [
          vendor.companyName ?? 'Vendor',
          vendor.address ?? '',
          vendor.email ?? '',
        ]);
        drawAddressBlock(doc, 350, addrY, 'Bill To', [
          'VendorBridge Corporation',
          '123 Enterprise Way, Tech District',
          'San Francisco, CA 94105',
          'accounts@vendorbridge.com',
        ]);

        // Items
        const items = invoice.items ?? invoice.po?.items ?? [];
        const tableY = addrY + 90;
        const afterTable = drawItemsTable(doc, items, tableY);

        // Totals
        const subtotal = Number(invoice.totalAmount ?? 0);
        drawTotalsBlock(doc, afterTable, subtotal, 18, subtotal * 1.18);

        // Payment note
        doc.fillColor(BRAND_GRAY).fontSize(8).font('Helvetica-Bold').text('PAYMENT INSTRUCTIONS', 50, afterTable + 16);
        doc.fillColor(BRAND_GRAY).fontSize(8).font('Helvetica').text(
          'Bank Transfer to: VendorBridge Corp · Account: 1234-5678-9012 · IFSC: VBKB0001234',
          50, afterTable + 28, { width: 290 }
        );

        drawPageFooter(doc);
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default PDFService;
