const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateCertificate = (studentName, courseTitle, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const filePath = path.join(outputPath, `${studentName}-${courseTitle}.pdf`);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Certificate Title
    doc
      .fontSize(28)
      .text("Certificate of Completion", { align: "center" })
      .moveDown(2);

    // Student Name
    doc
      .fontSize(22)
      .text(`${studentName}`, { align: "center", underline: true })
      .moveDown(1);

    // Course Title
    doc
      .fontSize(18)
      .text(`has successfully completed the course:`, { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(20)
      .text(`${courseTitle}`, { align: "center", underline: true })
      .moveDown(2);

    // Date
    doc
      .fontSize(14)
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });

    doc.end();

    writeStream.on("finish", () => {
      resolve(filePath);
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = generateCertificate;
