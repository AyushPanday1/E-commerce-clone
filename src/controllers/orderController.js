const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

const userLogin = async function(req,res){
    let data = req.body
let {email, password} = data
if(Object.keys(data).length == 0){
    res.status(400).send({status : false, message: "body can not be empty"})
}
let findUser = await userModel.findOne({email : email, password : password})
if(!findUser){
    return res.status(400).send({status : false , message : "email or password is not correct"})
}
let createToken = jwt.sign(
    {
    userId : findUser.id.toString(),
},"user-secret-token",{expiresIn : "30m"});

res.setHeader('x-auth-key', createToken)
let finalResponse = {
userId: findUser.id,
token: createToken
}
return res.status(201).send({status : true, message: "user login successfully",data:finalResponse ,tokenCreatedAt : new Date()})


}


module.exports.userLogin = userLogin