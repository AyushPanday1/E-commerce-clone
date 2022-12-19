const userModel = require("../models/userModel")
const isValid = require("../utils/validator")
const aws = require('../aws/awsConfig')
const config = require('../utils/awsConfig')
const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const saltRounds = 10

let { isValidEmail, isValidPassword } = isValid

const createUser = async function (req, res) {
  try {
      let data = req.body;

      const { fname, lname, email, phone, password, address } = data;

      if (!isValid.isValidRequestBody(data)) {
          return res.status(400).send({ status: false, message: "Please provide data in the request body!", })
      }

      if (!fname) {
          return res.status(400).send({ status: false, message: "First Name is required!" });
      }
      if (!isValid.isValidName(fname)) {
          return res.status(400).send({ status: false, message: "invalid First Name " })
      }

      if (!lname) {
          return res.status(400).send({ status: false, message: "Last Name is required!" })
      }
      if (!isValid.isValidName(lname)) {
          return res.status(400).send({ status: false, message: "invalid Last Name " })
      }

      if (!email) {
          return res.status(400).send({ status: false, message: "Email is required!" });
      }
      if (!isValid.isValidEmail(email)) {
          return res.status(400).send({ status: false, message: "Invalid email id" })
  try {
    let data = req.body;
    let files = req.files


    const { fname, lname, email, profileImage, phone, password, address } = data;

    if (!isValid.isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "Please provide data in the request body!", })
    }

    if (!fname) {
      return res.status(400).send({ status: false, message: "First Name is required!" });
    }
    if (!isValid.isValidName(fname)) {
      return res.status(400).send({ status: false, message: "invalid First Name " })
    }

    if (!lname) {
      return res.status(400).send({ status: false, message: "Last Name is required!" })
    }
    if (!isValid.isValidName(lname)) {
      return res.status(400).send({ status: false, message: "invalid Last Name " })
    }

    if (!email) {
      return res.status(400).send({ status: false, message: "Email is required!" });
    }
    if (!isValid.isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid email id" })

      }
      let userEmail = await userModel.findOne({ email: email });
      if (userEmail)
          return res.status(401).send({ status: false, message: "This email address already exists, please enter a unique email address!" });

      if (!phone) {
          return res.status(400).send({ status: false, message: "Phone number is required!" });
      }
      if (!isValid.validatePhone(phone)) {
          return res.status(400).send({ status: false, message: "pls provide correct phone " })
      }
      let userNumber = await userModel.findOne({ phone: phone });
      if (userNumber)
          return res.status(409).send({ status: false, message: "This phone number already exists, please enter a unique phone number!" });

      if (!password) {
          return res.status(400).send({ status: false, message: "Password is required!" });
      }
      // if (!isValid.isValidPassword(password)) {
      //     return res.status(400).send({ status: false, message: " pls provide password" })
      // }

      if(address){
    data.address=JSON.parse(address)
      if (!data.address.shipping.street)
          return res.status(400).send({ status: false, message: "Shipping Street is required!" });


      if (!data.address.shipping.city)
          return res.status(400).send({ status: false, message: "Shipping City is required!" });


      if (!data.address.shipping.pincode) {
          return res.status(400).send({ status: false, message: "Shipping Pincode is required!" });
      }
      if (!isValid.validPin(data.address.shipping.pincode)) {
          return res.status(400).send({ status: false, msg: " invalid  pincode " })
      }

      if (!data.address.billing.street)
          return res.status(400).send({ status: false, message: "Billing Street is required!" });

      if (!data.address.billing.city)
          return res.status(400).send({ status: false, message: "Billing City is required!" });

      if (!data.address.billing.pincode) {
          return res.status(400).send({ status: false, message: "Billing Pincode is required!" });
      }
      if (!isValid.validPin(data.address.billing.pincode)) {
          return res.status(400).send({ status: false, msg: " invalid  pincode " })
      }
      }

      let files = req.files; //aws
      if (files && files.length > 0) {
        if (!isValid.isValidFile(files[0].originalname))
          return res
            .status(400)
            .send({ status: false, message: `Enter format jpeg/jpg/png only.` });
  
        let uploadedFileURL = await aws.uploadFile(files[0]);
  
        data.profileImage = uploadedFileURL;
      } else {
        return res.status(400).send({ message: "Files are required!" });
      }

      const userDetails = await userModel.create(data);
      return res.status(201).send({ status: true, message: "user successfully created", data: userDetails })
  }
    }
    let userEmail = await userModel.findOne({ email: email });
    if (userEmail)
      return res.status(400).send({ status: false, message: "This email address already exists, please enter a unique email address!" });

    if (!phone) {
      return res.status(400).send({ status: false, message: "Phone number is required!" });
    }
    if (!isValid.validatePhone(phone)) {
      return res.status(400).send({ status: false, message: "pls provide correct phone " })
    }
    let userNumber = await userModel.findOne({ phone: phone });
    if (userNumber)
      return res.status(400).send({ status: false, message: "This phone number already exists, please enter a unique phone number!" });

    if (!password) {
      return res.status(400).send({ status: false, message: "Password is required!" });
    }
    //   if (!isValid.isValidPassword(password)) {
    //     return res.status(400).send({ status: false, message: " pls provide password" })
    // }

    //       if (!address.shipping.street)
    //         return res.status(400).send({ status: false, message: "Shipping Street is required!" });


    //       if (!address.shipping.city)
    //         return res.status(400).send({ status: false, message: "Shipping City is required!" });


    //       if (!address.shipping.pincode){
    //         return res .status(400).send({ status: false, message: "Shipping Pincode is required!" });
    //       }
    //       if (!isValid.validPin(address.shipping.pincode)) {
    //         return res.status(400).send({ status: false, msg: " invalid  pincode " })
    //     }

    //       if (!address.billing.street)
    //         return res .status(400).send({ status: false, message: "Billing Street is required!" });

    //       if (!address.billing.city)
    //    return res.status(400) .send({ status: false, message: "Billing City is required!" });

    //       if (!address.billing.pincode){
    //         return res.status(400).send({ status: false, message: "Billing Pincode is required!" });
    //       }
    //       if (!isValid.validPin(address.billing.pincode)) {
    //         return res.status(400).send({ status: false, msg: " invalid  pincode " })
    //}

    //profileImage = await config.uploadFile(files[0]); //uploading image to AWS
    //if(files && files.length>0){
    //upload to s3 and get the uploaded link
    // res.send the link back to frontend/postman
    let uploadedFileURL = await config.uploadFile(files[0])
    data.profileImage = uploadedFileURL


    // const encryptedPassword = await bcrypt.hash(password,saltRounds) //encrypting password by using bcrypt.


    const userDetails = await userModel.create(data);
    return res.status(201).send({ status: true, message: "user successfully created", data: userDetails })
  }

  catch (error) {
      return res.status(500).send({ message: error.message });
  }
}
  

  module.exports={createUser}
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
////////////////////////////////LOGIN USER///////////////////////////////////////////////////////////////////

const userLogin = async function (req, res) {
  try {
    let data = req.body
    let { email, password } = data
    if (Object.keys(data).length == 0) {
      res.status(400).send({ status: false, message: "body can not be empty" })
    }
    if (!email || !password) {
      return res.status(400).send({ status: false, message: "email and password is mandatory" })
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "please enter a valid email address" })
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({ status: false, message: "password must be from length 8-15 characters " })
    }
    let findUser = await userModel.findOne({ email: email, password: password })
    if (!findUser) {
      return res.status(404).send({ status: false, message: "email or password is not correct" })
    }
    let createToken = jwt.sign(
      {
        userId: findUser.id.toString(),
      }, "user-secret-token", { expiresIn: "30m" });

    res.setHeader('x-auth-key', createToken)
    let finalResponse = {
      userId: findUser.id,
      token: createToken
    }
    return res.status(201).send({ status: true, message: "user login successfully", data: finalResponse })
  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}


module.exports = { createUser, userLogin }