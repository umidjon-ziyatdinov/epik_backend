const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  companyName:{
    type: String,
    required: [true, "Please enter company name!"],
  },
  email:{
    type: String,
    required: [true, "Please enter your email!"],
  },
  pic:{
    type: String,
    required: [true, "Please enter your name"],
  },
  phone:{
    type: String,
    required: [true, "Please enter your number"],
  },

 
 createdAt:{
  type: Date,
  default: Date.now(),
 }
});


module.exports = mongoose.model("Enquiry", enquirySchema);