const express = require('express')

const router = express.Router()

router.get('/trial-api' , function(req,res){
   res.send("Yes it is working.")
})

module.exports = router;