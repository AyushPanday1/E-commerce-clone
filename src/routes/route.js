const express = require('express')

const router = express.Router()

const userController=require('../controllers/userController')
const productController = require('../controllers/productController')

router.get('/trial-api' , function(req,res){
   res.send("Yes it is working.")
})
router.post('/register', userController.createUser)
router.post('/login',userController.userLogin)
router.get('/user/:userId/profile', userController.getUser)
router.put('/user/:userId/profile' , userController.updateUser)

//////////////////////////////////////////PRODUCT API///////////////////////////////////////////////////////////

router.post('/products', productController.createProduct)
router.get('/products/:productId', productController.getProductsById)



module.exports = router;
