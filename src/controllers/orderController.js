const { isValidObjectId } = require("mongoose")
const cartModel = require("../models/cartModel")
const ordermodel = require("../models/ordermodel")
const userModel = require("../models/userModel")

const createOrder=async (req,res)=>{
    try{
    let userId=req.params.userId
    let user=await userModel.findOne({_id:userId})
    if(!user){
        return res.status(404).send({status:false, Message:"User not found"})
    }else{
        let cartId=req.body.cartId
        console.log(cartId)
        if(!isValidObjectId(cartId)){
            return res.status(400).send({status:false, Message:"Invalid cartID"})
        }
        let cartDetails=await cartModel.findById(cartId)
        if(!cartDetails){
            return res.status(400).send({status:false, Message:"Cart not found"})
        }else{
        let order=await ordermodel.create(cartDetails)
        return res.status(201).send({Status:true, Message:"Order created", data:order})
        }
    }} catch(error){
        return res.status(500).send({Status:false, Message:error.message})
    }
}
module.exports={createOrder}