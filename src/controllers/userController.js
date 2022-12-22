const userModel = require("../models/userModel")
// const isValid = require("../utils/validator")
const aws = require('../aws/awsConfig')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { isValidObjectId } = require("mongoose")
// const saltRounds = 10
const {isValidRequestBody,isEmpty, isValidName,validatePhone,isValidEmail,isValidPassword,validPin,isValidStreet,isValidFile} = require('../utils/validator');


const createUser = async function (req, res) {
  try {
    let data = req.body;

    const { fname, lname, email, phone, password, address } = data;

    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "Please provide data in the request body!", })
    }

    if (!fname|| !isEmpty(fname)) {
      return res.status(400).send({ status: false, message: "First Name is required!" });
    }
    if (!isValidName(fname)) {
      return res.status(400).send({ status: false, message: "invalid First Name " })
    }

    if (!lname || !isEmpty(lname)) {
      return res.status(400).send({ status: false, message: "Last Name is required!" })
    }
    if (!isValidName(lname)) {
      return res.status(400).send({ status: false, message: "invalid Last Name " })
    }

    if (!email || !isEmpty(email)) {
      return res.status(400).send({ status: false, message: "Email is required!" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid email id" })

    }
    // ------------------------------CHECKING THE DUPLICACY OF EMAIL & PHONE NUMBER------------------------------
    let unique = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] });
    if (unique) {
      if (unique.email == email) {
        return res.status(400).send({ status: false, message: "This email address already exists, please enter a unique email address!" });
      }
    }
    if (!phone|| !isEmpty(phone)) {
      return res.status(400).send({ status: false, message: "Phone number is required!" });
    }
    if (!validatePhone(phone)) {
      return res.status(400).send({ status: false, message: "pls provide correct phone " })
    }
    if (unique) {
      if (unique.phone == phone) {
        return res.status(400).send({ status: false, message: "This phone number already exists, please enter a unique phone number!" });
      }
    }

    if (!password || !isEmpty(password)) {
      return res.status(400).send({ status: false, message: "Password is required!" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({ status: false, message: " invalid password" })
    }
    // THIS TECHNIQUE WILL AUTOMATICALLY GENERATE THE SALT & HASH
    let hashedPassword = bcrypt.hashSync(password,10)  
      data.password = hashedPassword      // STORING THE PASSWORD IN DB
      
      // if(!address|| !isEmpty(address) ){   
      //   return res.status(400).send({status: false , message:"address is mandatory"})
      // }
      
      if(address){
        const {shipping, billing} = address;    //(address.shipping= shipping)
      if(shipping){
        const {street,city,pincode} = shipping    //(address.shipping.street = street)
        if(street){
          if (!isValidStreet(address.shipping.street)) { return res.status(400).send({ status: false, message: "Invalid shipping street!" }); }


        }
      }
    }
      // if(!address.shipping.street){
      //   return res.status(400).send({status: false , message:"street is mandatory"})
      // }

    // if (address) {
    //   data.address = JSON.parse(address)
    //   if (!data.address.shipping.street)
    //     return res.status(400).send({ status: false, message: "Shipping Street is required!" });


    //   if (!data.address.shipping.city)
    //     return res.status(400).send({ status: false, message: "Shipping City is required!" });


    //   if (!data.address.shipping.pincode) {
    //     return res.status(400).send({ status: false, message: "Shipping Pincode is required!" });
    //   }
    //   if (!validPin(data.address.shipping.pincode)) {
    //     return res.status(400).send({ status: false, msg: " invalid  pincode " })
    //   }

    //   if (!data.address.billing.street)
    //     return res.status(400).send({ status: false, message: "Billing Street is required!" });

    //   if (!data.address.billing.city)
    //     return res.status(400).send({ status: false, message: "Billing City is required!" });

    //   if (!data.address.billing.pincode) {
    //     return res.status(400).send({ status: false, message: "Billing Pincode is required!" });
    //   }
    //   if (!validPin(data.address.billing.pincode)) {
    //     return res.status(400).send({ status: false, msg: " invalid  pincode " })
    //   }
    // }

    let files = req.files; //aws
    if (files && files.length > 0) {
      if (!isValidFile(files[0].originalname))
        return res.status(400).send({ status: false, message: `Enter format jpeg/jpg/png only.` });
      let uploadedFileURL = await aws.uploadFile(files[0]);

      data.profileImage = uploadedFileURL;   //assigining the file URL in request body
    } else {
      return res.status(400).send({ message: "Files are required!" });
    }
      
    const userDetails = await userModel.create(data);
    return res.status(201).send({ status: true, message: "user successfully created", data: userDetails })
  }

  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}


