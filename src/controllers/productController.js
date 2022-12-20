const Usermodel = require('../models/userModel');
const {isValidRequestBody,isValidName,validatePhone,isValidEmail,isValidPassword,validPin,isValidStreet,isValidFile} = require('../utils/validator');

const updateUser = async function (req, res) {
    try {

        let userId = req.params.userId;
        if (!userId) return res.status(400).send({ status: false, message: "Please pass userid in params!!" })

        if (!isValidRequestBody(data) || !files) return res.status(400).send({status: false, message: "Please provide data in the request body or files!!" });


        let data = req.body;
        const { fname, lname, email, phone, password, address } = data;

        /*TAKING ALL DATA IN A KEYWORD TO REDUCE DB CALLS_______________________________ */
        const datainDB = await Usermodel.find();
        for(let i=0;i<datainDB.length;i++){
            if(datainDB[i]._id != userId) return res.status(404).send({ status: false, message: "User not found." });
        }

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

            for(let i=0;i<datainDB.length;i++){
                if(datainDB[i].email == email) return res.status(400).send({ status: false, message: "Email already registered!!" });
            }

            updateData.email = email;
        }

        if (phone) {
            if (!validatePhone(phone)) return res.status(400).send({ status: false, message: "Please pass valid phone!!" })

            for(let i=0;i<datainDB.length;i++){
                if(datainDB[i].phone == phone) return res.status(400).send({ status: false, message: "Phone number is already registered!!" });
            }

            updateData.phone = phone;
        }

        if (password) {
            if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Please pass valid password!!" })

            updateData.password = password;
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

        const newUpdatedData = await Usermodel.findOneAndUpdate({_id:userId} , updateData , {new:true})

        return res.status(200).send({status: true,message: "user profile successfully updated",data: newUpdatedData});


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}