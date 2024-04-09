const express = require("express");
const Enquiry = require("./enquiryModel");
const router = express.Router();
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD 
  }
});

// create user
router.post("/create-enquiry", async (req, res, next) => {
  try {
    const { companyName, email, phone, pic } = req.body;
   const  newEnquiry = await Enquiry.create({
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
      
        PIC: ${pic}
      
        Email: ${email}
        ============================

        Fighting!!!
        `, 
      });
    res.send({"status": 201, "message": newEnquiry})
  } catch (error) {
    return res.send({"status": 500, "message": "Internal server error"});
  }
});


module.exports = router;