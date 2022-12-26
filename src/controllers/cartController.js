const cartModel = require('../models/cartModel')
let {isValidObjectId} = require('mongoose');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel')
let {isValidId, isValidInstallments} = require('../utils/validator')



const createCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body;
        let { totalPrice, totalItems, cartId ,productId, quantity } = data
        if(Object.keys(data).length== 0){
            return res.status(400).send({ status: false, message:"body can not be empty" })
        }
         if(!isValidId(userId)){
            return res.status(400).send({ status: false, message:"invalid userId" })
         }
         let findUser = await userModel.findById(userId)
         if (!findUser) {
           return res.status(404).send({ status: false, message: `User with this Id ${userId} doesn't exist` })
         }
         if(!productId){
        return res.status(400).send({ status: false, message:"productId is mandatory" })
         }
         if(!isValidId(productId)){
            return res.status(400).send({ status: false, message:"please provide a valid productId" })
         }
         let findProduct = await productModel.findOne({_id: productId, isDeleted: false})
         if(!findProduct){
            return res.status(400).send({ status: false, message:`product with this ID ${productId}does not exist` })
         }
         if(!quantity){
            quantity = 1  // MINIMUM QUANTITY 1 || ATLEAST 1 QUANTITY MUST BE PRESENT
         }
         quantity = JSON.parse(quantity)
         if(quantity || quantity == ''){
            if(!isValidInstallments(quantity)){
                return res.status(400).send({ status: false, message: "Quantity is not Valid" })
            }
         }
         if (cartId || cartId == '') {
            if (!isValidId(cartId)) {
                return res.status(400).send({ status: false, message: "Cart id is not Valid" })
            }
        }
        let findUserCart = await cartModel.findOne({userId: userId})
        if(!findUserCart){
        let createData = {
           userId,
           items: [{productId: productId, quantity: quantity}],
           totalPrice: (findProduct.price * quantity).toFixed(2),    // toFixes()= how many digits would be there after the decimals  
           totalItems: 1
        }
         let newCart = await cartModel.create(createData);
         return res.status(201).send({status: false, message: "success", data: newCart})
    }
    
    if (findUserCart) {
        if (!cartId) {
          return res.status(400).send({ status: false, message: "Please provide cart id to add items in the cart" })
      }
      if (findUserCart._id.toString() !== cartId) {
        return res.status(400).send({ status: false, message: "Cart id is not matching" })
    }
    
}
        
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCart }