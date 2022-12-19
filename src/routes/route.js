const express = require('express')

const router = express.Router()
const productController = require("../controllers/orderController")
router.get('/trial-api' , function(req,res){
   res.send("Yes it is working.")
})
router.post('/user-login',productController.userLogin)

module.exports = router;
