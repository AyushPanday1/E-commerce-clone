const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const userModel = require('../models/userModel');

const authentication = async function(req,res,next){
    try{

        let token = req.headers['x-auth-key'];
        if(!token) return res.status(400).send({status:false,message:"Token must be present in headers!"});

        await jwt.verify(token , "user-secret-token" , function(err , verification){
            if(err) return res.status(400).send({status:false,message:"Token may be expired or invalid!"})

            else req.verification = verification;

            return next();
        });

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}


const authorisation = async function(req,res,next){
    try{

       let id = req.params.id;

       if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"ID is invalid."});

       let checkInDB = await userModel.findById(id);

       if(!checkInDB) return res.status(404).send({status:false,message:"No related user id found In DB.(authorisation error)"})

       if(checkInDB._id != req.verification._id) return res.status(400).send({status:false,message:"You are not authorised person."});

       next();
       
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports = {authentication , authorisation}