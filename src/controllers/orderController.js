const { isValidObjectId } = require("mongoose")
const cartModel = require("../models/cartModel")
const orderModel = require("../models/ordermodel")
const userModel = require("../models/userModel")
const {isValidRequestBody, isEmpty, isValidId}=require('../utils/validator')


/**CREATE ORDER__________________________________________________________________________ */
// const createOrder=async (req,res)=>{
//     try{
//     let userId=req.params.userId
//     let user=await userModel.findOne({_id:userId})
//     if(!user){
//         return res.status(404).send({status:false, Message:"User not found"})
//     }else{
//         let cartId=req.body.cartId
//         console.log(cartId)
//         if(!isValidObjectId(cartId)){
//             return res.status(400).send({status:false, Message:"Invalid cartID"})
//         }
//         let cartDetails=await cartModel.findById(cartId)
//         if(!cartDetails){
//             return res.status(400).send({status:false, Message:"Cart not found"})
//         }else{
//         let order=await ordermodel.create(cartDetails)
//         return res.status(201).send({Status:true, Message:"Order created", data:order})
//         }
//     }} catch(error){
//         return res.status(500).send({Status:false, Message:error.message})
//     }
// }

const createOrder = async function(req,res){
  try{
    let userId = req.params.userId;
    let data = req.body;
    let cartId = data.cartId
    if(Object.keys(data).length== 0){
      return res.status(400).send({status: false, message: "body can not be empty"})
    }
    
    let findUser = await userModel.findById(userId)
    if(!findUser){
      return res.status(404).send({status: false, message: `this userId ${userId}does not exists in the DB`})
    }
    if(!cartId || !isEmpty(cartId)){
      return res.status(400).send({status: false, message: "cartId is mandatory"})
    }
    if(!isValidId(cartId)){
      return res.status(400).send({status: false, message: "invalid cartId"})
    }
    let findCart = await cartModel.findOne({_id:cartId})
    if(!findCart){
      return res.status(404).send({status: false, message: `this cartId ${cartId} does not exists in the DB`})
    }
    if(findCart.userId != userId){
      return res.status(400).send({status: false, message: "userId is not matching(you are not allowed to create this order)"})
    }
    if(findCart.items.length == 0){
      return res.status(400).send({status: false, message: "your cart is empty please add product in cart"})
    }
    let obj = {
      userId: userId,
      items: findCart.items,
      totalPrice: findCart.totalPrice,
      totalItems: findCart.totalItems,
      totalQuantity: 0,
      cancellable: true,
      status: "pending"
    }
    let count = 0
    let items = findCart.items      
    for(let i = 0; i<items.length; i++){
      count += items[i].quantity       // it will add the number of quantity in the item section
    }
     obj.totalQuantity= count
     let finalData = await orderModel.create(obj)
     let updateOrder = await cartModel.findOneAndUpdate(
      {userId: userId},
      {$set: {items:[], totalItems: 0, totalPrice: 0}}, // once order will be created then it will remove from the CART
      {new: true}
     )
     return res.status(201).send({status: true, message: "success", data: finalData})
  }
  catch(error){
    return res.status(500).send({status: false, message: error.message})
  }
}

/**UPDATE ORDER________________________________________________________________________________________ */
updateOrder = async function (req, res) {

  try {

    let userId = req.params.userId
    let data = req.body
    let { status, orderId } = data
    if (!isValidId(userId))
    return res.status(400).send({ status: false, message: "Invalid userId" });

    if (!isValidRequestBody(data))
      return res.status(400).send({status: false,message: "Please provide data body"})

    if (!isValidId(orderId))
      return res.status(400).send({ status: false, message: "Invalid orderId" })

    let orderDetails = await orderModel.findOne({_id: orderId, isDeleted: false})

    if(!orderDetails){
      return res.status(404).send({status: false, message: "This order is not present"})
    }



    if(!status)
      return res.status(400).send({status: false,message: "Please provide status"})

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).send({status: false, message: "status should be pending, completed and cancelled only"})
    }

    if (orderDetails.status === "pending") {
      if(status === "pending"){
        return res.status(400).send({status: false,message: "Order is already in pending stage"})
      }
  }

    if (orderDetails.status === "completed") {
        if(data.status === "pending"){
          return res.status(400).send({status: false,message: "Order completed cannnot set status to Pending stage"})
        }
        if(status === "completed"){
          return res.status(400).send({status: false,message: "Order is already in Completed stage"})
        }
    }

    if (orderDetails.cancellable === false){
      return res.status(400).send({ status: false, message: "Order is not cancellable" })
    } else {
      if (status === "pending") {
        return res.status(400).send({ status: false, message: "Order cancelled cannnot set status to Pending stage" })
      }
      if(orderDetails.status === "cancelled" && (status === "cancelled" || status == "completed")){
          return res.status(400).send({status: false,message: "Order is cancelled"})
        }

      let orderStatus = await orderModel.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: status } },
        { new: true }
      )

      return res.status(200).send({ status: true,message: "Success", data: orderStatus })
    }
  } 
  catch (error) {
    res.status(500).send({ status: false, error: error.message })
  }
}

  
module.exports={createOrder, updateOrder}