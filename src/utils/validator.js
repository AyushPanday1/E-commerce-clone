const { default: mongoose } = require("mongoose")

/*_______________________VALIDATION FOR EMPTY BODY________________________ */
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

/*_______________________VALIDATION FOR NAME________________________ */
const isValidName = (value) => {
    const regex =/^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ])$/.test(value)
    return regex
}


/*_______________________VALIDATION FOR PHONE NUMBER________________________ */
const validatePhone = function (phone) {
    var re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (typeof (phone) == 'string') {
        return re.test(phone.trim())
    } else {
        return re.test(phone)
    }
};

/*_______________________VALIDATION FOR EMAIL________________________ */
const isValidEmail = (email) => {
    const regex = /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/.test(email)
    return regex
}

/*_______________________VALIDATION FOR PASSWORD________________________ */
const isValidPassword = function (password) {
    const passwordRegex =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/
    return passwordRegex.test(password);
  };


/*_______________________VALIDATION FOR AWS FILE________________________ */
const isValidFile = (img) => {
    const regex = /(\/*\.(?:png|gif|webp|jpeg|jpg))/.test(img)
    return regex
}

/*______________________SIZE VALIDATION_________________________________ */
const isValidSize = function (size) {
    return ["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(size) !== -1;
  };

/*_______________________VALIDATION FOR PINCODE________________________ */
const validPin = function(pincode){
    let re =/^[0-9]{6,6}$/
    return re.test(pincode)
}

/*_______________________VALIDATION FOR STREET ADDRESS________________________ */
const isValidStreet = function (street){
    let re = /^[a-zA-Z0-9 -\.]+$/

    return re.test(street)

}
const isValidTitle = function(title){
    let titleRegex = /^[A-Za-z ][A-Za-z0-9!@#$%^&* ]*$/    //this regex will cointain everything (a,A,@,*$%) in title
    return titleRegex.test(title)
}

const isEmpty= function(value){
    if(typeof value === "string" && value.trim().length === 0) return false;
    return true 
}

const isValidPrice = (value) => {
    const regEx =/^[1-9]\d{0,8}(?:\.\d{1,2})?$/
    const result = regEx.test(value)
    return result
  }

  const isValidInstallments = function(value){
    let regex = /^[0-9]*$/;
    return regex.test(value)
  }

  const isValidId = function(value){
    return mongoose.Types.ObjectId.isValid(value)
  }

module.exports = {isValidId, isValidRequestBody,isEmpty,isValidSize,isValidInstallments, isValidPrice, isValidTitle,isValidName,validatePhone,isValidEmail,isValidPassword,validPin,isValidStreet,isValidFile}

