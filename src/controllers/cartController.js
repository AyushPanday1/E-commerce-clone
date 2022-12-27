const cartModel = require('../models/cartModel')
let { isValidObjectId } = require('mongoose');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel')
let { isValidId, isValidNumbers} = require('../utils/validator')



const createCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body;
        let {cartId, productId, quantity } = data
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "body can not be empty" })
        }
        if (!isValidId(userId)) {
            return res.status(400).send({ status: false, message: "invalid userId" })
        }
        let findUser = await userModel.findById(userId)
        if (!findUser) {
            return res.status(404).send({ status: false, message: `User with this Id ${userId} doesn't exist` })
        }
        if (!productId) {
            return res.status(400).send({ status: false, message: "productId is mandatory" })
        }
        if (!isValidId(productId)) {
            return res.status(400).send({ status: false, message: "please provide a valid productId" })
        }
        let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) {
            return res.status(400).send({ status: false, message: `product with this ID ${productId}does not exist` })
        }
        if (!quantity) {
            quantity = 1  // MINIMUM QUANTITY 1 || ATLEAST 1 QUANTITY MUST BE PRESENT
        }
        // quantity = JSON.parse(quantity)
        if (quantity || quantity == '') {
            if (!isValidNumbers(quantity)) {
                return res.status(400).send({ status: false, message: "Quantity is not Valid" })
            }
        }
        if (cartId || cartId == '') {
            if (!isValidId(cartId)) {
                return res.status(400).send({ status: false, message: "Cart id is not Valid" })
            }
        }
        let findUserCart = await cartModel.findOne({ userId: userId })
        if (!findUserCart) {
            let createData = {
                userId,
                items: [{ productId: productId, quantity: quantity }],
                totalPrice: (findProduct.price * quantity).toFixed(2),    // toFixes()= how many digits would be there after the decimals  
                totalItems: 1
            }
            let newCart = await cartModel.create(createData);
            return res.status(201).send({ status: false, message: "success", data: newCart })
        }

        if (findUserCart) {
            if (!cartId) {
                return res.status(400).send({ status: false, message: "Please provide cart id to add items in the cart" })
            }
            if (findUserCart._id.toString() !== cartId) {
                return res.status(400).send({ status: false, message: "Cart id is not matching" })
            }
            let price = findUserCart.totalPrice + quantity * findProduct.price
            console.log(price)
            let arr = findUserCart.items
            for (let i = 0; i > arr.length; i++) {
                if (arr[i].productId.toString() == productId) {
                    arr[i].quantity += quantity
                    let updatedCart = {
                        items: arr,
                        totalPrice: price,
                        totalItems: arr.length
                    };
                    let responseData = await cartModel.findOneAndUpdate({ _id: findUserCart.id }, { $set: updatedCart }, { new: true })
                     return res.status(201).send({status: true, message: "success", data: responseData })
                }
            }
            arr.push({productId: productId, quantity: quantity})
            let updateCart = {
                items: arr,
                totalPrice: price,
                totalItems: arr.length
            }
            let responseData = await cartModel.findOneAndUpdate({_id: findUserCart._id},{$set: updateCart},{new: true})
            return res.status(201).send({status: true, message: "success", data: responseData})
        }

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const updateCart = async function (req, res) {
    try {

        userId = req.params.userId;

        if (!isValidId(userId)) return res.status(400).send({ status: false, message: "User id is invalid." });

        let checkUser = await userModel.find({ _id: userId, isDeleted: false })
        if (!checkUser) return res.status(404).send({ status: false, message: "User not found." });


        const { cartId, productId, removeProduct } = req.body;

        if (!cartId) return res.status(400).send({ status: false, message: "CartID is missing" });
        if (!productId) return res.status(400).send({ status: false, message: "ProductID is missing" });

        if (!isValidId(cartId)) return res.status(400).send({ status: false, message: "Cart id is invalid." });
        if (!isValidId(productId)) return res.status(400).send({ status: false, message: "Product id is invalid." });

        if (!removeProduct) return res.status(400).send({ status: false, message: "Remove product is mandatory." });
        if (!(removeProduct == 0 || removeProduct == 1))
            return res.status(400).send({ status: false, message: "Remove product can only be 0 or 1." });


        let checkCartinDB = await cartModel.findById(cartId)
        if (!checkCartinDB) return res.status(404).send({ status: false, message: "Cart does not found in DB." });

        let checkProductinDB = await productModel.findById(productId)
        if (!checkProductinDB) return res.status(404).send({ status: false, message: "Product does not found in DB." });


        if (checkCartinDB.items.length == 0) return res.status(400).send({ status: false, message: "No products in cart or cart is empty" });

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productId == productId) {
              const priceChange = cart[i].quantity * findProduct.price;
      
              //when removeProduct is 0
      
              if (removeProduct == 0) {
                const productRemove = await cartModel.findOneAndUpdate(
                  { _id: cartId },
                  {
                    $pull: { items: { productId: productId } },
                    totalPrice: findCart.totalPrice - priceChange,
                    totalItems: findCart.totalItems - 1,
                  },
                  { new: true }
                );
                return res.status(200).send({
                  status: true,
                  message: "Success",
                  data: productRemove,
                });
              }
      
              //when removeProduct is 1
      
              
                if (cart[i].quantity == 1 && removeProduct == 1) {
                  const priceUpdate = await cartModel.findOneAndUpdate(
                    { _id: cartId },
                    {
                      $pull: { items: { productId : productId} },
                      totalPrice: findCart.totalPrice - priceChange,
                      totalItems: findCart.totalItems - 1,
                    },
                    { new: true }
                  );
                  return res.status(200).send({
                    status: true,
                    message: "Success",
                    data: priceUpdate,
                  });
                }
      
             // decrease the products quantity by 1
      
                cart[i].quantity = cart[i].quantity - 1;
                const updatedCart = await cartModel.findByIdAndUpdate(
                  { _id: cartId },
                  {
                    items: cart,
                    totalPrice: findCart.totalPrice - findProduct.price,
                  },
                  { new: true }
                );
                return res.status(200).send({
                  status: true,
                  message: "Success",
                  data: updatedCart,
                });
              
            }
          }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
const getCartDetails = async function (req, res) {
    try {
      let userId = req.params.userId;

  if(!isValidObjectId(userId)){
    return res.status(400).send({status:false,message:"Invalid User Id"})
  }
    
      let findCart = await cartModel.findOne({ userId: userId }).populate("items.productId", { title: 1, price: 1, productImage: 1 })
      if (!findCart){
        return res.status(404).send({ status: false, message: `No cart found with given userId` });
      }
     return res.status(200).send({ status: true, message: "Success", data: findCart });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };


//=====================deleteApi=================
  const cartDeletion = async function (req, res) {
    try {
      
      const userId = req.params.userId;
      if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, msg: "invalid userId" });
      }
  
      const checkUser = await userModel.findOne({ _id: userId });
      if (!checkUser) {
        return res.satus(404).send({ status: false, msg: "User doesn't esxist" });
      }
    
      const checkCart = await cartModel.find({ userId: userId });
      if (!checkCart) {
        return res.status(404).send({ sttaus: false, msg: "cart doesn't exist" });
      }
      
      const deleteCart = await cartModel.findOneAndUpdate( { userId: userId },{ $set: { items: [], totalPrice: 0, totalItems: 0 } },{ new: true });
     
      return res.status(204).send({ status: true, message: "cart deleted", data:deleteCart})
   
    } catch (error) {
      
      return res.status(500).send({ status: false, msg: error.message });
    }
  };
module.exports = { createCart, updateCart, getCartDetails,cartDeletion }