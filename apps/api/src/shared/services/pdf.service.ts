import PDFDocument from 'pdfkit';

export class PDFService {
  public static async generatePurchaseOrderPDF(po: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Header Style (Vibrant Blue/Dark theme)
        doc.fillColor('#1E3A8A').fontSize(24).text('PURCHASE ORDER', 50, 50);
        doc.fillColor('#4B5563').fontSize(10);
        doc.text(`PO Number: ${po.poNumber}`, 50, 80);
        doc.text(`Date Created: ${new Date(po.createdAt).toLocaleDateString()}`, 50, 95);
        if (po.deliveryDate) {
          doc.text(`Expected Delivery: ${new Date(po.deliveryDate).toLocaleDateString()}`, 50, 110);
        }

        // Company / Vendor Details
        doc.fontSize(12).fillColor('#111827').text('Vendor Details', 50, 140, { underline: true });
        const vendor = po.quotation?.vendor;
        if (vendor) {
          doc.fontSize(10).fillColor('#4B5563');
          doc.text(`Company Name: ${vendor.companyName}`, 50, 160);
          doc.text(`Contact: ${vendor.contactPerson}`, 50, 175);
          doc.text(`Phone: ${vendor.phone}`, 50, 190);
          doc.text(`Address: ${vendor.address}`, 50, 205);
        }

        // Table Header
        let y = 250;
        doc.fillColor('#F3F4F6').rect(50, y, 500, 20).fill();
        doc.fillColor('#111827').fontSize(10).text('Description', 60, y + 5);
        doc.text('Qty', 300, y + 5);
        doc.text('Unit Price', 380, y + 5);
        doc.text('Total', 480, y + 5);

        // Table Items
        y += 20;
        doc.fillColor('#4B5563');
        if (po.items && Array.isArray(po.items)) {
          for (const item of po.items) {
            doc.text(item.description, 60, y + 5, { width: 220 });
            doc.text(String(item.quantity), 300, y + 5);
            doc.text(`$${Number(item.unitPrice).toFixed(2)}`, 380, y + 5);
            doc.text(`$${Number(item.totalPrice).toFixed(2)}`, 480, y + 5);
            y += 25;
          }
        }

        // Horizontal Line
        doc.moveTo(50, y + 10).lineTo(550, y + 10).strokeColor('#E5E7EB').stroke();

        // Summary
        y += 20;
        doc.fontSize(12).fillColor('#111827').text(`Total Amount: $${Number(po.totalAmount).toFixed(2)}`, 350, y, { align: 'right', width: 200 });

        if (po.terms) {
          y += 40;
          doc.fontSize(10).fillColor('#1E3A8A').text('Terms & Conditions', 50, y);
          doc.fontSize(8).fillColor('#6B7280').text(po.terms, 50, y + 15);
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  public static async generateInvoicePDF(invoice: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Header Style (Sleek Dark Slate)
        doc.fillColor('#0F172A').fontSize(24).text('INVOICE', 50, 50);
        doc.fillColor('#4B5563').fontSize(10);
        doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 80);
        doc.text(`PO Number: ${invoice.po?.poNumber}`, 50, 95);
        doc.text(`Date Created: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 110);
        doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 125);

        // Vendor Details
        doc.fontSize(12).fillColor('#111827').text('Vendor/Remit To', 50, 155, { underline: true });
        const vendor = invoice.po?.quotation?.vendor;
        if (vendor) {
          doc.fontSize(10).fillColor('#4B5563');
          doc.text(`Company Name: ${vendor.companyName}`, 50, 175);
          doc.text(`Contact: ${vendor.contactPerson}`, 50, 190);
          doc.text(`Address: ${vendor.address}`, 50, 205);
        }

        // Table Header
        let y = 250;
        doc.fillColor('#F3F4F6').rect(50, y, 500, 20).fill();
        doc.fillColor('#111827').fontSize(10).text('Description', 60, y + 5);
        doc.text('Qty', 300, y + 5);
        doc.text('Unit Price', 380, y + 5);
        doc.text('Total', 480, y + 5);

        // Table Items
        y += 20;
        doc.fillColor('#4B5563');
        if (invoice.items && Array.isArray(invoice.items)) {
          for (const item of invoice.items) {
            doc.text(item.description, 60, y + 5, { width: 220 });
            doc.text(String(item.quantity), 300, y + 5);
            doc.text(`$${Number(item.unitPrice).toFixed(2)}`, 380, y + 5);
            doc.text(`$${Number(item.totalPrice).toFixed(2)}`, 480, y + 5);
            y += 25;
          }
        }

        // Horizontal Line
        doc.moveTo(50, y + 10).lineTo(550, y + 10).strokeColor('#E5E7EB').stroke();

        // Summary
        y += 20;
        doc.fontSize(12).fillColor('#111827').text(`Total Due: $${Number(invoice.totalAmount).toFixed(2)}`, 350, y, { align: 'right', width: 200 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default PDFService;
