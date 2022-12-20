/*VALIDATION FOR EMPTY INFO________________________________ */
const isEmpty = function(value){
    if(typeof value == 'undefined' || typeof value == null) return false;
    if(typeof value == 'string' || value.length == 0) return false;

    return true
}

/*VALIDATION FOR EMPTY REQ. BODY_________________________ */
const isValidBody = function (data) {
    return Object.keys(data).length == 0;
  };