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
const updateOrder = async function (req, res) {
    try {
      let userId = req.params.userId;
  
      if (!isValidObjectId(userId))
        return res.status(400).send({ status: false, message: "Invalid userId" });
  
      let data = req.body;
      let { status, orderId } = data;
  
      if (!isValidObjectId(orderId))
        return res.status(400).send({ status: false, message: "Invalid orderId" });
  
      let orderDetails = await ordermodel.findOne({ _id: orderId, isDeleted: false });
  
      if (!["pending", "completed", "cancelled"].includes(status)) {
        return res.status(400).send({status: false,message: "status should be from [pending, completed, cancelled]"});
      }
  
      if (orderDetails.status === "completed") {
        return res.status(400).send({status: false,message: "Order completed, now its status can not be updated"});
      }
  
      if (orderDetails.cancellable === false && status == "cancelled") {
        return res.status(400).send({ status: false, message: "Order is not cancellable" });
      } else {
        if (status === "pending") {
          return res.status(400).send({ status: false, message: "order status is already pending" });
        }
  
        let orderStatus = await ordermodel.findOneAndUpdate(
          { _id: orderId },
          { $set: { status: status } },
          { new: true }
        );
        return res.status(200).send({ status: true, message: "Success", data: orderStatus});
      }
    } catch (error) {
      res.status(500).send({ status: false, error: error.message });
    }
  };
module.exports={createOrder, updateOrder}