const Usermodel = require('../models/userModel');
const {isValidRequestBody,isValidName,validatePhone,isValidEmail,isValidPassword,validPin,isValidStreet,isValidFile} = require('../utils/validator');







const getProduct = async function (req, res) {
    try {
      let { size, name, priceGreaterThan, priceLessThan, priceSort } = req.query;
  
      const filter = { isDeleted: false };
      if (size) {
        filter["availableSizes"] = size}
  
      if (name) {
        if (!isValidName(name))return res.status(400).send({ stastus: false, message: "Invalid naming format!" });
       
        filter["title"] = name }
  
      if (priceGreaterThan) {
        filter["price"] = { $gt: priceGreaterThan }}
  
      if (priceLessThan) {
        filter["price"] = { $lt: priceLessThan }}
  
      if ( priceGreaterThan && priceLessThan ) {
  
           if ( priceGreaterThan == priceLessThan ) return res.status(400).send({status: false,message: "priceGreaterThan and priceLessThan can't be equal"});
  
           filter["price"] = { $gt: priceGreaterThan, $lt: priceLessThan }}
  
      if (priceSort) {
        if (priceSort == 1) {
          let find = await productModel.find(filter).sort({ price: 1 });
          if (!find) {
            return res.status(400).send({
              status: false,
              message: "No data found that matches your search",
            });
          }
          return res.status(200).send({ status: true, message:"Success", data:find });
        }
        if (priceSort == -1) {
          let find2 = await productModel.find(filter).sort({ price: -1 });
          if (!find2) {
            return res.status(404).send({
              status: false,
              message: "No data found that matches your search1",
            });
          }
          return res.status(200).send({ status: true, message: "Success", data:find2 });
        }
      }

      const finaldata = await productModel.find(filter);
  
      if (!finaldata ||  finaldata.length == 0) {return res.status(404).send({
        status: false,
        message: "No data found that matches your search 2"})}


      return res.status(200).send({ status: true, message: "Success", data: finaldata });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };