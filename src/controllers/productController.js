const ProductModel = require('../models/productModel')
const aws = require("../aws/awsConfig")
const { isValid ,isValidPrice, isValidTitle,isValidFile, isValidInstallments} = require('../utils/validator');
const productModel = require('../models/productModel');

const createProduct = async (req,res)=>{
    try{
let data = req.body;
let {title, description, price, currencyId,currencyFormat,isFreeShipping, productImage, style, availableSizes, installments,deletedAt , isDeleted} = data
if(Object.keys(data).length==0){
    return res.status(400).send({status: false, message: " body can not be empty"})
}

if(!title || !isValid(title)){
     return res.status(400).send({status: false, message: "title is mandatory"})
}
if(!isValidTitle(title)){
    return res.status(400).send({status:false, message: "invalid title"})
}
let uniqueTitle = await ProductModel.findOne({title:title})
if(uniqueTitle){
    return res.status(400).send({status:false, message: "this title already exists"})
}
if(!description|| !isValid(description)){
    return res.status(400).send({status: false, message: "description is mandatory"})
}
if(!price || !isValid(price)){
    return res.status(400).send({status: false, message: "price is mandatory"})
}
if(!isValidPrice(price)){
    return res.status(400).send({status: false, message: "invalid price"})
}
if (!currencyId)
return res.status(400).send({ status: false, message: "Currency Id is required" })

if (currencyId != "INR")
return res.status(400).send({status: false,msg: "Currency will be in INR"})

if(!currencyFormat){
    return res.status(400).send({ status: false, message: "CurrencyFormat is required" })
}
if (currencyFormat != "₹")
return res.status(400).send({status: false,msg: "CurrencyFormat will be in ₹"})

if(isFreeShipping){
if(!(isFreeShipping== "true" || isFreeShipping == "false")){
    return res.status(400).send({status: false,msg: "isfreeshiping either true or false"})
}
}


////////////////////////////AWS FILE UPLOADING/////////////////////////////////////////////////////
let files = req.files
if(files && files.length>0){
    if(!isValidFile(files[0].originalname)){
        return res.status(400).send({status: false, message: " formats that are accepted jpeg/jpg/png only."})
    }

let uploadedFileURL = await aws.uploadFile(files[0]);
data.productImage = uploadedFileURL     //assigining the file URL in request body
}else{
return res.status(400).send({status: false, message: "product image is required"})
}

if(!isValid(style)){
    return res.status(400).send({status:false, message: "style can not be empty"})
}
if(availableSizes){
if (availableSizes!="S" && availableSizes!="XS" && availableSizes!="M" && availableSizes!="X" && availableSizes!="L" && availableSizes!="XXL" && availableSizes!="XL") {
    return res.status(400).send({status:false,message:"Available sizes are XS,S,M,L,X,XXL,XL, please enter available size"})
 }}

if(!isValid(installments)|| !isValidInstallments(installments)){
    return res.status(400).send({status: false, message: "installments must be in numbers"})
}


//////////////////////////////CREATING PRODUCT////////////////////////////////////////////////////////
let productCreate = await productModel.create(data)
return res.status(201).send({status: true, message: "success", data: productCreate})
}
catch(error){
    return res.status(500).send({status: false, message:error.message})
}
}
module.exports = {createProduct}