const express = require('express')

const router = express.Router()

/**IMPORTING MODULES_____________________________________________________________ */
const userController=require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const middleware = require('../middleware/auth')



/* USER API________________________________________________________________________*/
router.post('/register', userController.createUser)
router.post('/login',userController.userLogin)
router.get('/user/:userId/profile', middleware.authentication, userController.getUser)
router.put('/user/:userId/profile' ,middleware.authentication,middleware.authorisation, userController.updateUser)

/*PRODUCT API_______________________________________________________________________*/

router.post('/products', productController.createProduct)
router.get('/products', productController.getProduct)
router.get('/products/:productId', productController.getProductsById)
router.put('/products/:productId' , productController.updateProduct)
router.delete("/products/:productId", productController.deleteProduct)

/**CART API________________________________________________________________________ */
router.post('/users/:userId/cart' , middleware.authentication, cartController.createCart)  
router.put('/users/:userId/cart' ,middleware.authentication, cartController.updateCart)
router.get('/users/:userId/cart', middleware.authentication,cartController.getCartDetails)
router.delete('/users/:userId/cart',middleware.authentication, cartController.cartDeletion)



/**ORDER API_______________________________________________________________________ */
router.post('/users/:userId/orders' ,middleware.authentication,middleware.authorisation, orderController.createOrder)
router.put('/users/:userId/orders' ,middleware.authentication,middleware.authorisation, orderController.updateOrder)

router.all('/*',function(req,res){
   res.send("route is wrong" )
})

module.exports = router;