//////////////////////////////////////////USER LOGIN/////////////////////////////////////////////////////

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
    let findUser = await userModel.findOne({ email: email })
    if (!findUser) {
      return res.status(404).send({ status: false, message: "email or password is not correct" })
    }
    let hashPasswordDB = findUser.password
    bcrypt.compare(password, hashPasswordDB, function (err, result) {
      if (result != true) {
        return res.status(400).send({ status: false, message: "invalid password" })
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
      return res.status(200).send({ status: true, message: "user login successfully", data: finalResponse })
    })
  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}

/////////////////////////////////////////////GET USER API///////////////////////////////////////////////////



const updateUser = async function (req, res) {
  try {

      let userId = req.params.userId;
      if (!userId) return res.status(400).send({ status: false, message: "Please pass userid in params!!" })

      if (!isValidRequestBody(data) || !(isValidFile(files))) return res.status(400).send({status: false, message: "Please provide data in the request body or files!!" });


      let data = req.body;
      const { fname, lname, email, phone, password, address } = data;

      /*TAKING ALL DATA IN A KEYWORD TO REDUCE DB CALLS_______________________________ */
      const datainDB = await userModel.findById(userId);
      
      if(!datainDB) return res.status(404).send({ status: false, message: "User not found." });
      

      /*STORING THE DATA TO BE UPDATED IN EMPTY OBJECT________________________________ */
      let updateData = {};

      if (fname) {
          if (!isValidName(fname)) return res.status(400).send({ status: false, message: "Please pass valid first name!!" })

          updateData.fname = fname; 
      }

      if (lname) {
          if (!isValidName(lname)) return res.status(400).send({ status: false, message: "Please pass valid last name!!" })

          updateData.lname = lname;
      }

      if (email) {
          if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please pass valid email!!" })

          const checkEmail = await userModel.find({email:email})

          if(checkEmail) return res.status(400).send({ status: false, message: "Email already registered!!" })

          updateData.email = email;
      }

      if (phone) {
          if (!validatePhone(phone)) return res.status(400).send({ status: false, message: "Please pass valid phone!!" })

          const checkPhone = await userModel.find({phone:phone})

          if(checkPhone) return res.status(400).send({ status: false, message: "Phone number is  already registered!!" })

          updateData.phone = phone;
      }

      if (password) {
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Please pass valid password!!" })

        // data.password = await  bcrypt.hashSync(data.password,10) 
        // let hashedPassword = data.password

        let hashedPassword = await bcrypt.hashSync(password,10)

        updateData.password = hashedPassword;
      }

      if (address) {
          const { shipping, billing } = address;

          /*TAKING SHIPPING ADDRESS TO BE UPDATED____________________________________________ */
          if (shipping) {
              const { street, city, pincode } = shipping;

              if (street) {
                  if (!isValidStreet(address.shipping.street)) { return res.status(400).send({ status: false, message: "Invalid shipping street!" }); }

                  updateData["address.shipping.street"] = street}

              if (city) {
                  if (!isValidName(address.shipping.city)) {return res.status(400).send({ status: false, message: "Invalid shipping city!" });}
                  
                  updateData["address.shipping.city"] = city;}

              if (pincode) {
                  if (!validPin(address.shipping.pincode)) {return res.status(400).send({ status: false, message: "Invalid shipping pincode!" })}
                
                  updateData["address.shipping.pincode"] = pincode;}
          }

          /*TAKING BILLING ADDRESSTO BE UPDATED___________________________________________ */
          if (billing) {
              const { street, city, pincode } = billing;

              if (street) {
                  if (!isValidStreet(address.billing.street)) {return res.status(400).send({ status: false, message: "Invalid billing street!" });}
                
                  updateData["address.billing.street"] = street}

              if (city) {
                  if (!isValidName(address.billing.city)) {return res.status(400).send({ status: false, message: "Invalid billing city!" });}
               
                  updateData["address.billing.city"] = city}

              if (pincode) {
                  if (!validPin(address.billing.pincode)) {return res.status(400).send({ status: false, message: "Invalid billing pincode!" })}
                  
                  updateData["address.billing.pincode"] = pincode}
          }
      }

      const newUpdatedData = await userModel.findOneAndUpdate({_id:userId} , updateData , {new:true})

      return res.status(200).send({status: true,message: "user profile successfully updated",data: newUpdatedData});


  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }
}



const getUser = async function (req, res) {
  try {
    let userIdInParam = req.params.userId
    if (!isValidObjectId) {
      return res.status(400).send({ status: false, message: "Invalid userId!" })
    }
    let foo = req.headers.authorization
    let token = foo.split(" ")
    let decodedToken = jwt.verify(token[1], "user-secret-token")
    if (!decodedToken.userId == userIdInParam) {
      return res.status(403).send({ status: false, Message: "Forbidden!!" })
    }

    let data = await userModel.findOne({ userId: userIdInParam })
    if (!data) {
      return res.status(404).send({ status: false, message: "User not found!" })
    } else {
      return res.status(200).send({ status: true, message: "User profile dtails", data: data })
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}



module.exports = { createUser, userLogin , getUser, updateUser}
