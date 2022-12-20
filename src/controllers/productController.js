const Usermodel = require('../models/userModel')

const updateUser = async function(req,res){
    try{

        let userId = req.params.userId;
        if(!userId) return res.status(400).send({status:false,message:"Please pass userid in params."})

        if(!isValidBody(req.body)) return res.status(400).send({status:false,message:"Please pass info to be updated."})
        let data = req.body;
        
    } catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}