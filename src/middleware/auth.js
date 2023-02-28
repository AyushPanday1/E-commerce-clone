const jwt = require('jsonwebtoken');
const {isValidId}= require('../utils/validator')
const userModel = require('../models/userModel');

const authentication = async function(req,res,next){
    try{

        let token = req.headers['authorization'];
        console.log(token)
        if(!token) return res.status(400).send({status:false,message:"Token is required!"});
        token = token.split(" ")
        console.log(token)
         jwt.verify(token[1] , "user-secret-token" , function(err , verification){
            console.log(token[1])
            if(err) return res.status(401).send({status:false,message:"Token may be expired or invalid!"})

            else req.verification = verification;

            return next();
        });

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}


const authorisation = async function(req,res,next){
    try{
        let token=req.verification.userId
        // let tokenUser=token.userId
       let userId = req.params.userId;

       if(!isValidId(userId)) return res.status(400).send({status:false,message:"ID is invalid."});

       let checkInDB = await userModel.findById(userId);

       if(!checkInDB) return res.status(404).send({status:false,message:"No related user id found In DB.(authorisation error)"})

       if(token != userId) {return res.status(403).send({status:false,message:"You are not authorised person."})};

       next();
       
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports = {authentication , authorisation}