import PDFDocument from "pdfkit";

export function buildInvoicePdf(order: any) {
  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(18).text("FixOnWheels - Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice for Order: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  if (order.user) {
    doc.text(`Customer: ${order.user.name || ""}`);
    doc.text(`Email: ${order.user.email || ""}`);
    doc.moveDown();
  }

  doc.fontSize(13).text("Items", { underline: true });
  doc.moveDown(0.5);

  (order.items || []).forEach((it: any, idx: number) => {
    doc
      .fontSize(11)
      .text(
        `${idx + 1}. ${it.title}  |  Qty: ${it.qty}  |  Price: Rs. ${it.price}  |  Sub: Rs. ${
          it.price * it.qty
        }`
      );
    if (it.model || it.color) {
      doc.text(`   Model: ${it.model || "-"}  |  Color: ${it.color || "-"}`);
    }
    doc.moveDown(0.3);
  });

  doc.moveDown();
  doc.fontSize(12).text(`Total: Rs. ${order.total}`, { align: "right" });

  doc.moveDown();
  doc.fontSize(10).text("Thank you for shopping with FixOnWheels!", {
    align: "center",
  });

  return doc;
}