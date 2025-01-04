const express = require("express");
const Enquiry = require("./enquiryModel");
const router = express.Router();
const nodemailer = require("nodemailer");

const generateCartPDF = require("../utils/generatePDF");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// create user
router.post("/create-enquiry", async (req, res, next) => {
  try {
    const { companyName, email, phone, pic } = req.body;
    const newEnquiry = await Enquiry.create({
      companyName,
      email,
      phone,
      pic,
    });
    let info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: "uziyatdinov@gmail.com, bekdevs01@gmail.com",
      subject: "New Enquiry",
      text: `A new enquiry has been created by ${companyName}.

        DETAILS:
        ============================
        Company Name: ${companyName}
      
        phone: ${phone}
      
      
        Email: ${email}
        ============================


        `,
    });
    res.send({ status: 201, message: newEnquiry });
  } catch (error) {
    return res.send({ status: 500, message: "Internal server error" });
  }
});

// POST route for checkout
router.post("/checkout", async (req, res) => {
  try {
    const { cartProducts, orderSummary } = req.body;

    // Generate PDF
    const pdfBuffer = await generateCartPDF(cartProducts, orderSummary);

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "uziyatdinov@gmail.com",
      subject: "Новый заказ",
      html: `
              <h2>Новый заказ получен</h2>
              <p>Дата: ${new Date().toLocaleDateString("ru-RU")}</p>
              <h3>Сводка заказа:</h3>
              <ul>
                  <li>Подытог: ${orderSummary.subtotal.toFixed(2)} ₽</li>
                  <li>Доставка: ${orderSummary.shipping.toFixed(2)} ₽</li>
                  <li>НДС (20%): ${orderSummary.tax.toFixed(2)} ₽</li>
                  <li>Итого: ${orderSummary.total.toFixed(2)} ₽</li>
              </ul>
              <h3>Товары:</h3>
              <ul>
                  ${cartProducts
                    .map(
                      (product) => `
                      <li>
                          ${product.name} - ${product.cartInfo.quantity} ${
                        product.price.unit
                      }
                          (${(
                            product.cartInfo.price * product.cartInfo.quantity
                          ).toFixed(2)} ₽)
                      </li>
                  `
                    )
                    .join("")}
              </ul>
          `,
      attachments: [
        {
          filename: "order.pdf",
          content: pdfBuffer,
        },
      ],
    });

    // Return PDF buffer for client download
    res.status(200).json({
      success: true,
      pdfBuffer: pdfBuffer.toString("base64"),
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
module.exports = router;
