const userModel = require("../models/userModel")


const {uploadFile}=require('../aws/awsConfig')
const aws = require('aws-sdk')
const bcrypt = require('bcrypt')


const { isValidRequestBody, isEmpty, isValidName, validatePhone, isValidEmail, isValidPassword, validPin, isValidStreet, isValidFile } = require('../utils/validator');



module.exports.user = async function(req,res){
try{
    let files = req.files
    let data=req.body
   
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "request body can't be empty" })
    }
    if(files && files.length>0) {
      let uploadFileUrl = await uploadFile(files[0])
      data.profileImage = uploadFileUrl
    }
 
    if(data.address){
      data.address=JSON.parse(data.address)
      
    }

  let { fname, lname, email, profileImage, phone, password, address } = data
  
  if (!fname) {
    return res.status(400).send({ status: false, message: "fname is required" })
  }
  if (!isValidName(fname)) {
    return res.status(400).send({ status: false, message: "fname is not valid" })
  }
  if (!lname) {
    return res.status(400).send({ status: false, message: "lname is required" })
  }
  if (!isValidName(lname)) {
    return res.status(400).send({ status: false, message: "lname is not valid" })
  }
  if (!email) {
    return res.status(400).send({ status: false, message: "email is required" })
  }
  if (!isValidEmail(email)) {
    return res.status(400).send({ status: false, message: "email is not valid" })
  }
  const findEmail = await userModel.findOne({email : email})
  if(findEmail) {
    return res.status(400).send({status : false, message : "email is already exist"})
  }
  if (!profileImage) {
    return res.status(400).send({ status: false, message: "profileImage is required" })
  }
  if (!phone) {
    return res.status(400).send({ status: false, message: "phone number is required" })
  }
  if (!isValidMobile(phone)) {
    return res.status(400).send({ status: false, message: "phone number is not valid" })
  }
  const findPhone = await userModel.findOne({phone : phone})
  if(findPhone) {
    return res.status(400).send({status : false, message : "phone number is already exist"})
  }
  if (!password) {
    return res.status(400).send({ status: false, message: "password is required" })
  }
  if (!isValidPassword(password)) {
    return res.status(400).send({ status: false, message: "password is not valid" })
  }
  let hashedPassword = bcrypt.hashSync(password , 10)
  data.password=hashedPassword
  if (!address) {
    return res.status(400).send({ status: false, message: "address is required" })
  }
  if (address) {
    const { shipping, billing } = address
    if (shipping) {
      const { street, city, pincode } = shipping
      if (street) {
        if (!isValidName(street) ) {
          return res.status(400).send({ status: false, message: "please enter valid street name" })
        }
      }
      if (city) {
        if (!isValidName(city)) {
          return res.status(400).send({ status: false, message: "please enter valid city name" })
        }
      }
      if (pincode) {
        if (!validPin(pincode)) {
          return res.status(400).send({ status: false, message: "please enter valid pincode" })
        }
      }
    }
    if (billing) {
      const { street, city, pincode } = billing
      if (street) {
        if (!isValidName(street) ) {
          return res.status(400).send({ status: false, message: "please enter valid street name" })
        }
      }
      if (city) {
        if (!isValidName(city) ) {
          return res.status(400).send({ status: false, message: "please enter valid city name" })
        }
      }
      if (pincode) {
        if (!validPin(pincode)) {
          return res.status(400).send({ status: false, message: "please enter valid pincode" })
        }
      }
    }
  }
  
  const userCreate = await userModel.create(data)
  return res.status(201).send({status : true , message : "data created succesfully" , data : userCreate})
}
catch(err) {
  return res.status(500).send({status : false, message : err.message})
}
}
