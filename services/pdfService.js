// services/pdfService.js
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

const generatePDF = (title, content) => {
  const doc = new PDFDocument();
  const stream = Readable.from(doc);

  doc.fontSize(20).text(title, { align: 'center' }).moveDown();

  doc.fontSize(12).text(content, {
    align: 'left',
    lineGap: 5
  });

  
  return doc;
};

module.exports = { generatePDF };
