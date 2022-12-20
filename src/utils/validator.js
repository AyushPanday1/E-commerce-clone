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
    const passwordRegex =/^(?=.\d)(?=.[a-z])(?=.*[A-Z]).{8,15}$/
    return passwordRegex.test(password);
  };


/*_______________________VALIDATION FOR AWS FILE________________________ */
const isValidFile = (img) => {
    const regex = /(\/*\.(?:png|gif|webp|jpeg|jpg))/.test(img)
    return regex
}


/*_______________________VALIDATION FOR PINCODE________________________ */
const validPin = function(pincode){
    let re =/^[0-9]{6,6}$/
    return re.test(pincode)
}

/*_______________________VALIDATION FOR STREET ADDRESS________________________ */
const isValidStreet = function (street){
    let re = /^.?\s[N]{0,1}([-a-zA-Z0-9]+)\s\w*$/

    return re.test(street)

}

module.exports = {isValidRequestBody,isValidName,validatePhone,isValidEmail,isValidPassword,validPin,isValidStreet,isValidFile}

