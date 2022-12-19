const userModel = require("../models/userModel")
const isValid = require("../utils/validator")
const config = require('../utils/awsConfig')



const createUser = async function (req, res) {
    try {
      let data = req.body;
  
      const { fname, lname, email,profileImage, phone, password, address } = data;
  
      if (!isValid.isValidRequestBody(data)) {
        return res.status(400).send({   status: false, message: "Please provide data in the request body!", })
     }
  
      if (!fname){
        return res .status(400).send({ status: false, message: "First Name is required!" });
      }
      if(!isValid.isValidName(fname)){
        return res.status(400).send({ status: false, message: "invalid First Name " })
      }
  
      if (!lname){
        return res  .status(400) .send({ status: false, message: "Last Name is required!" })
      }
      if(!isValid.isValidName(lname)){
        return res.status(400).send({ status: false, message: "invalid Last Name " })
      }
    
      if (!email){
        return res .status(400).send({ status: false, message: "Email is required!" });
      }
      if (!isValid.isValidEmail(email)) {
        return res.status(400).send({ status: false, message: "Invalid email id" })

    }
      let userEmail = await userModel.findOne({ email: email });
      if (userEmail)
        return res.status(401).send({ status: false, message: "This email address already exists, please enter a unique email address!" });
  
      if (!phone){
        return res .status(400).send({ status: false, message: "Phone number is required!" });
      }
      if (!isValid.validatePhone(phone)) {
        return res.status(400).send({ status: false, message: "pls provide correct phone " })
    }
      let userNumber = await userModel.findOne({ phone: phone });
      if (userNumber)
        return res.status(409).send({ status: false, message: "This phone number already exists, please enter a unique phone number!" });
  
      if (!password){
        return res .status(400).send({ status: false, message: "Password is required!" });
      }
      if (!isValid.isValid(password)) {
        return res.status(400).send({ status: false, message: " pls provide password" })
    }
  
      if (!address.shipping.street)
        return res.status(400).send({ status: false, message: "Shipping Street is required!" });
     
  
      if (!address.shipping.city)
        return res.status(400).send({ status: false, message: "Shipping City is required!" });
    
  
      if (!address.shipping.pincode){
        return res .status(400).send({ status: false, message: "Shipping Pincode is required!" });
      }
      if (!isValid.validPin(address.shipping.pincode)) {
        return res.status(400).send({ status: false, msg: " invalid  pincode " })
    }
  
      if (!address.billing.street)
        return res .status(400).send({ status: false, message: "Billing Street is required!" });
   
      if (!address.billing.city)
   return res.status(400) .send({ status: false, message: "Billing City is required!" });
    
      if (!address.billing.pincode){
        return res.status(400).send({ status: false, message: "Billing Pincode is required!" });
      }
      if (!isValid.validPin(address.billing.pincode)) {
        return res.status(400).send({ status: false, msg: " invalid  pincode " })
    }
     
    profileImage = await config.uploadFile(files[0]); //uploading image to AWS
      const userDetails = await userModel.create(data);
      return res.status(201).send({status: true, message: "user successfully created", data: userDetails})
    } 

    catch (error) {
     return res.status(500).send({ message: error.message });
    }
  }


  module.exports={createUser}