const PDFDocument = require("pdfkit");
const path = require("path");

const generateCartPDF = (cartProducts, orderSummary) => {
  // Create a new PDF document with custom font
  const doc = new PDFDocument({
    margin: 50,
    font: path.join(process.cwd(), "fonts", "Arial.ttf"), // You'll need to add this font to your project
  });

  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  // Register a font family for different styles
  doc.registerFont("Arial", path.join(process.cwd(), "fonts", "Arial.ttf"));
  doc.registerFont(
    "Arial-Bold",
    path.join(process.cwd(), "fonts", "Arial_Bold.ttf")
  );

  // Set default font
  doc.font("Arial");

  // Header
  doc.fontSize(20).text("Заказ", { align: "center" });
  doc.moveDown();

  // Date
  doc.fontSize(12).text(`Дата: ${new Date().toLocaleDateString("ru-RU")}`);
  doc.moveDown();

  // Products Table
  doc.font("Arial-Bold").fontSize(14).text("Товары:", { underline: true });
  doc.font("Arial").moveDown();

  cartProducts.forEach((product, index) => {
    doc.fontSize(12).text(`${index + 1}. ${product.name}`);
    doc
      .fontSize(10)
      .text(`   Количество: ${product.cartInfo.quantity} ${product.price.unit}`)
      .text(`   Цена за единицу: ${product.cartInfo.price} ₽`)
      .text(
        `   Итого: ${(
          product.cartInfo.price * product.cartInfo.quantity
        ).toFixed(2)} ₽`
      );
    doc.moveDown();
  });

  // Order Summary
  doc.moveDown();
  doc
    .font("Arial-Bold")
    .fontSize(14)
    .text("Сводка заказа:", { underline: true });
  doc.font("Arial").moveDown();

  doc
    .fontSize(12)
    .text(`Подытог: ${orderSummary.subtotal.toFixed(2)} ₽`)
    .text(`Доставка: ${orderSummary.shipping.toFixed(2)} ₽`)
    .text(`НДС (20%): ${orderSummary.tax.toFixed(2)} ₽`)
    .font("Arial-Bold")
    .text(`Итого: ${orderSummary.total.toFixed(2)} ₽`);

  // End the document
  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
};

module.exports = generateCartPDF;
